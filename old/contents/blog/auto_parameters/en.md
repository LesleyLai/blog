---
id: auto-parameters
title: "Don't automatically use auto parameters in C++"
lang: en
create: '2021-03-09'
lastModify: '2021-03-09'
categories:
- code
- cpp
- opinion
---

Since the advent of C++14, we can create lambda expressions that take `auto` parameters.
And in C++20, we can even do the same thing for regular functions.
With this feature's advent,
the programming style where all parameters are `auto` becomes popular among some C++ programmers.
However, the feature is not always optimal, and, frankly, I don’t think we should use it more often than it needs to.
In general, the more specific we make the type of a parameter is, the better.

<!-- end -->

## Why do people like it?

It is easier, right!
Not everyone want to write out the explicit parameter type.

This can be a valid excuse when doing template-heavy generic programming,
but in a lot of the time, the "annoying to write" type is avoidable with some refactoring,
and we will even have higher quality code by doing so.

For example, the following is a modified version of some code I found online,
and I agree that it is annoying to write out about the explicit type of `pair`:

```cpp
std::vector<std::pair<double, double>> pairs;

return std::accumulate(
  pairs.cbegin(), pairs.cend(), 0,
  [](auto acc, const auto& pair) {
      return acc + pair.first * pair.second;
});
```

I would also be clueless about this code's meaning by reading this snippet
since there is no meaning attached to a pair's `first` and `second` values.

What if we change the element of `pairs` into a named structure?

```cpp
struct Outcome {
  double probability = 0;
  double value = 0;
};

std::vector<Outcome> distribution;

return std::accumulate(
  distribution.cbegin(), distribution.cend(), 0,
  [](double acc, const Outcome& outcome) {
      return acc + outcome.probability * outcome.value;
});
```

Suddenly, it is clear that this code tries to calculate the [expectation](https://en.wikipedia.org/wiki/Expected_value) of a discrete random variable!

Unfortunately, instead of trying to give their code better types,
some people become so adapted to the `auto` parameter style that they start to use it everywhere,
even in places where writing `auto` doesn't save keystrokes much or at all:

```cpp
const std::vector<int> v1 = ...;
const std::vector<int> v2 = ...;
std::vector<int> smaller_ones;

std::ranges::transform(v1, v2, std::back_inserter(smaller_ones),
  [](auto x, auto y) { return std::min(x, y); });
```

## Auto parameters generate templates

In some programming languages such as [ML](https://en.wikipedia.org/wiki/ML_(programming_language)) or Rust,
the type system can infer the exact type of a function or a lambda expression based by their definitions.
Those languages also have different type annotation syntax, which makes type annotations in parameters optional.
Thus, writing lambda expressions without parameter types in those languages is ergonomic and idiomatic.
Once users become accustom to those langauges, they often come back to C++ with the same coding style.

However, in C++, unlike in those languages, the "type inference" of parameter types is just an illusion.
Template, overloading, and [ADL](https://en.cppreference.com/w/cpp/language/adl) (Argument-dependent lookup) all make such type inferences impossible.
As a result, `auto` parameter results in unconstrained templates.
For example, we can use the amazing [cppinsights](https://cppinsights.io/) website to see
what `[](auto x, auto y) { return x * y + 42; });` desuger into:

```cpp
class __lambda_5_2
  {
    public:
    template<class type_parameter_0_0, class type_parameter_0_1>
    inline /*constexpr */ auto operator()(type_parameter_0_0 x, type_parameter_0_1 y) const
    {
      return (x * y) + 42;
    }
    private:
    template<class type_parameter_0_0, class type_parameter_0_1>
    static inline auto __invoke(type_parameter_0_0 x, type_parameter_0_1 y)
    {
      return (x * y) + 42;
    }

  } __lambda_5_2{};
```

The issue is that template programming does not have the same experience as "normal" programming.
Therefore, compilers often catch type errors way later than we want,
and we have worse IDE auto-completion/error detection support in template contexts.
This problem becomes more prominent when we start to write lambda expressions that are more than a one-liner
and even more so when we use `auto` parameters for normal functions in C++20.

## Unconstrained template can be dangerous

Even when we need templates, constraining them is a better idea to use them.
In one of his talks, Bjarne Stroustrup mentioned that we should think about `auto` as a [concept](https://en.cppreference.com/w/cpp/language/constraints)— the least constraint one.[^1]

[^1]: [CppCon 2018: Bjarne Stroustrup “Concepts: The Future of Generic Programming (the future is here)”](https://youtu.be/HddFGPTAmtU)

When a template is unconstrained, it is easy to have types that accidentally match an interface.
For example, let's say that we have a 3-dimensional vector structure,
and it is natural we would want to perform dot products on them:

```cpp
struct Vec3 {
  float x = 0;
  float y = 0;
  float z = 0;
};

auto dot(auto v1, auto v2) {
  return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}
```

Later, if we decide to add another 4-dimensional vector, we can invoke the same version of `dot` that is prepared for three-dimensional vectors and get a completely unexpected result:

```cpp
struct Vec4 {
  float x = 0;
  float y = 0;
  float z = 0;
  float w = 0;
};

dot(Vec4{1, 2, 3, 4}, Vec4{1, 2, 3, 4}); // expects 30, gets 14
```

The C++ Core Guidelines also mentioned the danger of unconstrained template in a highly visible scope,
especially in combination with ADL. [^2]

[^2]: [T.47: Avoid highly visible unconstrained templates with common names](https://github.com/isocpp/CppCoreGuidelines/blob/master/CppCoreGuidelines.md#Rt-visible)

## Explicit type annotation provide documentation value

Even in languages without C++ specific problems,
explicit parameter types provide documentation purpose and can serve as "type-checking barriers" during refactoring.
That is why in ML dialects and Haskell,
toplevel functions without explicit type annotation are considered bad style,
and Rust does not even allow it!

When using an unfamiliar API in any statically-typed language,
the type annotation is probably the first hint of what a particular function call does.
By using `auto` parameters,
we give other people and our future selves no hint about the nature of those parameters.

## Conclusions

It is not always possible to avoid `auto` parameters.
However, you should think about avoiding them, especially when your rationale of using them is nothing but convenience.

Before C++20, there was no way to use concepts or explicit template annotation for lambda expressions.
Also, in some cases, the convenience and productivity gain of using `auto` parameters probably outweighs its drawbacks.
However, I think the downside is severe enough to consider auto parameters a code smell.
When meeting code with auto parameters, we should always ask, "is it possible to use a concrete type here?"
And if it is not the case, then the next question is, "is it possible to use a concept here?"