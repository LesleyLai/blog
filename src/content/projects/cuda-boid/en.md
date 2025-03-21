---
name: "CUDA Flocking"
image: boid
created: 2020-11-26
github: https://github.com/LesleyLai/CUDA-flocking-boid
tags:
  - cpp
  - cuda
  - graphics
  - opengl
---

This project is a CUDA implementation of [Boid](https://en.wikipedia.org/wiki/Boids), an artificial life program that simulates fishes or birds' flocking behaviors.
The project first build a naive brute-force implementation, and then gradually optimize with grid accelerating data-structure, better data locality, and usage of CUDA shared memory.
The simulation is visualized by OpenGL.

View my [2021 talk](https://www.youtube.com/watch?v=PPsP1unDkSg) on this project for details on the boid algorithm and my code.
