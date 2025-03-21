---
id: from-vs-to
title: "小提示：在函数和变量名称中使用 from 而非 to"
lang: zh
created: 2024-02-25
modified: 2024-02-25
tags:
  - code
  - opinion
---

今天我写到了涉及多个Map的代码片段。与许多其他人一样，我通常将这些Map命名为 `x_to_y`：

```rust
let mut value_to_var: HashMap<Value, (String, usize)> = HashMap::new();
let mut var_to_num: HashMap<String, usize> = HashMap::new();
let mut num_to_canonical_var = vec![];
```

当我需要使用这些Map时，我的代码通常看起来像这样：

```rust
let canonical_variable = num_to_canonical_var[var_to_num.get(var).unwrap()];
```

正如你所见，这个顺序并不特别直观。这段代码执行了从 variable 到 number 再到 canonical var 的转换，但理解它需要从内到外阅读，类似于解开螺旋一样。

从内到外阅读很具有挑战性。例如，尽管我有将近十年的 C 和 C++ 经验，但有时我仍然很难解读 C 声明语法。其他人也[经常有类似的感受](https://fuckingfunctionpointers.com/)。

如果我将所有的 to 改为 from，会怎么样呢？

```rust
let mut var_from_value: HashMap<Value, (String, usize)> = HashMap::new();
let mut num_from_var: HashMap<String, usize> = HashMap::new();
let mut canonical_var_from_num = vec![];
```

现在，我们可以这样写代码：

```rust
let canonical_variable = canonical_var_from_num[num_from_var.get(var).unwrap()];
```

这段代码更容易理解，因为相关的名称在位置上更加靠近。同样地，我们可以通过从右到左阅读来阅读来理解这段代码所进行的转换，而无需进行“陀螺式阅读。”

相同的想法也可以应用于函数。例如，`let shader = shader_from_file(file)` 比 `let shader = file_to_shader(file)` 更易读。考虑到函数（至少纯函数）和Map数据结构都旨在创建数据之间的映射，它们在命名上的相似自然并非巧合。

更新 2024-02-10：Mastodon 上的几位用户指出，他们更喜欢将他们的映射变量命名为 `x_by_y`，这与我在这里提出的 `x_from_y` 异曲同工。

更新 2024-02-11：Mastodon 上的另一位用户提到 [Joel Spolsky](https://www.joelonsoftware.com/2005/05/11/making-wrong-code-look-wrong/) 写过类似的建议。这篇文章还对作者推崇的“应用匈牙利命名法” （Apps Hungarian）与大多数人熟悉的更繁琐的“系统匈牙利命名法”（System Hungarian）进行了比较。
