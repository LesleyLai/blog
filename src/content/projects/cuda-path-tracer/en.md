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

An interactive GPU path tracer built from scratch in C++ with CUDA. It doesn't use dedicated ray tracing hardware, and instead implements all core functionality in software. The renderer includes a GPU-accelerated [BVH](https://en.wikipedia.org/wiki/Bounding_volume_hierarchy) constructed using the surface area heuristic (SAH), and a denoiser based on [Edge-Avoiding À-Trous Wavelet Transform](https://jo.dreggn.org/home/2010_atrous.pdf).