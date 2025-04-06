---
name: "Mini C Compiler"
image: "./mcc.png"
created: 2024-11-12
modified: 2025-04-04
github: "https://github.com/LesleyLai/mcc"
featured: true
tags:
  - c
  - compiler
  - rust
---

这是一个正在开发中的 C 编译器，使用 C23 编写，目标平台为 Linux 上的 x86-64 架构。它采用三地址码作为中间表示。

受到[LLVM Lit](https://llvm.org/docs/CommandGuide/lit.html)和[Turnt](https://pypi.org/project/turnt/)的启发，该代码库还包含了用Rust编写的自定义快照测试框架，以实现全面的测试覆盖。
