---
id: factual-errors-in-modern-language-sucks
title: 'Factual errors in "These Modern Programming Languages Will Make You Suffer", and why it is a suffer to read'
lang: en
created: 2020-12-08
modified: 2020-12-08
tags:
  - code
  - functional
  - opinion
---

Today I stumble upon an article <a href="https://medium.com/better-programming/modern-languages-suck-ad21cbc8a57c" rel="nofollow" target="_blank">These Modern Programming Languages Will Make You Suffer</a>
after Twitter outrage.
The post is absurd and indeed a suffer to read for me.
However, it also receives 1k+ medium claps at the time of writing, and I cannot stay silent.

In essence, this article tries to promote functional languages and list their advantages.
As an FP fanboy myself, I love content that encourages the usage of functional programming.
However, this article is so biased and full of factual errors, to the degree that it only shows the author's lack of understanding in both the languages they hate and the languages they try to promote. And I am not even surprised to find that the author was behind another notorious medium clickbait, <a href="https://medium.com/better-programming/object-oriented-programming-the-trillion-dollar-disaster-92a4b666c7c7" rel="nofollow" target="_blank">Object-Oriented Programming - The Trillion Dollar Disaster</a>.

I will not focus on this article's opinions.
Various Twitter shitposts sometimes have more extreme views than this article.
Also, it is hard to criticize objectively on buzzwords such as "bad" or "a mess."
Instead, let's focus on the misleading factual errors.
Though I am sure that there are still many more factual errors in the section I missed or in languages where I don't have experience.

## Pure functions

> Functions that do not mutate(change) any state are called _pure_

Pure functions are _deterministic_ and have _no side-effect_.
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

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Almost everything in this article is patently wrong, like the claim that &quot;[C++] only rudimentary concurrency mechanisms&quot;. C++ has a formally verified memory and execution model, which is the defacto industry standard, and a rich library of concurrency primitives.</p>&mdash; Bryce Adelstein Lelbach (@blelbach) December 8, 2020</blockquote>

> In C++, all references are nullable.

In C++, _no_ references are nullable 😉.

## JAVA & C#

> since the early versions of C# were a Microsoft implementation of Java

C# was an imitation of Java. But it was a new language and never intended as an implementation of Java.

> In particular, C# claims to support functional programming. I must disagree... What functional features should a language have? At the very least, built-in support for immutable data structures, pattern matching, pipe operator for function composition, Algebraic Datatypes.

Those are all great features, but none of them are the essence of functional programming.
The first functional language, Lisp, supports none of those features.

<span class="side-note">

[Jonathan Frech](https://www.jfrech.com/blog/) had a great comment about that some do not consider Lisp as a functional language.
That being said, even in [Standard ML'97](https://en.wikipedia.org/wiki/Standard_ML), a language probably considered more "functional" by some, there is no support for the pipe operator.
The standard library has only minimum support for persistent data structures (it didn't even have an immutable map/dictionary type).
Lambda calculus, the holy grail of functional programming, also has none of the above mentioned features.

</span>

By the way, C# does support pattern matching. [^1]
The author seems to acknowledge this fact earlier and forget later,
again made me wonder whether some part of the post is "borrowed" from elsewhere.

> rudimentary concurrency support

C# is the language that makes the async/await paradigm popular.

> In C#, all references are nullable.

Except that there are [nullable-references](https://docs.microsoft.com/en-us/dotnet/csharp/nullable-references) support and references can be made not-null by default.

## Python

> Language family: C

What does "The C family languages" even mean?
Languages share a syntax resemble C?
And how does Python suddenly become a C-family language?

> Python is an interpreted language

"Interpreted language" is a common buzzword in this field without a clear definition.
Instead of the language itself, a language implementation decides whether it is "interpreted" or "compiled."
Plus, there are a lot of middle-ground between an ahead-of-time compiler and a tree-walk interpreter,
and most language implementations these days are in the middle ground.

> Python is also pretty slow to start up

A Python VM usually boots up in less than 100ms.

## Rust

Rust also suffers from a lot of unfair ranting for its "low productivity" in this article, and to be honest all the criticism for Rust in this article looks like from a quick Google search.

> The runtime performance of Rust programs is a little faster than Go.

You can't compare the runtime performance of programming languages without context like that.
There are a lot of performance design tradeoff,
and a language that runs faster in one circumstance is possible to run slower in another.

> The first language on our list with a modern null alternative

C++ has `std::optional`[^2] and Java has `Optional`[^3].

> Developers have to worry about things like boxing and pinning, which typically are done automatically in a garbage-collected language.

Some garbage collectors move memories in a process called memory compaction,
and that is why C#, for example, also support pinning.

## Typescript

> Even experimental features can be enabled in JavaScript with the use of Babel, which can’t be done for TypeScript.

Totally not true[^4].

> While JavaScript developers can use libraries that help with immutability, TypeScript developers typically have to rely on the native array/object spread operators

Both immutable.js and Rambda, the Javascript libraries that the author mentioned, provide typescript type definitions, and they are not harder to use compared to using them in JS.

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

The [2nd edition](http://dev.realworldocaml.org/) of _Real World OCaml_ is up-to-date and also available freely online.

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

> We don’t even know whether or not he’s still working full-time on Elm. The language might actually be dead by now.

Evan is still doing work on Elm and interacts with the community regularly.

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
However, the author chooses a different path.
Unfortunately, the Internet always rewards clickbait and sensational articles these days instead of posts with meaningful content.

Also, what worries me is that these kinds of blog posts will push people away from functional languages.
A minority of trolls make people lose faith in the whole community.
For example, here is one comment on Medium to the article:

> Ooh, you're a functional programmer! That explains why I had that feeling you didn't know what you were talking about.
>
> I can stop reading now. I read enough flawed examples, dubious comparisons and more from articles written by your kind."

Rest assured that most people in the functional programming community are friendly and don't have that kind of bias against your favorite language.

[^1]: https://docs.microsoft.com/en-us/dotnet/csharp/pattern-matching

[^2]: https://en.cppreference.com/w/cpp/utility/optional

[^3]: https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Optional.html

[^4]: https://babeljs.io/docs/en/babel-preset-typescript

[^5]: https://en.wikipedia.org/wiki/Dependent_type

[^6]: https://guide.elm-lang.org/interop/custom_elements.html

[^7]: https://guide.elm-lang.org/interop/ports.html
