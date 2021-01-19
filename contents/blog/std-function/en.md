---
id: std-function
title: "What is std::function in C++, and why we need them?"
lang: en
create: '2021-01-18'
lastModify: '2021-01-18'
categories:
- cpp
- code
---

Yesterday, someone in the [#include<C++>](https://www.includecpp.org/discord/) discord server asked the following question:

> how `std::function` works with lambda captures and functions handling I still don't understand

Below was my answer to the question, with some typo-fixes and expansions:

## Invocables can have different types even if their parameter and return type are the same

Lambda expressions can be considered syntactic sugar over classes with `operator()` defined. For example:

```cpp
int x = 3;
auto lambda = [x](int y) { return x + y; };
```

is roughly equivalent to

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

One consequence is that every lambda expression has a distinct type. For example, in the below snippet,

```cpp
int x, z;

auto lambda = [x](int y) { return x + y; };
auto lambda2 = [x, z](int y) { return x + y + z; };
```

`lambda` and `lambda2` have different types, even though they both take an `int` and return an `int`.

C++ also have functions,
which are distinct from classes with `operator()`.

## The motivation for `std::function`

Then, how do we store such an invocable object that takes an int and returns an int disregard of its types?

We need `std::function` to accomplish such a task. For example:

```cpp
struct S {
  std::function<int(int)> func;
};
```

A canonical use case for storing an invocable in this fashion is a task system,
where you probably want to store callbacks in a container to execute later:

```cpp

struct TaskQueue {
  std::queue<std::function<void()>> queue;
  std::mutex mutex;
  std::condition_variable ready;

  // member functions
  ...
};

```

## Type Erasure

To make `func` accepts both `lambda` and `lambda2`, `std::function` need to perform *type erasure*.
`std::function` has constructors that take any function object or plain function that satisfies its signature,
so it is hard.

There are various techniques to implement type erasure in C++,
and it is not a topic I can fit into this post.
But the high-level idea is that `std::function` needs some function pointer that can invoke the lambda and some storage space to store lambda captures.
The data need to be allocated on the heap since lambda expressions (or invocable classes) can have arbitrary sized capture.
However, all major `std::function` implementations also perform *small buffer optimization* if your lambda is small enough to fit into a predefined capacity.
In that case, all data can be allocated directly inside the `std::function` object itself, and no additional heap allocation is performed.
