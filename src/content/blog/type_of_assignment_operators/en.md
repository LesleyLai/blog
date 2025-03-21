---
id: type-of-assignment-operators
title: "We are defining assignment operators wrong."
lang: en
created: 2019-10-14
modified: 2019-10-14
tags:
  - code
  - cpp
---

Update: Apparently there is a WG21 [paper](http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2019/p1906r0.pdf) on this subject that goes in much more detailed than my post. I am surprised that I missed his CppCon talk on this topic and come into the silimar conclusion.

One principle of C++ operator overloading is that the behavior of overloaded operators should be similar to the counterparts on fundamental types. For the most part, we are doing a decent job. However, the way we define assignment operators leaves some surprise.

Consider the following code snippet:

```cpp
1 = 2; // error: lvalue required as left operand of assignment
```

It is complete nonsense in most of the programming languages. And indeed, no compilers are happy about it,

However, for a class type, it is perfectly fine to assign to a temporary:

```cpp
struct S {};

int main() {
  S{} = S{};
}
```

The reason is that the type signature of the assignment operators, whether if they are compiler-generated or if we define manually, does not exclude r-value types:

```cpp
struct S {
  // Perfectly happy with `*this` being both lvalue or rvalue
  auto operator=(const S& other) -> S&;
  auto operator=(S&& other) -> S&;
};
```

And an easy fix is only to define the lvalue reference overload of assignment:

```cpp
struct S {
  auto operator=(const S& other) & -> S&;
  auto operator=(S& other) & -> S&;
};

int main() {
  S{} = S{};
}
```

In this case, all three major compilers created a somewhat mystical error message, just like what usually happens when overload resolution fails, but at least it will not compile.

## Does this issue even matters?

To me, this concern is more of a theoretical nuisance than a serious problem. I can't picture any seasoned programmers who inadvertently assigning to an rvalue. It has the potential to be a problem to absolute beginners if they haven't touch any programming languages before. It can also confuse beginners when they write a single equal when they want double equals. If they follow the best practice of declaring as much as `const` as possible, then the left-hand side of an assignment will be either a const value or a temporary. And such error can be caught by making the assignments l-value reference qualified.

It is still a good idea to follow rule-of-zero and do not touch any assignment operators. However, when you do need to define assignments, consider making only the lvalue reference overload. If C++ does get something like the [epoch](https://vittorioromeo.info/index/blog/fixing_cpp_with_epochs.html), then we can potentially add reference qualifiers to assignment operators of standard library types, for example, `std::string`.
