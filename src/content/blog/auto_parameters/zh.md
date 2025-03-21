---
id: auto-parameters
title: "在C++中，不要不假思索地使用auto参数"
lang: zh
created: 2021-03-09
modified: 2021-03-09
tags:
  - code
  - cpp
  - opinion
---

从C++14开始，我们可以创建带`auto`参数的lambda表达式。
到了C++20，我们甚至可以在正常的函数中使用`auto`参数。
随着这一特性的出现，
在一些C++程序员开始流行了把所有的参数都使用`auto`的风气。
然而，我认为除非我们不得已，我们不应该使用`auto`参数。

## 为什么人们会喜欢它？

在某些时候写出具体的类型确实比较烦人，因此人们就会开始使用`auto`参数的风格。
当我们写拥有大量模板的泛型编程时，这可能确实是一个合理的理由。
但在很多时候，通过重构我们可以避免写很多"写得很烦"的类型。
我们甚至可以通过这样做获得更高的代码质量。

例如，我在网上找到了如下的代码。因为隐私因素，我对它略进行了一些修改。
的确，在如下代码中显式写出`pair`类型的参数确实过于扰人。

```cpp
std::vector<std::pair<double, double>> pairs;

return std::accumulate(
  pairs.cbegin(), pairs.cend(), 0,
  [](auto acc, const auto& pair) {
      return acc + pair.first * pair.second;
});
```

同时，如果只阅读这一小段，我也完全不知道这段代码到底做了些什么因为一个`pair`的`first`以及`second`值完全没有任何含义。
假如是我们把`pairs`的元素变为一个有名字的结构体呢？

```cpp
struct Outcome {
  double probability = 0;
  double value = 0;
};

std::vector<Outcome> distribution;

return std::accumulate(
  distribution.cbegin(), distribution.cend(), 0,
  [](double acc, const Outcome& outcome) {
      return acc + outcome.probability * outcome.value;
});
```

突然间，我们很容易就可以看出这段代码在计算一个离散随机变量的期望值！

不幸的是，有些人不仅没有想办法给他们的变量更具体的类型，
而反而变得如此适应`auto`参数风格，
以至于他们即使在`auto`并不能使得代码更加简洁的地方也开始到处使用`auto`参数。

```cpp
const std::vector<int> v1 = ...;
const std::vector<int> v2 = ...;
std::vector<int> smaller_ones;

std::ranges::transform(v1, v2, std::back_inserter(smaller_ones),
  [](auto x, auto y) { return std::min(x, y); });
```

## `auto`参数会生成模板

在如[ML](https://zh.wikipedia.org/wiki/ML%E8%AF%AD%E8%A8%80)或Rust的一些一些编程语言中，
类型系统可以通过定义推断出一个函数或lambda表达式的确切类型。
这些语言也有不同的类型注释（type annotation）语法从而使得这些语言的程序员习惯省略lambda表达式具体的参数类型。
在写过这些语言后，这些人回到了C++并且开始使用相同的代码规范。
但是，因为C++拥有模板、重载（overloading）、以及[实参依赖查找](https://zh.cppreference.com/w/cpp/language/adl)（argument-dependent lookup）这些复杂特性，C++编译器无法实现这样的类型推断。
因此，当我们使用`auto`参数时，编译器会生成不受约束的模板。
例如，我们可以使用[cppinsights](https://cppinsights.io/)网站来看编译器对`[](auto x, auto y) { return x * y + 42; });`表达式所做的变换：

```cpp
class __lambda_5_2
  {
    public:
    template<class type_parameter_0_0, class type_parameter_0_1>
    inline /*constexpr */ auto operator()(type_parameter_0_0 x, type_parameter_0_1 y) const
    {
      return (x * y) + 42;
    }
    private:
    template<class type_parameter_0_0, class type_parameter_0_1>
    static inline auto __invoke(type_parameter_0_0 x, type_parameter_0_1 y)
    {
      return (x * y) + 42;
    }

  } __lambda_5_2{};
```

当我们开始写超过单行的lambda表达式时，这个问题就变得更加突出了
甚至当我们开始在C++20中为普通函数使用自动参数时，这个问题就更加突出了。

问题是，模板编程与平常编程的体验并不相同。
在模板编程中，类型错误比我们想要的更晚被发现。
而且我们的IDE自动补全以及错误检测功能在模板中一般都没有办法发挥最好的效果。
当我们开始写较长的lambda表达式时或者甚至我们开始把`auto`参数应用到普通函数时，这个问题就变得更加突出。

## 不受约束的模板是危险的

即使当我们需要模板时，通常对模板进行约束是一个更好的做法。
在一次讲话中，Bjarne Stroustrup（C++创始者）提到`auto`是最没用被约束的[概念](https://zh.cppreference.com/w/cpp/language/constraints)[^1]

[^1]: [CppCon 2018: Bjarne Stroustrup “Concepts: The Future of Generic Programming (the future is here)”](https://youtu.be/HddFGPTAmtU)

在没有约束的情况下，我们很容易错误得把不小心与接口相匹配的类型传给模板函数。
比方说，我们有一个三维的向量结构，
我们很自然地会想对它们进行点积（dot product）：

```cpp
struct Vec3 {
  float x = 0;
  float y = 0;
  float z = 0;
};

auto dot(auto v1, auto v2) {
  return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}
```

之后当我们想要增加四维的向量结构时，C++并不会阻止我们同样对这个向量结构使用之前为三维向量准备的`dot`函数：

```cpp
struct Vec4 {
  float x = 0;
  float y = 0;
  float z = 0;
  float w = 0;
};

dot(Vec4{1, 2, 3, 4}, Vec4{1, 2, 3, 4}); // 我们想要30，但结果我们得到了14
```

The C++ Core Guidelines也提到了在高度可见的范围内使用不受约束的模板是非常危险的，尤其是考虑到实参依赖查找。[^2]

[^2]: [T.47: Avoid highly visible unconstrained templates with common names](https://github.com/isocpp/CppCoreGuidelines/blob/master/CppCoreGuidelines.md#Rt-visible)

## 明确的类型注释提供了文档价值

即使在上述的C++特有问题的其它语言中，
显式的参数类型同时起到了文档的目的。
并且，在重构过程中，显式的参数类型可以使得类型检查的工作更加得轻松。
这就是为什么在各种ML变种和以及Haskell中，
没有显式类型注释的顶级函数被认为是不好的风格。
而Rust规定所有的顶级函数都必须提供显式类型。

当我们在任何静态类型的编程语言中使用一个不熟悉的API时，
我们通常会通过类型注解来帮助理解一个函数做了些什么。
如果我们使用`auto`参数的话，
我们将不会给其他人或者未来的自己留下关于这些参数性质的提示。

## 结论

我们并不是总是能避免`auto`参数。
在C++20之前，没有办法可以为lambda表达式使用[概念](https://zh.cppreference.com/w/cpp/language/constraints)（Concept）或显式模板。
另外，在某些情况下，使用`auto`参数的便利性和生产力的提高可能超过了它的缺点。
然而，我认为其弊端严重到足以将自动参数视为一种代码异味（code smell）。
当遇到带有`auto`参数的代码时，我们应该总是问："这里有可能使用一个具体的类型吗？"
如果不是这样的话，那么下一个问题就是，"这里有可能使用一个概念吗？"
