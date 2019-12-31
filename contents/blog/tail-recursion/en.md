---
id: tail-recursion
title: "Tail Recursion Explanation"
lang: en
create: '2019-01-22'
lastModify: '2019-01-22'
categories:
- functional
- code
- elm
---

[Tail-recursion](https://en.wikipedia.org/wiki/Tail_call) is an important concept to understand before we can analyse the behavior of a functional program. I will try to illustrate what tail recursion is with an [Elm](https://elm-lang.org/)-like pseudocode. Though you don't need to know any Elm to understand this post.

## From recursion to tail-recursion

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

Tail recursion is a space optimization for the recursive calls. Unlike most optimizations, it changes the asymptotic behavior of the memory usage from $\mathcal{O}(n)$ to $\mathcal{O}(1)$. The idea is that if a recursive call itself is the last action in another function call, the function's stack frame can be reused. Function calls in the tail position of another function call are called tail call.

## Accumulators - Technique for implement tail recursive functions
A nice technique to transform naive recursive functions to tail recursive counterparts is using accumulators. For example, here is a tail recursive version of `factorial`:

``` elm
factorial: Int -> Int
factorial n =
    let helper acc n =
        if n == 0 then acc else helper (acc * n) (n - 1)
    in
    helper 1 n
```

Using accumulators implies an iterative process that we use all the times with loops. Indeed, tail recursions will always transform into the same kind of low-level code as the loops by a compiler.

## Continuation-passing style
Accumulators are not always working. There is another technique called [continuation-passing style](https://en.wikipedia.org/wiki/Continuation-passing_style) (abbreviate as CPS) to transform more complex recursive functions. Here is our `factorial()` function in continuation-passing style:

```elm
factorial_k: Int -> (Int -> a) -> a
factorial_k n k =
    if n <= 0 then
        k(1)
    else
        factorial_k (n - 1) (\v -> k(v * n))

factorial: Int -> Int
factorial n =
    factorial_k n (\x -> x)
```

As you see, there is a lot of boilerplate with no apparent benefit. Writing code in CPS manually is tedious and error-prone, so it is probably not worthwhile to code every recursive function in CPS style. On the other hand, there are tools to translate normal functions into CPS.

Note that the Elm compiler cannot compile code like this at all and would generate infinite recursion at the time of writing, but you can try this function in some other languages.

## Afterthought
Since tail recursion is an optimization, not all implementations of all programming language will implement them. For example, there is no mandatory tail-call elimination in the C++ Standard at the time of writing, though all the mainstream compilers (MSVC, Clang, and GCC) will do it anyway. The story is different in functional programming languages. Those languages usually will mandate tail-call elimination if you write a tail-recursive function. The reason is that those languages usually discourage loop or have no loop at all, so tail-call elimination is necessary to achieve a decent performance in a lot of cases. To be a good citizen in those languages, you should try to write recursive functions tail-recursive (at least on the easy cases where you can transform them with accumulators.)
