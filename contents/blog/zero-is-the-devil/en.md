---
id: zero-is-the-devil
title: "Zero is the Devil: Common ways to construct bogus proofs"
lang: en
created: "2020-05-10"
modified: "2020-05-10"
tags:
  - math
  - logic
---

It is easy to make mistakes when conducting mathematical proofs.
Nevertheless, you can find some recurring error patterns in those proofs.
And some of the most common reasons are related to the innocuous-looking number zero.

## Division-by-zero fun

Let's look at the following "proof" of $1 = 2$:

$$
\begin{aligned}
\text{let } a, b \in \mathbb{Z} \text{ such that } a = b \\
a^2 &= ab \\
a^2 - b^2 &= ab - b^2 \\
(a + b)(a - b) &= b(a - b) \\
a + b &= b \\
a + a &= a \\
2a &= a \\
2 &= 1
\end{aligned}
$$

What is wrong here?
We cancel both side of the equation by $a - b$, but our premise includes $a = b$,
so we have a division-by-zero problem.

Generally, performing cancellation without a zero-check is a terrible idea and should be avoided.

## Sets with zero elements

Ok, here is another stupid "proof" of that "all objects are the same." We will assume that objects are countable.

Proof:

Let $S$ be the set of all objects.
And let the property $P(n)$ mean that all subsets of $S$ of size at most $n$ contain the same same objects.
Formally:

$$
P(n) \equiv \forall X \in \text{Pow}(S),\; |X| \leq n \text{ such that } \forall o, o' \ \in X, o = o'
$$

where $\text{Pow}(S)$ is the power set of the set $S$, which is defined by all subsets of $S$, and $|X|$ means the cardinality (elements count) of $X$.

<aside style="margin-top: -100px;">
Pause for a moment and understand what this definition means, as we will use it in the following "proof."
</aside>

We want to prove that $\forall n > 1, P(n)$. And we will prove that by mathematical induction on $n$.

**Base case ($n = 1$):**

This is trivial as the singleton set of object can only contain the same object.

**Inductive cases:**

We treat $P(n)$ as our inductive hypothesis, and we need to prove $P(n + 1)$.
Without the loss of generality,
pick an arbitrary set $X \in \text{Pow}(S)$ such that $|X| = n + 1$.
Pick two objects $x, x' \in X$, and let's show $x = x'$.
Let $Y = X - {x}$ and $Y' = X - {x'}$.
Since $|Y| \le n, |Y'| \le n$, we know that $P(Y)$ and $P(Y')$ by the inductive hypothesis.
Pick an arbitrary object $y \in Y \cup Y'$.
We get $y = x$ because of $P(Y)$ and $x,y \in Y$.
Similarly, $y = x'$.
Thus, $x = x'$,
which proves the inductive steps and the "theorem" $\forall n > 1, P(n)$.

Again the mistake here is related to zero.
$|Y \cup Y'|$ can well be zero, so we cannot just "pick" an element from it.

If you are from a more programming background,
it is no coincidence that dividing by zero or getting an element from a collection of zero-elements will cause horrible run-time errors.

<aside style="margin-top: -60px;">
And most type systems will not save you (except dependent-typed ones, which have their own limitations.)
</aside>

I hope you have fun reading this post, just as me having fun writing it.
