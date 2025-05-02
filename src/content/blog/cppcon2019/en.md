---
id: cppcon2019
title: "CppCon 2019 Trip Report"
lang: en
created: 2019-09-22
modified: 2019-09-22
tags:
  - cpp
  - event
---

What a week we had! CppCon 2019 is by far the best CppCon that I've ever attended. There are contents that interest me on every time slot, and for a lot of time there are conflict so that it is hard to decide which talk to go to.

## Pre and post-conference classes

- [Arthur O'Dwyer](https://quuxplusone.github.io/blog/)'s _[Standard Library From Scratch](https://quuxplusone.github.io/from-scratch/)_ teaches us the implementations of type-erased containers (`any` and `function`), synchronization primitives, smart pointers, and a bunch of meta-programming utilities. This course makes me more confident about type erasure, small-object optimization, and meta-programming.

- Gordon Brown and Micheal Wong's _[Parallelism in Modern C++: From CPU to GPU](https://github.com/Aerialmantis/cppcon-parallelism-class)_ talks about general parallel programming principles and [SYCL](https://www.khronos.org/sycl/) programming. I didn't have much experience in GPGPU and never touched SYCL before, but I find that many concepts maps nicely to the [Vulkan](https://www.khronos.org/vulkan/) Graphics API.

## The keynotes

CppCon this year have one keynote for each day, and all the keynotes are high quality.

- [Bjarne Stroustrup](http://www.stroustrup.com/)'s _C++20: C++ at 40_ \[[video](https://www.youtube.com/watch?v=u_ij0YNkFUs)\] talks about the current status of C++ from the perspective of its creator. Nothing substantially surprising is in this talk, but the combination of C++ features like modules and concept has already completely transformed this language into a new height. Bjarne also talked about his vision of future C++.

- [Andrei Alexandrescu](https://erdani.com/)'s _Speed Is Found In The Minds of People_ \[[video](https://www.youtube.com/watch?v=FJJTYQYB1JQ&t=4552s)\] is both entertaining and inspiring. It makes me rethink about algorithms and optimization.

- Ben Smith - _Applied WebAssembly: Compiling and Running C++ in Your Web Browser_ \[[video](https://www.youtube.com/watch?v=5N4b-rU-OAA)\]. Interning in a [company](https://www.sketchup.com/) where we have a web assembly [product](https://app.sketchup.com/app) using the C++ codebase, I am delighted that people are spreading this practice.

- [Sean Parent](https://sean-parent.stlab.cc/)'s _Better Code: Relationships_ \[[video](https://www.youtube.com/watch?v=ejF6qqohp3M)\] continues his "Better Code" series. This time he was talking about theories of relationships between objects and how they guide us to architect software.

- [Herb Sutter](https://herbsutter.com/)'s _De-fragmenting C++: Making Exceptions and RTTI More Affordable and Usable_ \[[video](https://www.youtube.com/watch?v=ARYP83yNAWk)\] naturally grab everyone's attention. A large part of the communities is not satisfied, which the current status of exceptions and RTTI, so Herb's series of proposals will help tremendously. Herb gives the same talk in my user group in March.

## Personal high light

There are so many great talks in this year's CppCon, so I can only mention some of them that I attended and impressed me the most.

- [Bryce Lelbach](https://bsky.app/profile/blelbach.bsky.social)'s _The C++20 Synchronization Library_ \[[video](https://youtu.be/Zcqwb3CWqs4)\] is probably the best concurrency talk I heard in CppCon this year. It went through not only C++20 synchronization primitives but how to use them to build a task system. I plan to watch it several times until absorbing all its content.

- Alisdair Meredith and Pablo Halpern's _Getting Allocators out of our way_ \[[slides](https://github.com/CppCon/CppCon2019/blob/master/Presentations/getting_allocators_out_of_our_way/getting_allocators_out_of_our_way__alisdair_meredith__pablo_halpern__cppcon_2019.pdf)\] proposed an interesting language extension to simplify the writing of allocator-aware classes on top of the current `pmr` model. The basic idea is that allocators are no longer a regular parameter, but a special parameter that we can optionally provide with a different syntax. The extension works like Scala's [implicit parameter](https://docs.scala-lang.org/tour/implicit-parameters.html), and it can have potential use to other structures like executors.

- [Jason Turner](https://bsky.app/profile/lefticus.bsky.social)'s _C++ Code Smell_ \[[slides](https://github.com/CppCon/CppCon2019/blob/master/Presentations/cpp_code_smells/cpp_code_smells__jason_turner__cppcon_2019.pdf)\] finally convinced me that `const` function parameters have an advantage with a very simple example, which I was doubtful when he talked about it last year.

- [Mathieu Ropert](https://mropert.github.io/)'s _This Videogame Programmer Used the STL and You Will Never Guess What Happened Next_ \[[slides](https://github.com/CppCon/CppCon2019/blob/master/Presentations/this_videogame_programmer_used_the_stl/this_videogame_programmer_used_the_stl__mathieu_ropert__cppcon_2019.pdf)\] demystifies some common myth against C++ standard library, including the common concern of "debugging performance." It also explains when should you (not) use STL.

<aside class="side-note" style="margin-top: -80px">

Seriously, this name is tooooo long.

</aside>

- [Matt Godbolt](https://xania.org/)'s "Path Tracing Three Ways" \[[slides](https://mattgodbolt.github.io/pt-three-ways-pres/#/)\] implements a same primitive path tracer in three C++ styles-- object-oriented, functional, and data-oriented design. He analyze the performance and compares their strengths and weaknesses. One interesting detour is that a naively designed data-oriented code without dynamic polymorphism can be even slower than its OO counterpart because of branch misprediction (which DOD tries to avoid). The fix he applied not only improved the data-oriented version but also significantly increase the speed of the functional version. One thing I wonder is that in the particular case of path tracing, how much performance advantage of data-oriented design can be preserved when adding acceleration data-structures.

## My lighting talk

I gave a lightning talk on Wednesday night called _Make impossible state unrepresentable_ inspired by the typed functional languages communities. In the lighting talk, I mentioned how to design data and types in C++ to leverage the static type system so that invariants breaking becomes impossible in some instances.

This talk is my first presentation to give in front of the public instead of a university or meetup setting. I was nervous, but I managed to finish it. I also found that it is extremely hard to fit content into five minutes, as I cut more than half of the original slides I prepared. Thank CppCon for giving me this opportunity, and thanks [Phil Nash](https://levelofindirection.com/index.html) for organizing the lighting talks well!

## Conclusion

As a student, attending a conference at school time always gives me immense pressure in term of school works. However, CppCon was and is always worthwhile. It is a pleasure to be surrounded by so many extraordinary people in the C++ communities, and "C++ heroes" that I usually can only see online. Thank everyone I met for being awesome for the whole week. I can't wait to attend the CppCon and meet you all next year!
