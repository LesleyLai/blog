---
name: "CUDA Path Tracer"
image: "./cudapt.png"
created: 2021-09-28
modified: 2023-07-14
github: "https://github.com/LesleyLai/cuda-path-tracer"
featured: true
tags:
  - cpp
  - cuda
  - graphics
  - rt
---

这是一个用 C++ 和 CUDA 从零构建的交互式 GPU 路径追踪器。它不依赖专用的光线追踪硬件，而是完全通过软件实现所有核心功能。该渲染器包括一个使用表面积启发式(Surface Area Heuristic, SAH)构建的 GPU 加速 BVH，以及一个基于 Edge-Avoiding À-Trous Wavelet Transform 的去噪器。
