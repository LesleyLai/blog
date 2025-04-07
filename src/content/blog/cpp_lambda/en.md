---
id: c++-lambda
title: "C++ Lambda Tutorial"
lang: en
created: 2019-03-25
modified: 2021-10-12
tags:
  - cpp
  - code
---

C++ lambda expression is a construct added to C++ back in C++11, and it continues to evolve in each version of the C++ standard. A core part of the language nowadays, lambda expressions enable programmers to express anonymous functions and closures in C++. This post describes what a lambda expression is, provides some basic usages, and outlines their benefits.

## Basic Usage

Passing functions as a parameter to customize the behavior of functions is a common task in programming. For example, since the conception of [standard algorithms library](https://en.cppreference.com/w/cpp/algorithm), a lot of the algorithms in the `<algorithm>` can take an invokable entity as a callback. However, before C++11, the only kinds of invokable entities in C++ are function pointers and function objects. Both of them require quite a bit of boilerplate, and this cumbersomeness even impedes the adaption of the standard algorithm library in practice.

In the meantime, lots of programming languages support features of [anonymous functions](https://en.wikipedia.org/wiki/Anonymous_function). Before C++11, such features are mimicked by metaprogramming. For example, the Boost C++ library provided its [boost.lambda](http://www.boost.org/libs/lambda) library. Those metaprogramming hacks are slow to compile and some of the has performance implications at runtime; moreover, they require more boilerplate then one want. Thus, in C++11, lambda expressions are added as a language extension. As an example, the ISO C++ Standard shows usage of a lambda expression as a comparator of the `sort` algorithm: [^1]

[^1]: See [**\[expr.prim.lambda\]**](http://eel.is/c%2B%2Bdraft/expr.prim.lambda#1)

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

Inside the function `abssort`, we passed an instance of a lambda expression into `std::sort` as a comparator. We can write a normal function to achieve the same purpose:

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

If you are familiar with lambda expressions in other languages, everything should make sense except the mysterious `[]` syntax. And that is our next topic.

## Captures

The above example shows the basic usage of lambda expressions, but lambda expressions can do more. The main difference between a lambda expression and a regular function is that it can "capture" state, and then we can use the captured value inside the lambda body. For example, the below function copies elements, which are above the threshold, from the old vector to the new vector.

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

The above code captures `threshold` by value. The `[]` construct is called a _capture clause_. There are two kinds of captures, capture by value or capture by reference (`[&]`). For example, `[x, &y]` - capture `x` by value and `y` by a reference. You can also have a default capture clause: `[=]` captures everything in the current environment by value and `[&]` captures everything by reference.

We call a function that stores an environment a [_closure_](<https://en.wikipedia.org/wiki/Closure_(computer_programming)>); almost all modern programming languages support closures. However, in all languages that I know except C++, the capture lists are implicit. In those languages, a closure captures all the bindings from the current environment.

We can mimic the behaviors in those languages by capturing everything by reference (`[&]`); it only captures variables in the environment that the lambda uses. However, default capture can be dangerous in C++; if the lambda lives longer than the captured object, then dandling problems occur. For example, we can pass a callback to asynchronous functions and capture resources by reference.

```cpp
auto greeter() {
    std::string name{"Lesley"};

    return std::async([&](){
        std::cout << "Hello " << name << '\n';
    });
}
```

The above code is undefined behavior since `name` may be destroyed when we execute the asynchronous operation. The rule of thumb is only to use default capture by reference when the lambda is short-lived. For example, when passing a lambda to STL algorithms.

The implicit capture strategy works in garbage-collected languages. [Rust](https://www.rust-lang.org/) gets away with implicit capture because of its borrow checker. On the contrary, by requiring the programmer to be explicit about ownership, the C++ approach provides more flexibility than the counterparts in other programming languages.

## Lambda expression under the hood

We discussed quite a lot of usage of lambda so far. However, curious readers may start to wonder, what _exactly_ is a C++ lambda expression? Is it a primitive language construct like closures in functional languages? Before I talk about the internal of lambda, I will first talk about a construct date back to the C++98 era, **function objects**.

<span class="side-note">

Some C++ programmers call the function objects "functors." It is a misnomer that we should avoid. In [category theory](https://en.wikipedia.org/wiki/Category_theory), a functor is a map between categories[^2]" and satisfy specific "functor laws."

Functional programming languages utilized this concept for their language constructs, though they too overloaded this terminology. In [Standard ML](https://en.wikipedia.org/wiki/Standard_ML) and [OCaml](https://en.wikipedia.org/wiki/OCaml), a functor is a higher-order module. You can think of it as a meta-function that maps a module to another module. A more prevalent usage comes from Haskell and various inspired languages and libraries, where functor is a type class that defines mapping operation. The Haskell definition of a functor is also useful in C++. For example, the standard [range adaptors](https://en.cppreference.com/w/cpp/ranges#Range_adaptors) can be considered functors that map ranges. Also, if the types `std::optional` and`expected` support a "map" operations, then they become functors. Various libraries already implemented that, and some standard proposals are working in this direction [^3].

</span>

[^2]: [Wikipedia: Functor](https://en.wikipedia.org/wiki/Functor)

[^3]: See [p0798R3: Monadic operations for std::optional](https://wg21.link/p0798)

### Function Object

Function objects are normal objects that are able to be invoked. They are implemented by overloading a class's `operator()` operator. Below is our `abs_less` example as a function object:

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
  explicit GreaterThan(T threshold): threshold_{threshold} {
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

<span class="side-note" style="margin-top: -140px">

I am using [Class template argument deduction (CTAD)](https://en.cppreference.com/w/cpp/language/class_template_argument_deduction) in this snippet. CTAD is a C++17 feature. In the previous versions, we need to write `GreaterThan<int>{threshold}` with the template parameter `int` specified.

</span>

### Going back to lambda expressions

Lambda expressions in C++ are syntactic sugars of those classes with `operator()` defined.
At runtime, those lambda expressions get evaluated into function objects. Through the amazing [C++ Insights](https://cppinsights.io/) website, we can see a desugared version of our `abssort` example:

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

As you can see, a lambda expression creates a default constructed object of a [local class](https://en.cppreference.com/w/cpp/language/class#Local_classes). Thus, C++ lambda expressions can do a lot of stuff anonymous functions in other languages may not allow to do. For example, you can inherit from lambda and have mutable states from lambda. Though I haven't found too much use for either of them.

The compilers generate the types of lambdas expressions; however, there is no way to use such types by their name through any standard means in a program. Nonetheless, type inferences and template works normally for those types. Also, we can use those types explicitly by `decltype`. Below is an example from the [cppreference](https://en.cppreference.com/w/cpp/language/decltype):

```cpp
auto f = [](int a, int b) -> int
    {
        return a * b;
    };

decltype(f) g = f;
```

Such anonymous types are called "_Voldemort's types_" in the world of C++ and the [D programming language](https://dlang.org/) because they cannot be directly named, but codes can still use this type.

## Capture with an initializer

Now you understand a lambda expression is a syntactic sugar over classes; you may expect lambda expressions to store arbitrary values, not just to capture the values from their local scope. Fortunately, in C++14, lambda expressions can introduce new variables in its body by the mean of capturing with an _initializer_[^4].

```cpp
[x = 1]{ return x; /* 1 */ }
```

### Move capture

[Rust](https://www.rust-lang.org/) closures can take ownership of the values in the environment. C++ lambda expressions do not have special support for such _move capture_, but the generalized capture in the C++14 covers such use case:

```cpp
// a unique_ptr is move-only
auto u = std::make_unique<some_type>(
  some, parameters
);
// move the unique_ptr into the lambda
go.run( [u=std::move(u)] {
  do_something_with(u);
});
```

[^4]: [C++14 Language Extensions: Generalized lambda captures](https://isocpp.org/wiki/faq/cpp14-language#lambda-captures)

## Immediately Invoked Lambda Expression

You can invoke a lambda expressions at the same place where we construct them.

```cpp
[]() { std::puts("Hello world!"); }(); // Same as what is inside the curly braces
```

In the world of Javascript, immediately invoked function expressions are all over the place since JavaScript programmers sometimes use them to introduce scopes. C++ does not need this kind of trickery. As a result, C++ programmers are more reluctant to use immediately invoked lambda. For example, in her [talk](https://www.youtube.com/watch?v=n0Ak6xtVXno) during CppCon 2018, Kate Gregory concerns about the readability of the immediately invoked lambda expressions for people not familiar with this idiom.

Nevertheless, if you follow the best practice of declaring as more `const` values as possible, immediately invoked lambda expression does provide an advantage. Some objects require complex construction beyond the constructor's capability. Mutations will only happen during the construction of objects. Once the construction is completed, the objects will never be modified again. If such construction is reusable, then writing builder classes or factory functions is a sensible choice. However, if such construction only happens once in the codebase, a lot of the people will drop the `const` qualifier instead. For example, consider that if you want to read several lines from `stdin` into a vector:

```cpp
std::vector<std::string> lines;
for (std::string line;
     std::getline(std::cin, line);) {
    lines.push_back(line);
}
```

It seems no way to make `lines` constant since we need to modify it in the loop. Immediately invoked lambda expression solves this dilemma. With it, you can have both `const` and no boilerplates:

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
