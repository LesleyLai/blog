---
id: tail-recursion
title: "Tail Recursion Explanation"
lang: en
create: '2019-01-22'
lastModify: '2019-01-22'
categories:
- functional
- language_agnostic
- elm
---

[Tail-recursion](https://en.wikipedia.org/wiki/Tail_call) is an important concept to understand before we can analyse the behavior of a functional program. I will try to illustrate what tail recursion is with an [Elm](https://elm-lang.org/)-like pseudocode. Though you don't need to know any Elm to understand this post.

Consider the following function:

``` elm
factorial: Int -> Int
factorial n =
    if n == 0
    then 1
    else n * factorial(n - 1)
```


We can expand `factorial(4)` as

```
  factorial(4)
= if (4 == 0) 1 else 4 * factorial(4 - 1)
= 4 * factorial(4 - 1)
= 4 * factorial(3)
= 4 * (if (3 == 0) 1 else 3 * factorial(3 - 1))
= 4 * 3 * factorial(2)
= ...
= 4 * 3 * 2 * 1 * 1
= 24
```

Because we multiply numbers to the inner-function call result, we need a place to store those numbers 4, 3, 2, 1. Those numbers are stored in the **stack frames**. Since every function has its own frame, we need to create n + 1 stack frames for `factorial(n)`.

Tail recursion is a space optimization for the recursive calls. Unlike must optimizations, it changes the asymptotic behavior of the memory usage from `O(n)` to `O(1)`. The idea is that if a recursive call itself is the last action in another function call, the function's stack frame can be reused. Function calls in the tail position of another function call are called tail call.

A nice trick to transform naive recursive functions to tail recursive counterparts is using accumulators. For example, here is a tail recursive version of `factorial`:

``` elm
factorial: Int -> Int
factorial n =
    let helper acc n =
        if n == 0 then acc else helper (acc * n) (n - 1)
    in
    helper 1 n
```

Using accumulators implies an iterative process that we use all the times with loops. Indeed, tail recursions will always transform into the same kind of low-level code as the loops by a compiler.

Note accumulators are not always working, and there is another technique called [continuous-passing style](https://en.wikipedia.org/wiki/Continuation-passing_style) to transform more complex recursive functions. However, CPS need to dynamically allocates lots of closures for each recursive call, so it does not have performance benefit like the accumulator approach. It do, however, prevent stack overflow. However, writing code in CPS manually is tedious and error-prone, so there are tools to translate normal functions into CPS.

Since tail recursion is an optimization, not all implementations of all programming language will implement them. For example, there is no mandatory tail-call elimination in the C++ Standard at the time of writing, though all the mainstream compilers (MSVC, Clang, and GCC) will do it anyway. The story is different in functional programming languages. Those languages usually will mandate tail-call elimination if you write a tail-recursive function. The reason is that those languages usually discourage loop or have no loop at all, so tail-call elimination is necessary to achieve a decent performance in a lot of cases. To be a good citizen in those languages, you should try to write recursive functions tail-recursive (at least on the easy cases where you can transform them with accumulators.)
