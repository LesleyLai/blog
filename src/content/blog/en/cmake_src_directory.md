---
title: "CMAKE_SOURCE_DIR is probably not what you want"
created: 2022-02-17
modified: 2022-02-17
tags:
  - cmake
  - cpp
  - code
---

Today is the nth time I got bitten by `CMAKE_SOURCE_DIR`, so I will write it here.
In short, there are two predefined variables in CMake: `CMAKE_SOURCE_DIR` and `PROJECT_SOURCE_DIR`.
`CMAKE_SOURCE_DIR` refers to the top-level source directory that contains a `CMakeLists.txt`,
while `PROJECT_SOURCE_DIR` refers to the source directory of the most recent `project()` command.

They are often the same, but a common workflow when using CMake is to use `add_subdirectory` to add libraries.
And in that case, any `CMAKE_SOURCE_DIR` in that inner library will refer to the outer project's root rather than the library's own root directory!
This behavior is wrong in the majority of cases, and thus we should use `PROJECT_SOURCE_DIR` instead.
