---
name: "Galaxy Renderer"
image: "./galaxy-renderer.png"
created: 2022-06-20
github: https://github.com/LesleyLai/galaxy-renderer
tags:
  - rust
  - graphics
  - webgpu
featured: true
---

这是一个使用 Rust 和 wgpu 构建的星系渲染器。恒星的分布基于密度波理论通过程序化方式生成，并由计算着色器驱动其运动。整个渲染流程完全由 GPU通过间接渲染（Indirect Rendering）驱动。
