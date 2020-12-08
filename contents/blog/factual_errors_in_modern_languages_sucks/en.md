---
id: factual-errors-in-modern-language-sucks
title: "Factual errors \"These Modern Programming Languages Will Make You Suffer\", and why it is a suffer to read"
lang: en
create: '2020-12-08'
lastModify: '2020-12-08'
categories:
- code
- functional
- opinion
---

Today I stumble upon an article [These Modern Programming Languages Will Make You Suffer
](https://medium.com/better-programming/modern-languages-suck-ad21cbc8a57c) after Twitter outrage. The post is absurd and indeed a suffer to read for me. However, it also receives 1k+ medium claps at the time of writing, and I think I cannot stay silent.

In essence, this article tries to promote functional languages and list their advantages.
As an FP fanboy myself, I love content that encourages the usage of functional programming.
However, this article is so biased and full of factual errors, to the degree that it only shows the author's lack of understanding in both the languages they hate and the languages they try to promote. And I am not even surprised to find that the author is behind another notorious medium clickbait, [Object-Oriented Programming - The Trillion Dollar Disaster](https://medium.com/better-programming/object-oriented-programming-the-trillion-dollar-disaster-92a4b666c7c7).

I will not focus on this article's opinions.
Various Twitter shitposts sometimes have more extreme views than this article.
Also, it is hard to criticize objectively on buzzwords such as "bad" or "a mess."
Instead, let's focus on the misleading factual errors.
Though I am sure that there are still many more factual errors in the section I missed or in languages where I don't have experience.


## Pure functions
> Functions that do not mutate(change) any state are called *pure*

Pure functions are *deterministic* and have *no side-effect*.
"Do not mutate" is way not enough to make a function "pure."

Surprisingly, the author has a correct description of pure function later in the post,
and similar discrepancy also happened more than once,
which made me wonder whether a large chunk of the article is "borrowed" from elsewhere.

## C++
C++ is the perfect punch bag for a lot of reasons,
but still, you shouldn't bash on a language if you have no understanding of it.

> The developers have to worry about manually releasing and allocating memory.

Do you know what [RAII](https://en.wikipedia.org/wiki/Resource_acquisition_is_initialization) is? And have you ever used C++ or Rust before? The same argument can go to the author's rant on the lack of GC in Rust.

> has only rudimentary concurrency mechanisms

Let me reply with a tweet from Bryce Lelbach.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Almost everything in this article is patently wrong, like the claim that &quot;[C++] only rudimentary concurrency mechanisms&quot;. C++ has a formally verified memory and execution model, which is the defacto industry standard, and a rich library of concurrency primitives. <a href="https://t.co/idtcg7gRCy">https://t.co/idtcg7gRCy</a></p>&mdash; Bryce Adelstein Lelbach (@blelbach) <a href="https://twitter.com/blelbach/status/1336406428412604416?ref_src=twsrc%5Etfw">December 8, 2020</a></blockquote>

> In C++, all references are nullable.

In C++, *no* references are nullable 😉.

## JAVA & C#
> since the early versions of C# were a Microsoft implementation of Java

C# was an imitation of Java. But it was a new language and never intended as an implementation of Java.

>  In particular, C# claims to support functional programming. I must disagree... What functional features should a language have? At the very least, built-in support for immutable data structures, pattern matching, pipe operator for function composition, Algebraic Datatypes.

Those are all great features, but none of them are the essence of functional programming.
The first functional language, Lisp, supports none of those features.

By the way, C# does support pattern matching. [^1]
The author seems to acknowledge this fact earlier and forget later,
again made me wonder whether some part of the post is "borrowed" from elsewhere.

## Python
> Language family: C

What does "The C family languages" even mean?
Languages share a syntax resemble C?
And how does Python suddenly becomes a C-family language?

> Python is an interpreted language

"Interpreted language" is a common buzzword in this field without a clear definition.
Instead of the language itself, a language implementation decides whether it is "interpreted" or "compiled."
Plus, there are a lot of middle-ground between an ahead-of-time compiler and a tree-walk interpreter,
and most language implementations these days are in the middle ground.

> Python is also pretty slow to start up

A Python VM usually boots up in less than 100ms.

## Rust
Rust also suffers from a lot of unfair criticism for its "low productivity" in this article.

> The runtime performance of Rust programs is a little faster than Go.

You can't compare the runtime performance of programming languages without context like that.
There are a lot of performance design tradeoff,
and a language that runs faster in one circumstance is possible to run slower in another.

> The first language on our list with a modern null alternative

C++ has `std::optional`[^2] and Java has `Optional`[^3].

## Functional languages
As a person who tries to promote functional languages,
the author should know better about those languages.
Unfortunately, the author seems to have more errors in those languages,
probably because they change from "opinionated rant mode" into actually talking about language features in this section.

### Haskell
> There's no type system more powerful than Haskell.

No type system can be considered the most "powerful."
By the way, what about dependent type languages [^4]?

### OCaml
> There're three package managers — Opam, Dune, and Esy.

Dune is not a package manager, but instead a build system. It is often used in combination with Opam.

> The go-to book for learning OCaml is Real World OCaml. The book hasn't been updated since 2013, and many of the examples are outdated.

The [2nd edition](http://dev.realworldocaml.org/) of *Real World OCaml* is up-to-date and also available free online.

### Scala

> Scala has first-class support for immutable data structures (using case classes).

The Scala standard library does provide fantastic support for immutable data structures.
However, case classes have nothing to do with those data structures.

### Elm

> The only time when you will encounter runtime errors with Elm is when interacting with outside JavaScript code.

Unfortunately, the Elm compiler still can generate Javascript code that throws exceptions at runtime.

> interop with JavaScript libraries next to impossible

There are custom elements[^5] and ports[^6].

> This means that the developers have no access to the vast ecosystem of libraries and components made for React.

You can make a React component a custom element.

### Reason ML
> Just like TypeScript, ReasonML has access to the entire JavaScript ecosystem.

Using Javascript libraries in Reason requires some boilerplates (`external`), just like in Elm.

> React initially was written in OCaml

The first prototype of React was written in Standard ML, rather than OCaml.

### Elixir

> Language family: ML.

Ok, I can stand that you say Haskell or Elm is in the ML family (though I disagree), but what is a dynamic-typed language doing here?

## Conclusion

The article has some good content on pure functions, algebraic data types, pattern matching, and error-handling in FP languages.
If the author removes all the biased, incorrect, and misleading content, I would recommend it for people to read.
However, the author chooses a different pass.
Unfortunately, the Internet always rewards clickbait and sensational articles these days instead of posts with meaningful content.

[^1]: https://docs.microsoft.com/en-us/dotnet/csharp/pattern-matching
[^2]: https://en.cppreference.com/w/cpp/utility/optional
[^3]: https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Optional.html
[^4]: https://en.wikipedia.org/wiki/Dependent_type
[^5]: https://guide.elm-lang.org/interop/custom_elements.html
[^6]: https://guide.elm-lang.org/interop/ports.html
