---
id: const-and-reference-member-variables
title: "在C++中使用Const或者引用成员变量的后果"
lang: zh
created: "2020-08-25"
modified: "2020-09-29"
tags:
  - code
  - cpp
---

在 C++中，使用`const`或者引用非静态成员变量会造成一些问题。
很多的资深 C++程序员都知道这一点，
但是网上没有人单独写一篇文章来阐述原因。
而我在网上反复看到有人问这个问题，
所以我决定写下这篇博文。

## Const 成员变量

在有一些编程语言中，例如 Rust，所有变量都默认是`const`，而你需要手动声明某个变量是可变的。
如果你有使用这些编程语言的经历，那么你可能会想在 C++中给所有不需要修改的变量都加上`const`。
这种实践有很大的好处。
但在 C++中，成员变量是一个例外，因而我们并不会把这种实践放到成员变量上。

`const`成员变量禁用了一个类的赋值（assignment）以及移动语义（move semantics）。
这听起来很有道理，因为你肯定不希望重新赋值或者移走某个`const`变量。

“所有这有什么问题吗？”你可能会问，“我已经说过我不想修改这个变量了。”

但是很多的操作，例如`swap`，依赖于赋值以及移动语义两者。
如果单单缺乏了移动语义，`swap`仍然可以复制。
但赋值的缺乏会造成`swap`无法编译通过：

```cpp
struct BadImmutablePoint {
    const int x = 0;
    const int y = 0;
};

int main() {
  BadImmutablePoint p1;
  BadImmutablePoint p2 {42, 55};
  std::swap(p1, p2); // 错误
}
```

不仅仅是 swap，所有 STL 中和赋值有关的操作都会被禁用。例如排序：

```cpp
std::vector<BadImmutablePoint> points;
// 想要按x轴排序
std::ranges::sort(points, {}, &BadImmutablePoint::x); // 错误
```

## 但我不想要修改这个成员变量！

在 C++中，你最多只能把这个变量设为`private`，然后只暴露这个变量的 Getter。

这种做法仍然没有防止该类内部的成员函数修改这个成员变量，
但至少类以外的函数再也没法随意改动这个变量了。

```cpp
class ImmutablePoint {
    int x_ = 0;
    int y_ = 0;

public:
    constexpr ImmutablePoint() = default;
    constexpr ImmutablePoint(int x, int y) : x_{x}, y_{y} {}
    [[nodiscard]] constexpr auto x() const -> int { return x_; }
    [[nodiscard]] constexpr auto y() const -> int { return y_; }
};

int main() {
    std::vector<ImmutablePoint> points;
    ...
    std::ranges::sort(points, {}, &ImmutablePoint::x); // Ok
}
```

上例中有很多的“八股代码”（boilerplate code）。

老实说，如果让我写这个例子，我会使用简单的聚合加上非`const`的成员变量:

```cpp
struct Point {
    int x = 0;
    int y = 0;
};

const Point immutable_point {42, 55};
```

如果你真的想要搞得很花哨的话，你甚至可以写一段小的模板来自动化上述的过程。

```cpp
template <typename T>
class const_wrapper {
    T val_;
public:
    constexpr const_wrapper(const T& val) : val_{val} {}
    constexpr const_wrapper(T&& val) : val_{std::move(val)} {}

    [[nodiscard]] constexpr auto get() const -> const T& { return val_; }
    [[nodiscard]] constexpr operator T() const { return val_; }
};
```

<aside style="margin-top: -210px;">

如果你想的话，也可以给这个`const_wrapper`类模板加上一个变参模板（variadic template）的构造函数。
这样使用起这个模板会更加方便。

</aside>

那么你就可以按照如下的方式来使用这个模板：

```cpp
struct ImmutablePoint {
    const_wrapper<int> x = 0;
    const_wrapper<int> y = 0;
};

int main() {
    std::vector<ImmutablePoint> points;
    ...
    std::ranges::sort(points, {}, &ImmutablePoint::x); // Ok
}
```

## 引用成员变量

C++引用无法重绑定，这一点与指针以及很多其他语言中的“引用”不同。
因此，我们面对和`const`一样的情况。
引用非常类似于一个不能是空的常指针。
例如，如下的三角形结构体有和拥有`const`成员变量的结构体同样的问题：

```cpp
struct BadImmutableTriangle {
    const ImmutablePoint& a;
    const ImmutablePoint& b;
    const ImmutablePoint& c;
};
```

与之前类似，
我们同样可以不直接储存引用成员变量，
而储存指针成员变量并且只暴露 getter。

```cpp
class ImmutableTriangle {
    const ImmutablePoint* a_;
    const ImmutablePoint* b_;
    const ImmutablePoint* c_;

public:
    // 没有默认构造函数，必须提供三角形的三个顶点
    constexpr ImmutableTriangle(
        const ImmutablePoint& a,
        const ImmutablePoint& b,
        const ImmutablePoint& c)
        : a_{&a}, b_{&b}, c_{&c} {}

    [[nodiscard]] constexpr auto a() const -> const ImmutablePoint& { return *a_; }
    [[nodiscard]] constexpr auto b() const -> const ImmutablePoint& { return *b_; }
    [[nodiscard]] constexpr auto c() const -> const ImmutablePoint& { return *c_; }
};
```

C++标准库很方便得包含了[`std::reference_wrapper`](https://zh.cppreference.com/w/cpp/utility/functional/reference_wrapper)类型，它和我们刚刚提到的`const_wrapper`非常类似。

```cpp
struct ImmutableTriangle {
    std::reference_wrapper<const ImmutablePoint> a;
    std::reference_wrapper<const ImmutablePoint> b;
    std::reference_wrapper<const ImmutablePoint> c;
};
```

`std::reference_wrapper`比我的`const_wrapper`更有用。
比如说，`std::reference_wrapper`可以用来把多个引用存入一个容器：

```cpp
std::vector<ImmutablePoint&> triangles1; // Error
std::vector<std::reference_wrapper<ImmutablePoint>> triangles2; // Ok
std::vector<ImmutablePoint*> triangles3; // Ok
```

那么`std::ranges::sort(triangles2);`根据三角形的值来排序。
因为三角形没有默认的顺序，这句会在我们意料之中编译不通过。
反过来，`std::ranges::sort(triangles3)`可以编译通过，
但是它会根据指针的地址来排序，这一定不是我们想要的行为。

## 在什么时候可以使用 Const 或者引用成员变量？

在某些情况下，某个类对应的默认赋值以及移动语义本来就不可用或者已经被删除了。
比如继承体系（inheritance hierarchies）就是一个主要的例子。
在这些情况下，使用`const`或者引用成员变量也不会有什么后果。

在使用本地函数对象时，我们有时候也需要使用到`const`或者引用成员变量。
lambda 表达式中被引用捕获（capture by reference）的变量会被转化为引用成员变量。

## 结论

C++是一门指令式编程语言。
它继承了很多 C 的特点，而`const`以及引用都是后来才加入到语言当中的。
赋值在 C++语言中有非常重要的应用。
因此，不管你喜不喜欢，你很难限制外界代码修改单独某个成员变量的自由。
