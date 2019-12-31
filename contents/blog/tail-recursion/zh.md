---
id: tail-recursion
title: "尾递归浅析"
lang: zh
create: '2019-01-22'
lastModify: '2019-01-22'
categories:
- functional
- code
- elm
---

**[尾递归](https://zh.wikipedia.org/wiki/%E5%B0%BE%E8%B0%83%E7%94%A8) (tail recursion)**是函数式编程中的重要概念。在这篇文章中，我会用类似于[Elm](https://elm-lang.org/)语言的伪码来解释尾递归。当然，你并不需要懂得任何的Elm来看懂这篇文章。

## 从递归到尾递归

考虑以下由递归实现的阶乘函数：

``` elm
factorial: Int -> Int
factorial n =
    if n == 0
    then 1
    else n * factorial(n - 1)
```

我们可以对`factorial(4)`进行展开：

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

我们在进行了函数调用之后再进行了乘法，所以我们需要一个地方储存数字4、3、2、1。这些数字被存在*栈帧（Stack Frame）*当中。每个递归调用都会产生一帧，所以对`factorial(n)`我们需要n+1帧。、

尾递归是一个对递归调用的空间优化。与大多数优化不同，尾递归把递归函数的空间占用从$\mathcal{O}(n)$降到了$\mathcal{O}(1)$。它的原理在于，如果一个递归调用是一个函数的最后一个动作，我们可以重用该栈帧

## 累计器（Accumulators）- 一种实现尾递归的技术
累计器是一种简单地将递归函数转变为尾递归的技巧。比如，以下是一个尾递归版本的`factorial`：

``` elm
factorial: Int -> Int
factorial n =
    let helper acc n =
        if n == 0 then acc else helper (acc * n) (n - 1)
    in
    helper 1 n
```

使用累计器就类似于是循环当中的迭代。尾递归和循环的确会被编译器转换成一样的代码。

## Continuation-passing style
并不是所有的递归函数都很容易找到累计器。因此还有另一种技术叫做[continuation-passing style](https://en.wikipedia.org/wiki/Continuation-passing_style) （CPS）来转换更复杂的函数。以下是`factorial()`函数的CPS版：

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

如你所见，CPS导致了代码的可读性下降。人工写CPS代码没有什么实用意义，但一些工具会自动把代码转换为CPS。

注意至少在我写这篇文章的时候，Elm的编译器根本不支持如上的代码，并会生成无限递归的错误代码。

## 反思
并不是所有编程语言的实现都会实现尾递归优化。比如说C++的标准就没有要求尾递归优化，尽管主流编译器们（MSVC、Clang、GCC）都实现了这个优化。对所谓的“函数式”语言来说，尾递归优化是必须的，因为这些语言要么为使用循环设置了障碍，要么根本就没有循环。当写这些语言的时候，尽量让递归函数成为尾递归是非常重要的。
