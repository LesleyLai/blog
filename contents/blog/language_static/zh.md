---
id: statics
title: "Concepts in Programming Languages, Part II: Statics"
lang: zh
create: '2020-03-02'
lastModify: '2020-03-02'
categories:
- pl
---

What are the *statics* of a programming language?
Most programming languages exhibit a *phase distinction* between *static* and *dynamic* phase of processing.
People sometime loosey say *static* of a language happened at "compile-time," and *dynamic* of a language occurred at "run-time."
The static phase of a language contains lexing, parsing, and in the case of static-typed languages, type-checking, and name resolution.
And the dynamic phase consists of the execution of a program.
We will only focus on static-typed languages in this post since the statics of dynamically-typed languages are trivial.

In the static phase, we consider what the valid operations of a program are.
We construct a set of rules on the *typing judgments* to state if an expression is well-formed for certain types.

## Static of a small expression language

Let's consider a pretty dull expression-oriented language below.

$$
\begin{array}{rcll}
\mathbf{Type} & \tau &::= & \text{Num} \\
&& \quad\! | &  \text{Str} \\
\mathbf{Expr} & e &::= & \text{num}[n] \\
&& \quad\! | &  \text{str}[s] \\
&& \quad\! | &  \text{plus}(e_1, e_2) \\
&& \quad\! | &  \text{minus}(e_1, e_2) \\
&& \quad\! | &  \text{concat}(e_1, e_2) \\
&& \quad\! | &  \text{len}(e)
\end{array}
$$

The above grammar defined two sorts, $\mathbf{Type} \ \tau$ and $\mathbf{Expr} \ e$.
A type in this language can either be number or string.
Now it's time to define the inference rules for the derivation of each operation.
First, the type of literals are quite obvious

$$
\frac{}{\text{num}(n) : \text{Num}}
$$

$$
\frac{}{\text{str}(s) : \text{Str}}
$$

The we can define typing for operations of the language:

$$
\frac{e_1 : \text{Num} \quad e_2 : \text{Num}}
{\text{plus}(e_1, e_2) : \text{Num}}
$$

If both the left-hand $e_1$ side and the right-hand $e_2$ side have the type $\text{Num}$,
the expression $\text{plus}(e_1, e_2)$ have the type $\text{Num}$.
Otherwise, $\text{plus}(e_1, e_2)$ is ill-formed.

We can use the similar way to define the rest of the operations:

$$
\frac{e_1 : \text{Num} \quad e_2 : \text{Num}}
{\text{minus}(e_1, e_2) : \text{Num}}
$$

$$
\frac{e_1 : \text{Str} \quad e_2 : \text{Str}}
{\text{concat}(e_1, e_2) : \text{Str}}
$$

$$
\frac{e : \text{Str}}
{\text{len}(e) : \text{Str}}
$$

With those basic rules, we can state that in our language, $\text{plus}(\text{num}[1], \text{num}[2])$ is well formed and $\text{len}(\text{num}[1])$ is a type error.

## Typing context

So far, our little language does not have variables.
In real programming languages, the type system needs to consider the typing context.
Let's introduce variables and let binding into our language:

$$
\begin{array}{rcll}
\mathbf{Expr} & e &::= & \cdots \\
&& \quad\! | &  \text{var}(v) \\
&& \quad\! | &  \text{let}(v, e_1, e_2)
\end{array}
$$

Now we can define variable in our languages such as $\text{let}(x, \text{num[1]}, \text{plus}(\text{var}[x], \text{num}[2]))$.
In a concrete syntax, the expression looks like

```
let x = 1;
x + 2 // evaluates to 3
```

Whether $\text{plus}(\text{var}[x], \text{num}[2])$ make sense depends on whether the variable x is defined in the surrounding context,
but our inference rule for $plus$ cannot catch that yet.

What you can do is to introduce another concept called typing context $\Gamma$, which is a mapping from variables to types.

$$
\begin{aligned}
\Gamma \equiv& \ \varnothing \\
 |& \ \Gamma', v: \tau
\end{aligned}
$$

We inductively define $\Gamma$ as either an empty set or the extension of another typing context $\Gamma'$ with one mapping from a variable to a type.

Then you need to change the judgment form of typing to $\Gamma \vdash e : \tau$, which means "under typing context $\Gamma$, the type of expression $e$ is $\tau$."

For most of the rules, nothing exciting happens besides the additional typing context in all judgments.

$$
\frac{}{\Gamma \vdash \text{num}(n) : \text{Num}}
$$

$$
\frac{}{\Gamma \vdash \text{str}(s) : \text{Str}}
$$

$$
\frac{\Gamma \vdash e_1 : \text{Num} \quad \Gamma \vdash e_2 : \text{Num}}
{\Gamma \vdash \text{plus}(e_1, e_2) : \text{Num}}
$$

$$
\frac{\Gamma \vdash e_1 : \text{Num} \quad \Gamma \vdash e_2 : \text{Num}}
{\Gamma \vdash \text{minus}(e_1, e_2) : \text{Num}}
$$

$$
\frac{\Gamma \vdash e_1 : \text{Str} \quad \Gamma \vdash e_2 : \text{Str}}
{\Gamma \vdash \text{concat}(e_1, e_2) : \text{Str}}
$$

$$
\frac{\Gamma \vdash e : \text{Str}}
{\Gamma \vdash \text{len}(e) : \text{Str}}
$$

For variable name resolution, we need to lookup in the typing context.

$$
\frac{}
{\Gamma, x : \tau \vdash x : \tau}
$$

For let bindings, we can extend the typing context and check the inference rules recursively.

$$
\frac{
\Gamma \vdash e_1 : \tau_1 \quad \Gamma, x : \tau_1 \vdash e_2 : \tau_2
}
{\Gamma \vdash \text{let}(x, e_1, e_2) : \tau_2}
$$

If you want to prevent name shadowing, you can change the rule a little bit.

$$
\frac{
x \notin \Gamma
\quad \Gamma \vdash e_1 : \tau_1 \quad \Gamma, x : \tau_1 \vdash e_2 : \tau_2
}
{\Gamma \vdash \text{let}(x, e_1, e_2) : \tau_2}
$$
