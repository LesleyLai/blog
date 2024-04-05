---
id: std-function
title: "C++中的std::function到底是什么,为什么我们需要它？"
lang: zh
created: "2021-01-18"
modified: "2021-12-19"
tags:
  - cpp
  - code
---

昨天，有人在[#include<C++>](https://www.includecpp.org/discord/)的 discord 服务器上问了关于为社么我们需要`std::function`的问题。
下面是我对这个问题的回答。

## 即使参数类型以及返回类型都完全相同，C++中的可以被当作函数一样被调用的对象也可以有不同的类型

Lambda 表达式可以被认为是定义有`operator()`的类的语法糖。比如说

```cpp
int x = 3;
auto lambda = [x](int y) { return x + y; };
```

大体上等同于

```cpp
struct __Lambda {
  int x;

  int operator()(int y) const {
    return x + y;
  }
};

int x = 3;
auto lambda = __Lambda { .x = x };
```

因此，每个 lambda 表达式都有一个独特的类型。例如，在下面的片段中，

```cpp
int x, z;

auto lambda = [x](int y) { return x + y; };
auto lambda2 = [x, z](int y) { return x + y + z; };
```

尽管`lambda`和`lambda2`都接收一个`int`并返回一个`int`，它们有着不一样的类型。

C++还有普通的函数，
它们又和实现了`operator()`的类不同。

## 对`std::function`的需求

被当作函数一样被调用的对象

那么，我们如何存储一个接收一个`int`并返回一个`int`的一个可调用的对象，并且不考虑它的具体类型？

我们需要`std::function`来完成这样的任务。比如说：

```cpp
struct S {
  std::function<int(int)> func;
};
```

以这种方式存储可调用程序的典型用例是一个 task system。
你可能想在一个容器中存储回调，以便于以后执行：

```cpp
struct TaskQueue {
  std::queue<std::function<void()>> queue;
  std::mutex mutex;
  std::condition_variable ready;

  // 我省略了各个成员函数的实现
  ...
};

```

## 类型擦除（Type Erasure）

为了使`func`同时接受`lambda`和`lambda2`,
`std::function`需要有可以接受任何符合要求的函数对象或普通函数的构造函数。
我们需要使用*类型擦除*来实现这种行为。

在 C++中实现类型擦除的方法有很多，不过这对于这篇文章来说有些超纲。
大体上的想法是,`std::function`需要储存一个函数指针以及另外一些用于存放 lambda 捕获的空间。
因为 lambda 表达式（或函数对象）可以有任意大小的捕获，这些额外的数据需要在堆上分配。
不过，所有主要的`std::function`实现都会进行*小缓冲区优化*（small buffer optimization），如果你的 lambda 小到可以装入预定义的容量。
在这种情况下，所有的数据都可以直接在`std::function`对象本身内部分配，而不需要进行额外的堆分配。
