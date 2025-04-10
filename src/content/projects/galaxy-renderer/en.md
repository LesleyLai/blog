---
name: "Galaxy Renderer"
image: "./galaxy-renderer.png"
created: 2022-06-20
github: https://github.com/LesleyLai/galaxy-renderer
tags:
  - rust
  - graphics
  - wgpu
  - webgpu
featured: true
---

This is a galaxy renderer built in Rust using wgpu. Star formations are procedurally generated based on [density wave theory](https://en.wikipedia.org/wiki/Density_wave_theory), with motion driven by compute shaders. The rendering pipeline is entirely GPU-driven with indirect rendering.