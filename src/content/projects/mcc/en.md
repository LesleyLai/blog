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

This is a work-in-progress C compiler written in C23, targeting x86-64 on Linux. It features a [three-address code](https://en.wikipedia.org/wiki/Three-address_code) [intermediate representation](https://en.wikipedia.org/wiki/Intermediate_representation).

Heavily inspired by [LLVM Lit](https://llvm.org/docs/CommandGuide/lit.html) and [Turnt](https://pypi.org/project/turnt/), this codebase also features comprehensive testing with a custom snapshot testing framework written in Rust.
