---
id: c++-lambda
title: "C++ Lambda Tutorial"
lang: en
create: '2019-03-25'
lastModify: '2019-03-25'
categories:
- cpp
- code
---

C++ lambda expressions are a construct added to C++ back in C++11, and it continues to evolve in each version of the C++ standard. A core part of the language nowadays, lambda expressions enable programmers of writing anonymous functions in C++. This post describes what a lambda is, provides some basic usages, and outlines their benefits.

<!-- end -->

## Basic Usage
Passing functions as a parameter to customize the behavior of functions is a common task in programming. For example, since the conception of [standard algorithms library](https://en.cppreference.com/w/cpp/algorithm), a lot of the algorithms in the `<algorithm>` can take an invokable entity as a callback. However, before C++11, the only kinds of invokable entities in C++ are function pointers and function objects. Both of them require quite a bit of boilerplate, and this cumbersomeness even impedes the adaption of the standard algorithm library in practice.

On the meantime, lots of programming languages support features of [anonymous functions](https://en.wikipedia.org/wiki/Anonymous_function). Before C++11, such features are achieved by metaprogramming. For example, the Boost C++ library provided its [boost.lambda](http://www.boost.org/libs/lambda) library. Those metaprogramming hacks are slow to compile and not performant; moreover, they require more boilerplate then one want. Thus, in C++11, lambda expressions are added as a language extension. The ISO C++ Standard shows usage of a lambda expression as a comparator of the `sort` algorithm. [^1]

[^1]:
  See [**\[expr.prim.lambda\]**](http://eel.is/c%2B%2Bdraft/expr.prim.lambda#1)

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

Inside the function `abssort`, we passed lambda into `std::sort` as a comparator. We can write a normal function to achieve the same purpose:

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

We still do not know what the strange `[]` syntax is for, and that is our topic next.

## Captures
The above example shows the basic usage of Lambdas, but Lambdas can do more. The main difference between a lambda and a regular function is that it can "capture" state, and then we can use the captured value inside the lambda body. For example, the below function gets a new vector with the element above a certain number in the old vector.

```cpp
// Get a new vector<int> with element above a certain number in the old vector
std::vector<int> filter_above(const std::vector<int>& v, int threshold) {
    std::vector<int> result;
    std::copy_if(std::begin(v), std::end(v), std::back_insert_iterator(result),
                           [threshold](int x){return x > threshold;});
    return result;
}

// filter_above(std::vector<int>{0, 1, 2, 4, 8, 16, 32}, 5) == std::vector<int>{8, 16, 32}
```

The above code captures `threshold` by value. The `[]` construct is called a *capture clause*. There are two kinds of captures, capture by value or capture by reference (`[&]`). For example, `[x, &y]` - capture `x` by value and `y` by a reference explicitly. You can also have a default capture clause, for example,  `[=]` captures everything in the current environment by value and `[&]` captures everything by reference.

A function that store an environment is called a [*Closure*](https://en.wikipedia.org/wiki/Closure_(computer_programming)); almost all modern programming languages support closures. However, in all languages that I know except C++, the capture list is implicit. In those languages, a closure captures all the bindings from the current environment.

We can mimic the behaviors in those languages by capturing everything by reference (`[&]`). However, default capture is a poor idea in C++; it leads to potential dangling problems if the lambda lives longer than the captured object. For example, we can pass a callback to asynchronous functions:

```cpp
auto greeter() {
    std::string name{"Lesley"};

    return std::async([&](){
        std::cout << "Hello " << name << '\n';
    });
}
```

The above code is undefined behavior since `name` may be destroyed when we execute the asynchronous operation.

The implicit capture strategy works in garbage-collected languages. [Rust](https://www.rust-lang.org/) gets away with implicit capture because of its borrow checker. On the contrary, by requiring the programmer to be explicit about ownership, the C++ approach provides more flexibility than the counterparts in other programming languages.

## What is Lambda
We discussed quite a lot of usage of Lambda so far. However, curious readers may start to wonder, what *exactly* is a C++ Lambda? Is it a primitive language construct like closures in functional languages? However, before I talk about the internal of Lambda, I will first talk about a construct date back to C++98 era, **function objects**.

<aside style="margin-top: -90px;">

Some C++ programmers call the function objects "functors." It is a misnomer that we should avoid. The reason is that functional programmers usually define [functor](https://en.wikipedia.org/wiki/Functor) as "mappable" structures that satisfy specific "functor laws". This definition of a functor is equally useful in C++. For example, the standard [ranges](https://en.cppreference.com/w/cpp/ranges) are pretty much functors. Also, if the types `std::optional`, `std::future`, and `expected` support chaining operations, then they become functors. Various libraries already implemented that, and some standard proposals are working in this direction [^2].

</aside>

[^2]:
  See [p0798R3: Monadic operations for std::optional](http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2019/p0798r3.html) and [p1054r0: A Unified Futures Proposal for C++](http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2018/p1054r0.html)

### Function Object
Function objects are normal objects that are able to invoke themselves. They are implemented by overloading a class' `operator()` operator. Below is our `abs_less` example as a function object:

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

Function objects are more flexible than regular functions because they can store data like ordinary objects. Let us implement the previous `filter_above` example with function object:

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

I am using [Class template argument deduction (CTAD)](https://en.cppreference.com/w/cpp/language/class_template_argument_deduction) in this snippet. CTAD is a C++17 feature. In the previous versions, we need to write `GreaterThan<int>{threshold}` with the template parameter `int` specified.

</aside>

### Going back to lambda
Lambdas in C++ are syntactic sugars of function objects. Through the amazing [C++ Insights](https://cppinsights.io/) website, we can see a desugared version of our `abssort` example:

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

Lambda is merely a default constructed object of a [local class](https://en.cppreference.com/w/cpp/language/class#Local_classes). Thus, C++ Lambda can do a lot of stuff anonymous functions in other languages may not allow to do. For example, you can inherit from lambda and have mutable states from lambda. Those will be subjects of later posts. Though I haven't found too much use for either of them.

The compilers generate the types of Lambdas; however, there is no way to use such types by their name through any standard means in a program. Nonetheless, type inferences and template works just normal for those types. Also, we can use those types explicitly by `decltype`. Below is an example from the [cppreference](https://en.cppreference.com/w/cpp/language/decltype):

```cpp
auto f = [](int a, int b) -> int
    {
        return a * b;
    };

decltype(f) g = f;
```

Such types are called "*Voldemort's types*" in the world of C++ and the [D programming language](https://dlang.org/) because they cannot be directly named, but codes can still use this type.

##  Capture with an initializer
Now we understand a Lambda is a function object; we may expect Lambdas to store arbitrary values, not just to capture the values from their local scope. Fortunately, in C++ 14, lambdas can introduce new variables in its body by the mean of capturing with an *initializer*.

### Move capture
Rust lambdas can take ownership of the values in the environment. C++ lambdas do not have special support for such *move capture*, but the generalized capture in the C++14 covers such use case[^3]:

```cpp
auto u = make_unique<some_type>( some, parameters );  // a unique_ptr is move-only
go.run( [ u=move(u) ] { do_something_with( u ); } ); // move the unique_ptr into the lambda
```

[^3]:
  [C++14 Language Extensions: Generalized lambda captures](https://isocpp.org/wiki/faq/cpp14-language#lambda-captures)

## Immediately Invoked Lambda
You can invoke lambda at the same place where we construct them.

```cpp
[]() { std::puts("Hello world!"); }(); // Same as what is inside the curly braces
```

In the world of Javascript, immediately invoked function expressions are all over the place. JavaScript programmers use them to introduce scopes. C++ does not need this kind of trickery. As a result, C++ programmers are more reluctant to use immediately invoked lambda. For example, in her [talk](https://www.youtube.com/watch?v=n0Ak6xtVXno) during CppCon 2018, Kate Gregory concerns about the readability of the immediately invoked lambda for people not familiar with this idiom.

Nevertheless, if you follow the best practice of declaring as more `const` values as possible, immediately invoked lambda does provide an advantage. Some objects require complex construction beyond the constructor's capability. Mutations will only happen during the construction of objects. Once the construction is completed, the objects will never be modified again. If such construction is reusable, then writing builder classes or factory functions is a sane choice. However, if such construction only happens once in the codebase, a lot of the people will drop the `const` qualifier instead. For example, consider that if you want to read several lines from `stdin` into a vector:

```cpp
std::vector<std::string> lines;
for (std::string line; std::getline(std::cin, line); ) {
    lines.push_back(line);
}
```

It seems no way to make `lines` constant since we need to modify it in the loop. Immediately invoked lambda solves this dilemma. With it, you can have both `const` and no boilerplates:

```cpp
const auto lines = [](){
    std::vector<std::string> lines;
    for (std::string line; std::getline(std::cin, line); ) {
        lines.push_back(line);
    }
    return lines;
}
```
