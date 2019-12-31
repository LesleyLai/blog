---
id: const-correcness-std-function
title: "std::function的Const正确性问题"
lang: zh
create: '2019-12-31'
lastModify: '2019-12-31'
categories:
- code
- cpp
---


`const`类型限定符（type qualifier）是C++语言设计的一大亮点。我们围绕着这个语言特性发明了“`const`正确性” （const correctness）的实践来防止`const`对象遭到改变。对大多数的类别，“`const`正确性”的规则都不难被遵守。但是对使用到类型擦除的类，“`const`正确性”更难被遵守。不幸的是，因为短见，C++标准库中的[`std::function`](https://zh.cppreference.com/w/cpp/utility/functional/function)类就成了一个“`const`正确性”不被遵守的例子。

<!-- end -->

## 问题根源
`std::function`的成员函数`operator()`被标记为`const`却可以改变内在的函数对象。比如说：

```cpp
const std::function<int()> f {[x=0]() mutable { return ++x; }};
f(); // returns 1
f(); // returns 2
```

文档N4348[^1]第一次指出这个问题。并且直言

> This violates not only basic tenets of `const-`correctness, but also the data race avoidance guarantees in [res.on.data.races]/p3, which states that "A C++ standard library function shall not directly or indirectly modify objects accessible by threads other than the current thread unless the objects are accessed directly or indirectly via the function's non-`const` arguments, including `this`".

[^1]: [Making std::function safe for concurrency](http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2015/n4348.html)

大意是说`operator()`的语义不仅仅违法了“`const`正确性”基本原则，更破坏了标准库无数据争用(data race)的保证。

## 解决办法
类似于`function`的类需要争对`const`以及非`const`有分别的模板特化（template specializations）：

```cpp
template<class Sig> class function; // not defined

template<class R, class... Args>
  class function<R(Args...)>;

template<class R, class... Args>
  class function<R(Args...) const>;
```

`const`特化的`operator()`应该被标记为`const`，而它的构造函数不可以接受mutable的函数对象。

```cpp
function<int() const> f1 {[x=0]() { return x; }};
f1() // ok;

function<int() const> f2 {[x=0]() mutable { return ++x; }}; // Does not compile
```

反过来说非`const`特化的`operator()`不会被标记为`const`，所以你不能调用`const`版本的`function`：

```cpp
function<int()> f1 {[x=0]() mutable { return ++x; }};
f1(); // ok

const function<int()> f2 {[x=0]() mutable { return ++x; }};
f2(); // Does not compile
```

## 展望未来
我并不期望`std::function`会做出破坏向后兼容的更改。截至我写这篇博文时，最大的希望在已被提议的`std::unique_function` [^2]。它不仅修复`std::function`中“`const`正确性”的bug，而且还带来了其他的改善。如果C++标准中有了`std::function`替代品，我们就可以弃用(deprecate)`std::function`如同当年的`std::auto_ptr`。与此同时，我们也可以自己实现`unique_function`，[我的Github](https://github.com/Beyond-Engine/functions)就有一个库实现了这个功能。

[^2]: [P0228R3 unique_function: a move-only std::function](http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2019/p0228r3.html)
