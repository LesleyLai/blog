---
id: c++-lambda-part-1
title: "C++ Lambda in depth - Part 1: Introduction"
lang: en
create: '2019-03-25'
lastModify: '2019-03-25'
categories:
- cpp
- code
---

C++ lambda expressions are a construct added to C++ back in C++11, and it continues to evolve in each version of the C++ standard. A core part of the language nowadays, lambdas enable programmers of writing [anonymous functions](https://en.wikipedia.org/wiki/Anonymous_function) in C++. In this post, I describe what a lambda is, provide some basic usages, and outline their benefits.

## Basic Usage
The ISO C++ Standard shows usage of a lambda expression as a comparator of `sort` function. [^1] [^2]

[^1]:
  See [**\[expr.prim.lambda\]**](http://eel.is/c%2B%2Bdraft/expr.prim.lambda#1)

[^2]:
  Functions that receive other functions as parameter or return function as value are called [higher-order functions](https://en.wikipedia.org/wiki/Higher-order_function). They are widely used in the standard [algorithms](https://en.cppreference.com/w/cpp/algorithm) library in C++. Higher-order functions can be used to customize the behavior of a function in the caller's site.

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

Inside the function `abssort`, we passed lambda into `std::sort` as a comparator. We can actually write a normal function to achieve the same purpose:

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
We discussed quite a lot of usage of Lambda so far. However, curious readers may start to wonder, what *exactly* is a C++ Lambda? Is it a primitive language construct like closures in functional languages? However, before I talk about the internal of Lambda, I will first talk about a construct date back to C++98 era, **function objects**[^3].

[^3]:
  Some C++ programmers call the function objects "functors," though it is a misnomer that we should avoid. The reason is that functional programmers usually define [functor](https://en.wikipedia.org/wiki/Functor) as "mappable" structures that satisfy certain properties. By that definition, C++ ranges, `std::optional`, `std::future`, and `expected` are more close to a real functor than function object. The "functors" definition comes from categories theory. with the arrival of C++ 20 [Concept](https://en.cppreference.com/w/cpp/language/constraints), it is not even hard to imagine implementing a `Functor` Concept in C++.

### Function Object
Function objects are normal objects that are able to invoke themselves. They are implemented by overloading a class' `operator()` operator. Below is our `abs_less` example as a function object:

```cpp
#include <algorithm>
#include <cmath>
class abs_less {
  bool  operator()(double a, double b) {
    return (std::abs(a) < std::abs(b));
  }
};

void abssort(float* x, unsigned n) {
    std::sort(x, x + n, abs_less{});
}
```

Function objects are more flexible than regular functions because they can store data like normal objects.

### Go back to lambda
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

Such types are called "*Voldemort's types*" in the world of C++ and D because they cannot be directly named, but codes can still use this type.

##  Capture with an initializer
Now we understand a Lambda is a function object; we may expect Lambdas to store arbitrary values, not just to capture the values from their local scope. Fortunately, in C++ 14, lambdas can introduce new variables in its body by the mean of capturing with an *initializer*.

### Move capture
Rust lambdas can take ownership of the values in the environment. C++ lambdas do not have special support for such *move capture*, but the generalized capture in the C++14 covers such use case[^4]:

```cpp
auto u = make_unique<some_type>( some, parameters );  // a unique_ptr is move-only
go.run( [ u=move(u) ] { do_something_with( u ); } ); // move the unique_ptr into the lambda
```

[^4]:
  [C++14 Language Extensions: Generalized lambda captures](https://isocpp.org/wiki/faq/cpp14-language#lambda-captures)

## Conclusion

In the next post, I will talk about generic lambda of C++14, an extension that enables polymorphism to lambdas. Generic lambda combines with the power of the C++17 `if constexpr` will significantly simplify generic codes.
