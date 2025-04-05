---
name: "OpenGL Grass Renderer"
image: "./grass.gif"
created: 2019-12-14
github: https://github.com/LesleyLai/GLGrassRenderer
tags:
  - cpp
  - graphics
  - opengl
featured: true
---

This project is my implementation of the paper [Responsive Real-Time Grass Rendering for General 3D Scenes](https://www.cg.tuwien.ac.at/research/publications/2017/JAHRMANN-2017-RRTG/JAHRMANN-2017-RRTG-draft.pdf). It uses a combination of compute and tessellation shaders to implement grass simulation and rendering. Grass blades are represented by [Bezier curves](https://en.wikipedia.org/wiki/B%C3%A9zier_curve), and the tessellation shaders dynamically create the grass geometry from the Bezier curves. The compute shader performs Euler's method to simulate the physics of grass blades and then use various culling techniques to reduces the grass blades to draw each frame.
