---
id: const-correcness-std-function
title: "Const Correctness Issue of std::function"
lang: en
created: "2019-12-30"
modified: "2019-12-30"
tags:
  - code
  - cpp
---

The `const` type qualifier is one of the jewels of the C++ language design. Surrounding by this feature, we devise the "`const` correctness" practice to prevent `const` objects from getting mutated. The `const` correctness rule is straight-forward to follow for implementation of the most classes, but it is harder to heed for classes with type erasure. Unfortunately, the standard library type [`std::function`](https://en.cppreference.com/w/cpp/utility/functional/function) is implemented by type erasure; and due to short-sightedness, it becomes one of the ill-behaved citizens that doesn't follow the const-correctness rule.

<!-- end -->

## The Problem

`std::function` has one const member `operator()`, yet it can mutate the underlying function. For example,

```cpp
const std::function<int()> f {[x=0]() mutable { return ++x; }};
f(); // returns 1
f(); // returns 2
```

The Document N4348[^1] first formalized this concern. It states that

> This violates not only basic tenets of `const-`correctness, but also the data race avoidance guarantees in [res.on.data.races]/p3, which states that "A C++ standard library function shall not directly or indirectly modify objects accessible by threads other than the current thread unless the objects are accessed directly or indirectly via the function's non-`const` arguments, including `this`".

[^1]: [Making std::function safe for concurrency](http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2015/n4348.html)

## The Fix

Implementations of a `function`-like class should have separate specializations for `const` and non-`const`.

```cpp
template<class Sig> class function; // not defined

template<class R, class... Args>
  class function<R(Args...)>;

template<class R, class... Args>
  class function<R(Args...) const>;
```

`operator()` of the `const` specialization should be annotated as `const`, but the constructor of the `const` specialization would not accept mutable function objects.

```cpp
function<int() const> f1 {[x=0]() { return x; }};
f1() // ok;

function<int() const> f2 {[x=0]() mutable { return ++x; }}; // Does not compile
```

On the other hand, `operator()` of the non-`const` specialization would not have `const` type signature, so you cannot invoke the `const` version of such functions at all:

```cpp
function<int()> f1 {[x=0]() mutable { return ++x; }};
f1(); // ok

const function<int()> f2 {[x=0]() mutable { return ++x; }};
f2(); // Does not compile
```

## The Future

I don't expect `std::function` itself to have any change that breaks backward-compatibility. As of the time of this writing (December 2019), my bet is on the proposed `std::unique_function` [^2], which is a drop-in replacement of `std::function` that fixes the const-correctness bug among other features. Once we have an alternative in standard, `std::function` can be deprecated just like `std::auto_ptr`. In the meantime, we can always implement `unique_function` on our own, and I have a small library to implement that on [Github](https://github.com/Beyond-Engine/functions).

[^2]: [P0228R3 unique_function: a move-only std::function](http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2019/p0228r3.html)
