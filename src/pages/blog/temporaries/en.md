---
id: temporaries
title: "When does a C++ temporary object die?"
lang: en
create: '2019-03-28'
lastModify: '2019-03-28'
categories:
- cpp
- code
---

A lot of operations of C++ require temporary values. Using them before their destruction is imperative. However, not all C++ programmers I met have a solid understanding of when a temporary expire. This situation often leads to over-conservative estimations, which will not cause any harm. Nevertheless, sometimes it will cause programmers to assume guarantees that the language does not provide, which leads to insidious bugs.

One of the common scenarios such problem manifest is when we manipulate a string with `std::string`, but feed the result string back to an API that takes `const char*`. Consider the following code snippet:

```cpp
[[nodiscard]] auto greet(const std::string& name) -> std::string {
    return "Hello, " + name + '!';
}

int main() {
  const std::string name{"Lesley Lai"};
  std::puts(greet(name).c_str()); // highlight-line
}
```

The C++ Standard guarantees it to work. The Standard mandates that all temporary objects get destroyed as the last step of evaluating of the **full-expression** that contains the point where the temporaries were created[^1]. "full expression" means an expression that is not sub-expression of other expressions.

A noteworthy exception of the rule is references, References can extend the lifetime of temporaries, but they will be a topic of another post.

[^1]: [cppreference: lifetime](https://en.cppreference.com/w/cpp/language/lifetime)

In "The Design and Evolution of C++," Bjarne discussed the early design decision of the lifetime of temporaries [^2]. The book refers to an earlier paper that identified several alternative destruction points. For example, in the original CFront implementation of C++, temporaries are destroyed at the end of the blocks. This approach caused problems when creating large temporaries, and some programmers explicitly avoided the issue by wrapping statements in curly braces.

[^2]: D&E, 6.3.2

Another approach is to kill temporaries after the first use. An over-paranoid C++ programmer may suspect that the above code leads to undefined behavior. Having this thought may imply a subconscious assumption of this approach. I perceive this strategy more intuitive than the current way because of its consistency. With the current strategy, changing the above code a little bit will introduce undefined behavior:

```cpp
[[nodiscard]] auto greet(const std::string& name) -> std::string {
    return "Hello, " + name + '!';
}

int main() {
  std::string name{"Lesley Lai"};
  // highlight-start
  const char* greeting = greet(name).c_str();
  std::puts(greeting);
  // highlight-end
}
```

In the above code, the destructor of the temporary returned by `greet` gets called after evaluating the full-expression. Thus, the pointer `greeting` gets dangled. I got bite by expired temporary strings when dealing with OpenGL shaders before. Such code may even *appear* to work for some cases [^3] because of *Small String Optimization*. Anyway, if an undefined behavior *guarantee* to break the program in a certain way, it is no longer undefined.

[^3]: for instance, in your unit tests

Why C++ choose the current way? First, C++ cannot afford a garbage collection runtime, so "after the last usage" is out of the picture. Also, the current approach is far less error-prone to newbies than "after first use" strategy, while still performant without weird workarounds that "at the end of the block" implies.
