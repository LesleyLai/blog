---
name: "OpenGL草地渲染器"
image: grass
created: 2019-12-14
github: https://github.com/LesleyLai/GLGrassRenderer
tags:
  - cpp
  - graphics
  - opengl
---

这个项目实现了是对论文[Responsive Real-Time Grass Rendering for General 3D Scenes](https://www.cg.tuwien.ac.at/research/publications/2017/JAHRMANN-2017-RRTG/JAHRMANN-2017-RRTG-draft.pdf)的复现。它使用贝塞尔曲线（Bézier curve）来表示单根草的数据，然后使用细分曲面着色器（tessellation shader）来从曲线动态生成草地的几何模型。同时，它使用了计算着色器（compute shader）来实现基于欧拉法的草地物理模拟，计算着色器同时使用了各种 culling 的技术来减少每帧所需要画的三角数量。
