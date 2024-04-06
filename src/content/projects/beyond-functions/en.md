---
name: "beyond::functions"
created: "2019-09-15"
website: https://beyond-engine.github.io/functions/
github: https://github.com/Beyond-Engine/functions
tags:
  - cpp
  - library
---

`beyond::functions` is a C++17 implementation of various type erased callable types
including `unique_function` (small-buffer optimized like `std::function` but is const correct and move-only, see [p0228](http://wg21.link/p0228))
and `fixed_function` (always stack-allocated with a fix maximum capacity).
This library is the stand-along version of the same components in the [beyond::core](https://github.com/Beyond-Engine/Core) library.
