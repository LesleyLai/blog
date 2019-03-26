---
id: professional-cmake
title: "Book Review: \"Professional CMake: A Practical Guide\"" 
lang: en
create: '2019-01-15'
lastModify: '2019-01-15'
categories:
- books
- cmake
- code
---

[CMake](https://cmake.org/) is the de facto industry standard for the build system generator of the C and C++ this days. Like C++, people seem to love and hate it at the same time. However, it is definitely a better choice compare to writting Makefiles manually.

There are a bunch of Cmake resources online, in the forms of youtube videos, conference talks, and blog posts, but they are usually either for beginners, solve a specific problem, or focus on "best practices." I would not say such resources are bad, but they are inadequate. For example, even though books like [Effective Modern C++](https://www.amazon.com/Effective-Modern-Specific-Ways-Improve/dp/1491903996) are useful, but we need to first read books like [The C++ Programming Language](https://www.amazon.com/C-Programming-Language-4th/dp/0321563840) to have the whole picture of the C++ language. And counterparts of this book in the CMake world are hard to find.

As a result, CMake is always a dark side to my codebase. I use CMake for years with a very shallow understanding of how it functions. For most of the time, my level of familiarity with CMake is enough. I would copy and paste code snippets I find online. However, whenever I want to do any "non-trivial" tasks with CMake, I will meet trouble.  One of the reasons is that a lot of tutorial writers, like me, have a minimal understanding of CMake so that they will post none-robust CMake scripts. For instance, a lot of the times we need to copy resources files from the source directory to the binary directory, and for years I used a way that would only copy files when a file with the same name does not exist in the build directory. Nonetheless, in Graphics programming, I modify shaders all the time, and every time I need to delete the files in binary directory manually. A more sinister drawback of this workflow is that I can modify the shaders and forget to remove the old ones.

Recently, I find someone on the [cpplang](https://cpplang.slack.com) slack channel recommend "Professional CMake: A Practical Guide," a CMake handbook written by a CMake co-maintainer  [Craig Scott](https://twitter.com/crascit?lang=en). The book is a structured introduction to CMake. It helps me to form a basic understanding of how CMake works. I learned concepts like differences between configure time and generate time and generator expressions. All of those are rarely mentioned in online tutorials. The book also mentions a lot of "best practices" and the common pitfalls of using CMake in each chapter (and the better alternatives).

All in all, I recommend this book for anyone kept using CMake in the dark. Build system codes are still part of the production system, and they deserve the same attention as the regular codes. Maybe you should treat them even more carefully than the regular codes since in a lot of times build system errors are even harder to debug than the most insidious template metaprogramming bugs (Afterall, CMake scripts are "meta-meta programming" in a very dynamic language where no type system will save you.)
