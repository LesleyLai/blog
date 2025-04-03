---
id: ast-in-cpp-part-1-variant
title: "Representing an Abstract Syntax Tree in C++: Part 1 - Variants"
lang: en
created: 2024-04-22
modified: 2024-04-22
tags:
  - code
  - cpp
  - pldev
---

Exploring the representation of abstract syntax trees in C++ has been a long-standing fascination of mine. Over time, I've developed several interpreters/compilers in C++, each utilizing different approaches to representation. In this post, I aim to share the insights I wish I had when I start building language implementations in C++.

Frankly, if I start on a programming language project today, I'd likely opt against C++ unless there is a very compelling reason. Nevertheless, I hope this knowledge I've amassed proves valuable to others.

Before delving further, it's worth noting that the question of "how to represent an AST" can be subdivided into two intertwined issues:

- How to represent a variant
- How to represent recursive data structure

In this post, we will focus on the first issue. And in the nest post, we will talk about the other issue.

## What Do I Mean by Variant?

Variant, also known as a sum type, tagged union, or discriminated union, is a data structure capable of containing a fixed set of alternatives. If you're reading this, chances are you've used variants before. The "fixed set" perspective is a [limitation](https://en.wikipedia.org/wiki/Expression_problem), but for AST we normally care more about the ease of extending behaviors rather than adding new node types.

Anyway, if there is any language with good support for language-level variants and pattern matching, I would go directly with those. But for C++, there are various alternative representations all with their tradeoffs and shortcomings.

## `std::variant`

We'll begin with std::variant, which is arguably the de facto "modern C++" solution for variants. It offers functionality and type safety, yet its ergonomics are [debatable](https://bitbashing.io/std-visit.html). It may also incur longer compile times compared to raw language solutions.

Using `std::variant`, we could write something similar to the following:

```cpp
struct LiteralExpr;
struct VariableExpr;
struct UnaryExpr;
struct BinaryExpr;
struct IfExpr;

using Expr = std::variant<LiteralExpr, VariableExpr, UnaryExpr, BinaryExpr, IfExpr>;
using ExprHandle = std::unique_ptr<Expr>;

struct LiteralExpr {
  Literal lit;
};

struct VariableExpr {
  std::string ident;
};

struct UnaryExpr {
  UnaryOp op;
  ExprHandle expr;
};

struct BinaryExpr {
  BinaryOp op;
  ExprHandle lhs;
  ExprHandle rhs;
};

struct IfExpr {
  ExprHandle cond_expr;
  ExprHandle if_expr;
  ExprHandle else_expr;
};
```

<aside>

I used `unique_ptr` here, and in the second part of the post I will explain alternative options.

</aside>

Forward declaring everything is annoying, and we also probably want to put some common fields, such as the source location, into an AST node. This prompts the following adjustment:

```cpp
struct Expr;
using ExprHandle = std::unique_ptr<Expr>;

// all kinds of of the Expr here

struct Expr {
  SourceSpan span;
  std::variant<LiteralExpr, VariableExpr, UnaryExpr, BinaryExpr, IfExpr> kind;
};
```

<aside>

Alternatively, you can inherit from `std::variant`, which used to be broken in C++17 but [was fixed since C++20](https://wg21.link/p2162r2).

</aside>

The above code looks alright, but the main ergonomics problem of the `std::variant` is how to visit them. C++ doesn't have pattern matching, and we are given a companion funciton called `std::visit`, which accept a visitor as argument.

One way to define this visitor is to create a dedicated class:

```cpp
[[nodiscard]] auto to_string(const Expr& expr) -> std::string;

struct ExprKindPrinter {
  auto operator()(const LiteralExpr& kind) const -> std::string {
      return to_string(kind.lit);
  }

  auto operator()(const VariableExpr& kind) const -> std::string {
      return kind.ident;
  }

  auto operator()(const UnaryExpr& kind) const -> std::string {
    return fmt::format("({} {})", to_string(*kind.op), to_string(*kind.expr));
  }

  auto operator()(const BinaryExpr& kind) const -> std::string {
    // ...
  }

  auto operator()(const IfExpr& kind) const -> std::string {
    // ...
  }
};

[[nodiscard]] auto to_string(const Expr& expr) -> std::string {
    return std::visit(ExprKindPrinter{}, expr.kind);
}
```

This looks verbose and boilerplaty, and another option is to use generic lambdas and `if constexpr`:

```cpp
// Helper to catch unreachable branches at compile time
template<class> constexpr bool always_false_v = false;

[[nodiscard]] auto to_string(const Expr& expr) -> std::string {
    return std::visit([] (auto&& kind) {
      using KindT = std::decay_t<decltype(kind)>;
      if constexpr (std::is_same_v<KindT, LiteralExpr>) {
        return to_string(kind.lit);
      } else if constexpr (std::is_same_v<KindT, VariableExpr>) {
        return kind.ident;
      } else if constexpr (std::is_same_v<KindT, UnaryExpr>) {
        return fmt::format("({} {})", "+", expr_to_string(*kind.expr));
      } else if constexpr (std::is_same_v<KindT, BinaryExpr>) {
        ...
      } else if constexpr (std::is_same_v<KindT, IfExpr>) {
        ...
      } else {
        static_assert(always_false_v<KindT>, "non-exhaustive visitor!");
      }
    }, expr.kind);
}
```

I prefer this to the previous version.However, it still appears quite cumbersome with all the `decltype`, `std::decay_t`, and `std::is_same_v` incantations. Also, [since generic lambda is template](/en/auto-parameters), we have worse IDE auto-completion/error detection support when writing this code.

Yet another option is to use the `overloaded` helper:

```cpp
template<class... Ts>
struct overloaded : Ts... { using Ts::operator()...; };
```

With that we could write code like the following:

```cpp
[[nodiscard]] auto to_string(const Expr& expr) -> std::string {
    return std::visit(overloaded{
        [](const LiteralExpr& kind) { return to_string(kind.lit); },
        [](const VariableExpr& kind) { return kind.ident; },
        [](const UnaryExpr& kind) {
            return fmt::format("({} {})", "+", to_string(*kind.expr));
        },
        [](const BinaryExpr& kind) { /* ... */ },
        [](const IfExpr& kind) { /* ... */ }
    }, expr.kind);
}
```

This seems much cleaner compared to the previous solutions, but it still feels somewhat awkward compared to a language-integrated solution.

## Discriminated Union

`std::variant` was intended to supersede the traditional practice of discriminated unions that has been in use since the days of C. With the classic discriminated union, we typically have something along these lines:

```cpp
enum class ExprKind {
  literal,
  variable,
  unary,
  binary,
  if_
};

struct Expr {
  ExprKind kind;
  union {
    LiteralExpr literal;
    VariableExpr variable;
    UnaryExpr unary;
    BinaryExpr binary;
    IfExpr if_;
  } data;
};
```

We loss type safety since `union` access is not checked, but the upper side is that we can just use plain `switch` instead of doing gymnastics with `std::visit`:

```cpp
[[nodiscard]] auto to_string(const Expr& expr) -> std::string {
  switch (expr.kind) {
    case ExprKind::literal: return to_string(expr.data.literal);
    case ExprKind::variable: return to_string(expr.data.variable.ident);
    ...
  }
}
```

Another major downside of raw union is that it can't handle non-[trivial types](https://en.cppreference.com/w/cpp/named_req/TrivialType) (e.g. `std::string` or `std::unique_ptr`). This is because the compiler has no idea which member's destructor to call when destructing a union (similarly, copy and move will also be broken). If you require non-trivial types, you'll have to write your own destructor for `Expr`, which can become tedious and error-prone.

If you opt to stick with trivial types, such as `std::string_view` for strings and `Expr*` for expression handles, you'll need to consider resource management. A great strategy is to implement an allocation scheme like the arena allocator, where deallocation is unnecessary. This approach can provide a robust and reliable solution.

## Enum Tag + Inheritance

One problem with the "tagged union" approach is that it can waste memory, especially if if some of your nodes are significantly larger than others, as the size of `variant` or `union` will always be the size of its largest alternative. We can address this issue by using inheritance:

```cpp
struct Expr {
  ExprKind kind;
};

struct LiteralExpr : Expr {
  Literal lit;
};
```

Utilizing this type closely resembles the previous one, with the notable difference being the necessity for down-casting:

```cpp
[[nodiscard]] auto to_string(const Expr& expr) -> std::string {
  switch (expr.kind) {
    case ExprKind::literal:
     return to_string(static_cast<const LiteralExpr&>(expr));
    case ExprKind::variable:
     return static_cast<const VariableExpr&>(expr).ident;
    ...
  }
}
```

The excessive amount of down-casting can be annoying, but we can mitigate this issue by writing some helper functions:

```cpp
struct Expr {
  ExprKind kind;

  auto as_literal_expr() const & -> const LiteralExpr&;
};

struct LiteralExpr : Expr {
  Literal lit;
};

auto Expr::as_literal_expr() const & -> const LiteralExpr&
{
    return static_cast<const LiteralExpr&>(*this);
}

[[nodiscard]] auto to_string(const Expr& expr) -> std::string {
  switch (expr.kind) {
    case ExprKind::literal:
     return to_string(expr.as_literal_expr());
    ...
  }
}
```

I actually quite like this solution despite it violates "OOP best practices." Though if you don't have a `virtual` destructor, you face a similar issue of the previous solution.

## A Virtual Function That Returns Enum Tag

If you don't mind adding virtual functions, it gives us back type safety and also solves the problem of supporting non-trivial types. Additionally, the enum tag field becomes redundant, eliminating the need to store it within the `Expr`. Consequently, we can implement something akin to the following:

```cpp
struct Expr {
    [[nodiscard]] virtual auto kind() const -> ExprKind;
    virtual ~Expr() = default;
};

struct BinaryOpExpr : Expr {
    auto kind() const -> NodeKind override { return NodeKind::BinaryOp; }
};
```

With virtual functions, we can also implement checked down-casting, unlike the previous version:

```cpp
struct Expr {
  ...

  auto as_literal() const& -> const LiteralExpr* { return nullptr; }
};

struct LiteralExpr : Expr {
  auto as_literal() const& -> const LiteralExpr* { return this; }
};
```

Like the last one, this method still violates the "OOP best practice" of not using enum tags and inheritance together.

### Inheritance with the Visitor Pattern Approach

Lastly, let's look at the [visitor pattern](https://en.wikipedia.org/wiki/Visitor_pattern), the canonical OOP way to create and traverse variants. First, we need to define a visitor type:

```cpp
struct ExprVisitor {
  ExprVisitor() = default;
  virtual ~ExprVisitor() = default;

  virtual void visit(const LiteralExpr&) = 0;
  virtual void visit(const VariableExpr&) = 0;
  virtual void visit(const UnaryExpr&) = 0;
  virtual void visit(const BinaryExpr&) = 0;
  virtual void visit(const IfExpr&) = 0;
};
```

Then we adds an `accept` method for `Expr`:

```cpp
struct Expr {
  virtual void accept(ExprVisitor& visitor) const = 0;
};

struct LiteralExpr : Expr {
  double value;

  void accept(ExprVisitor& visitor) const override { visitor.visit(*this); }
};

struct VariableExpr : Expr {
  std::string id;

  void accept(ExprVisitor& visitor) const override { visitor.visit(*this); }
};
```

Note that even though all the implementation of `accept` looks identical, we need this duplicated code in each derived class of `Expr` because we are overloading on the type of `*this`. If you want to make this more explicitly, you can also change the name of the `visit` methods in `ExprVisitor` into something like `visit_literal` and `visit_variable`.

With all that boilerplate, we can start to use our visitor. However, we immediately face another significant annoyance: unlike in languages such as Java, there is no way to make a `virtual` function to return different types based on a template parameter:

```cpp
// The following will not work!!!
template <typename T>
virtual auto visit(const LiteralExpr&) -> T = 0;
```

As a result, we need to save the result of a visitor into another variable:

```cpp
struct ExprPrinter : ExprVisitor {
  std::string result;

  void visit(const LiteralExpr& expr) override
  {
    result = to_string(expr.lit);
  }

  void visit(const VariableExpr& expr) override
  {
    result = expr.ident;
  }

  ...
};

[[nodiscard]] auto to_string(const Expr& expr) -> std::string
{
  ExprPrinter printer;
  expr.accept(printer);
  return printer.result;
}
```

Another problem with visitor pattern is const-correctness. Although I believe that a mutable AST isn't necessarily the best approach and [there are superior alternatives](https://btmc.substack.com/p/how-to-store-types-after-semantic), if you do need to mutate your AST, you need to define _yet_ another mutable visitor base class to achieve that. Also don't forget about all those `accept` member functions:

```cpp ins={1-10,14,21,28}
struct ExprMutableVisitor {
  ExprMutableVisitor() = default;
  virtual ~ExprMutableVisitor() = default;

  virtual void visit(LiteralExpr&) = 0;
  virtual void visit(VariableExpr&) = 0;
  virtual void visit(UnaryExpr&) = 0;
  virtual void visit(BinaryExpr&) = 0;
  virtual void visit(IfExpr&) = 0;
};

struct Expr {
  virtual void accept(ExprVisitor& visitor) const = 0;
  virtual void accept(ExprMutableVisitor& visitor) = 0;
};

struct LiteralExpr : Expr {
  double value;

  void accept(ExprVisitor& visitor) const override { visitor.visit(*this); }
  void accept(ExprMutableVisitor& visitor) override { visitor.visit(*this); }
};

struct VariableExpr : Expr {
  std::string id;

  void accept(ExprVisitor& visitor) const override { visitor.visit(*this); }
  void accept(ExprMutableVisitor& visitor) override { visitor.visit(*this); }
};
```

Of all the alternatives I've presented so far, the visitor pattern is likely the slowest, because it performs [double dispatch](https://en.wikipedia.org/wiki/Double_dispatch) (once at `visit` and once at `accept`) while all the other options perform a single dispatch. The boilerplate is also unwieldy. I would not recommend it if you don't actually need double dispatch.

## "Uber node" as an alternative to variant?

It is convinient to have one single "uber node" type that is flexible enough to accomodate for all different kind of AST nodes, and this way we don't need variants at all. For example, we may have something like this:

```cpp
struct Node {
  NodeKind kind;
  std::vector<Node> children;
  std::span<Token> tokens;
}
```

I have seen this approach used in "simple compiler" codebases such as [9cc](https://github.com/ktateish/9cc). One of the main upside of this approach is that if you write some tree/graph algorithm on `Node`, it will automatically work for all nodes. The downside including performance and space waste. Also, this approach means it takes more effort to extract data from an AST node, and it is not clear whether a certain kind of node contains a certain field.

## Conclusion

All of the above methods are used in the wild. So, YMMV. Nonetheless, it's crucial to remain conscious of the available options and the trade-offs associated with each.
