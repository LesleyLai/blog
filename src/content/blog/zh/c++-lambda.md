---
title: "C++ lambda表达式教程"
created: 2019-03-25
modified: 2020-01-10
tags:
  - cpp
  - code
---

C++11 引入了 lambda 表达式，而之后的语言版本不断的对 lambda 表达式进行改善。lambda 表达式表示一个匿名函数。如今，lambda 表达式已成为 C++语言的核心组成部分，而这篇博文就是给还不了解 lambda 表达式的 C++程序员讲解它的使用方法以及原理。

<!-- end -->

## 基本用法

编程中一个常见的任务是将函数作为参数传递给另外的函数。举一个例子，C++的[标准算法库](https://zh.cppreference.com/w/cpp/algorithm)中很多的算法都应用给定的函数到一个范围。不幸的是，在 C++11 之前，可调用的对象在 C++中只有函数指针与函数对象。它们的使用都比较复杂，这种状况甚至在很大程度上阻止了了标准算法库的普及使用。

与此同时，非常多的编程语言支持“匿名函数”功能。在 C++11 之前，C++使用元编程来模拟这个特性。例如 Boost 库就包含了[boost.lambda](http://www.boost.org/libs/lambda)库。因为当时语言自身的局限性，这些元编程的技术都存在各种问题，例如缓慢的编译速度和古怪的语法。因此，C++11 在核心语言中加入了 lambda 表达式。C++标准中有一个把 lambda 表达式使用在`sort`算法上的例子：[^1]

[^1]:

见[**\[expr.prim.lambda\]**](http://eel.is/c%2B%2Bdraft/expr.prim.lambda#1)

```cpp
#include <algorithm>
#include <cmath>

void abssort(float* x, unsigned n) {
    std::sort(x, x + n,
        [](double a, double b) {
            return (std::abs(a) < std::abs(b));
        });
}
```

在函数`abssort`中，我们把一个 lambda 表达式作为二元比较函数传给了`std::sort`。我们也可以使用一个普通的函数来实现同一个目的：

```cpp
#include <algorithm>
#include <cmath>

bool abs_less(double a, double b) {
    return (std::abs(a) < std::abs(b));
}

void abssort(float* x, unsigned n) {
    std::sort(x, x + n, abs_less);
}
```

我们仍然不知道奇怪的`[]`语法是用来干什么的，而这是我们接下来的话题。

## 捕获 (capture)

上面的示例展示了 lambda 表达式的基本用法，但是 lambda 表达式可以做更多的事情。lambda 表达式和普通函数之间的主要区别是它可以*捕获*状态，然后我们可以在 lambda 体中使用捕获的变量。在如下的例子中，我们把大于某个阈值的元素从原来的`vector`复制给新的`vector`:

```cpp
// Get a new vector<int> with element above a certain number in the old vector
std::vector<int> filter_above(const std::vector<int>& v, int threshold) {
    std::vector<int> result;
    std::copy_if(
      std::begin(v), std::end(v),
      std::back_insert_iterator(result),
      [threshold](int x){return x > threshold;});
    return result;
}

// filter_above(std::vector<int>{0, 1, 2, 4, 8, 16, 32}, 5) == std::vector<int>{8, 16, 32}
```

如上的代码复制捕获了`threshold`变量。lambda 表达式支持两种不同的捕获符，分别是复制捕获以及引用捕获（`[&]`）。举个例子，`[x, &y]`复制捕获了变量`x`并且引用捕获了`y`。你也可以默认捕获所有在作用域（scope）中的变量，`[=]`复制捕获所有的变量而`[&]`引用捕获所有的变量。

我们把如同 lambda 表达式这样保存了相应自由变量环境的函数叫做[**闭包**](<https://zh.wikipedia.org/wiki/%E9%97%AD%E5%8C%85_(%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%A7%91%E5%AD%A6)>),而几乎所有现有的编程语言都对闭包有着一定的支持。不同的是，除了 C++以外所有我知道的语言都是隐性地捕获所有在当前环境中的变量。

我们可以通过默认引用捕获（`[&]`）来模仿这些语言的行为。 但是，默认引用捕获在 C++中不是一个好主意。 如果 lambda 的生存期长于捕获的对象，则可能导致悬空引用（dangling）的问题。 例如，我们可以将回调传递给一个异步函数:

```cpp
auto greeter() {
    std::string name{"Lesley"};

    return std::async([&](){
        std::cout << "Hello " << name << '\n';
    });
}
```

如上的代码产生了未定义行为（undefined behavior）因为在异步函数被运行时`name`可能已经被销毁了。只有在 lambda 的生存期很短时使用默认引用捕获才不会产生问题。将 lambda 传递给 STL 算法就是一个很好的可以使用默认引用捕获例子。

在有垃圾回收的语言中这种默认捕获自然不会造成任何的问题。[Rust](https://www.rust-lang.org/)语言使用借用检查器（borrow checker）来避免这些问题。反之，C++的 lambda 表达式需要程序员显式表达被捕获对象的所有权，这种办法比其他的语言更加的灵活，但反过来也需要程序员考虑更多的东西。

## Lambda 的原理

到目前为止，我们已经讨论了 lambda 表达式的很多用法。 但是，好奇的读者可能会开始怀疑，C++的 lambda 表达式到底是什么？它是像函数语言中的闭包一样的原生语言构造吗？不过，在讨论 lambda 表达式的实现原理之前，我们首先来讨论 C++98 时代就有的函数对象。

### 函数对象 (Function Object)

当一个对象可以像是一个函数一样被调用时，我们把它叫做函数对象。重载类中的`operator()`操作符是实现函数对象对象的方法。比如说，如下是我们`abs_less`例子的函数对象版本：

```cpp
#include <algorithm>
#include <cmath>
class abs_less {
  bool operator()(double a, double b) {
    return (std::abs(a) < std::abs(b));
  }
};

void abssort(float* x, unsigned n) {
    std::sort(x, x + n, abs_less{});
}
```

函数对象比普通的函数更灵活，因为它们可以像一般的对象一样存储数据。 让我们用函数对象实现之前的`filter_above`例子：

```cpp
template <typename T>
class GreaterThan {
public:
  GreaterThan(T threshold): threshold_{threshold} {
  }

  bool operator()(const T& other) noexcept {
    return other > threshold_;
  }

private:
  T threshold_;
};

std::vector<int> filter_above(const std::vector<int>& v, int threshold) {
    std::vector<int> result;
    std::copy_if(std::begin(v), std::end(v), std::back_insert_iterator(result), GreaterThan{threshold});
    return result;
}
```

<aside style="margin-top: -140px;">

在以上的代码中我使用了 C++17 的[类模板实参推导(CTAD)](https://zh.cppreference.com/w/cpp/language/class_template_argument_deduction)特性。在之前的 C++版本中，我们需要显式写明`GreaterThan<int>{threshold}`。

</aside>

### 从函数对象到 lambda 表达式

在 C++中，lambda 表达式是函数对象的[语法糖](https://zh.wikipedia.org/wiki/%E8%AF%AD%E6%B3%95%E7%B3%96)。换言之，编译器会把 lambda 表达式转译为函数对象。你可以使用[C++ Insights](https://cppinsights.io/)网站来看到我们的`abssort`被编译器翻译成的代码：

```cpp
#include <algorithm>
#include <cmath>

void abssort(float * x, unsigned int n)
{

  class __lambda_6_9
  {
    public: inline /*constexpr */ bool operator()(float a, float b) const
    {
      return (std::abs(a) < std::abs(b));
    }

    ...
  };

  std::sort(x, x + n, __lambda_6_9{});
}
```

我们可以看到 lambda 表达式被翻译为一个默认构造的局部类，因此 C++lambda 表达式可以实现一些在别的语言中无法拥有的功能。例如我们可以把 lambda 表达式作为基类来继承或者给 lambda 表达式可变状态，虽然我并没有发现这些功能有太多的实际应用。

C++编译器会生成 lambda 表达式的类型，但是这些类型的名字是不会暴露给程序员的。尽管如此，对于这些类型，类型推论（type inference）以及模板仍然工作如常。我们也可以通过`decltype`来直接使用这些类型。如下是一个在[cppreference](https://zh.cppreference.com/w/cpp/language/decltype)上的例子：

```cpp
auto f = [](int a, int b) -> int
    {
        return a * b;
    };

decltype(f) g = f;
```

在 C++与[D 语言](https://dlang.org/)的社群中，这种无名类型有时候会被戏称为“伏地魔类型”（Voldemort's types）因为我们没有办法直接说出这些类型的名字但是仍然可以间接使用它们。

## 带有初始化器的捕获符

现在你理解了 lambda 表达式的本质不过是一个函数对象，你也许会期望 lambda 表达式能够储存任意的值而不仅仅是被捕获的本地变量。幸运的是 C++14 加入了通用捕获功能[^3]。你在 C++14 中可以使用初始化器来为 lambda 表达式引入新的变量。

```cpp
[x = 1]{ return x; // 1 }
```

### 捕获仅可移动的类型

Rust 语言的 lambdas 表达式可以夺取被捕获对象的所有权（ownership）。C++ lambda 对这种“移动捕获”没有特殊的支持，但是 C++14 中的通用捕获可以用来实现这种功能：

```cpp
// unique_ptr是move only的类型
auto u = make_unique<some_type>(
  some, parameters
);
// 将unique_ptr的所有权移入lambda
go.run([u=move(u)] {
  do_something_with( u );
});
```

[^3]:

[C++14 Language Extensions: Generalized lambda captures](https://isocpp.org/wiki/faq/cpp14-language#lambda-captures)

## 立即调用 lambda (Immediately Invoked Lambda)

你可以在构建 lambda 表达式的同时调用它们。

```cpp
[]() { std::puts("Hello world!"); }();
```

立即调用函数表达式（IIFE）在 Javascript 程序中非常的常见，Javascript 程序员经常使用它们来引入新的作用域。在 C++中我们不需要使用 Lambda 来引用作用域，因此立即调用 lambda 在 C++程序中就不是那么的常见。

然而如果你希望遵守尽量让变量成为`const`的最佳实践，立即调用 lambda 在 C++任然有自己的妙用。许多对象有一个复杂的初始化过程，而在初始化之后就不会再被改变了。如果这种初始化的过程有被封装的价值，你也许会考虑写一个工厂函数（factory function）或者使用建造者模式（Builder pattern）。然而在当这种初始化只被使用一次的时候，很多的人会停止使用`const`。假设你需要从`stdin`读取数行到一个`vector`，你可能会将代码写为如下：

```cpp
std::vector<std::string> lines;
for (std::string line;
     std::getline(std::cin, line);) {
    lines.push_back(line);
}
```

由于我们要在循环中对其进行修改，所有似乎没有办法让`lines`成为不变量。立即调用 lambda 解决了这一难题。 有了它，你既可以拥有`const`的`lines`又不需要引入复杂的设计模式：

```cpp
const auto lines = []{
    std::vector<std::string> lines;
    for (std::string line;
         std::getline(std::cin, line);) {
        lines.push_back(line);
    }
    return lines;
}();
```
