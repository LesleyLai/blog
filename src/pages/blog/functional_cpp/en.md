---
id: functional-cpp
title: "Book Review: \"Functional Programming in C++\""
lang: en
create: '2019-03-22'
lastModify: '2019-03-22'
categories:
- books
- cpp
- functional
---

*[Functional Programming in C++](https://www.manning.com/books/functional-programming-in-c-plus-plus)* by Ivan Čukić is a new book about applying functional programming principles in C++.

This book is for people who already have a decent understanding of C++. It is written in an idiomatic style that a C++ programmer should feel welcome. If you just start to learn C++, this book may not be the best starting point. I will recommend [A Tour of C++](http://www.stroustrup.com/tour2.html) instead.

On the other hand, the book does not require any functional programming knowledge. The book spends its first six chapters to build basic functional programming concepts like pure functions, higher order functions, partial applications.

As a programmer already familiar with FP, the book does not provide too much major revelation to me. However, I still gain some small insight from each chapter. Though the implementation from this book may not be sophisticated and efficient, they demonstrate concepts pretty well because of their simplicity.

Chapter 6 discusses lazy evaluations and memorization. I feel like the book's implementation for memorization is too inefficient to be useful, and I cannot come up with a solution myself. Nonetheless, I particularly like the later part of lazy string concatenation by using expression templates.

Chapter 7 introduces [ranges](https://en.cppreference.com/w/cpp/ranges), which are merged into C++20 already. The introduction is not in depth, but it is necessary since later chapter uses ranges extensively. Chapter 8 discussed persistence data structures. The [immer](https://github.com/arximboldi/immer) C++ library is an robust implementation of those structures. The library's [CppCon talk](https://www.youtube.com/watch?v=sPhpelUfu8Q) and [ICFP paper](https://public.sinusoid.es/misc/immer/immer-icfp17.pdf) are also fantastic resources to learn more.

Chapter 10 is about functors and monads. This chapter connects constructs like ranges, `std::future`, `std::optional`, and `expected` into more general concepts. Unlike a lot of "monad tutorial" online, the book takes a more practical approach. A normal imperative programmer should easily understand the material if they followed all the previous chapters. I am; however, not impressed by his usage of the range-based [Pythagorean triple](https://en.wikipedia.org/wiki/Pythagorean_triple) example, especially with the readability and performance concern such code [raises](https://aras-p.info/blog/2018/12/28/Modern-C-Lamentations/).

Chapter 11 talks about template metaprogramming. I find calling type traits "meta-functions" a bit weird. The class template trick to he mentioned to debug metaprogramming is helpful, and I hope that I know it earlier. One of [Ivan's blog posts](https://cukic.co/2019/02/19/tmp-testing-and-debugging-templates/) provides more techniques for debugging template code.

Chapter 12 details on concurrent systems and provides a functional reactive solution. It puts all the ideas in the book into a practical, real-world scenario.

Overall, I will recommend all C++ programmers who are curious about terms like "Currying," "Monad," and "Lazy Evaluation" to read this book. Functional programming becomes popular nowadays. Thus, you will find C++ codebases written in various degree of functional style. Reading this book can help you understand, write, and appreciate such codebases.
