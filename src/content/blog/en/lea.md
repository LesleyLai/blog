---
title: 'Intuition Behind X86 "lea" Instruction'
created: 2019-06-11
modified: 2019-06-11
tags:
  - c
  - code
  - x86
---

During the [last meeting](https://www.meetup.com/North-Denver-Metro-C-Meetup/events/261292867/) of the North Denver C++ Meetup, some people mentioned that the x86 `lea` is more confusing than other instructions. `lea` is an acronym for "load effective address." The usual explanation is "to put a memory address from the source into the destination." The syntax of `lea` in the Intel Syntax is the following:

```asm
lea destination, source
```

For example, if you have an array `points` of `struct Point`:

```c
struct Point
{
    int x;
    int y;
    int z;
};
```

The compiler may generate the following line for `int x = points[i].y;`

```asm
mov  eax, [rbx+rcx*4 + 4]
```

In this case, the register `rbx` points to the array `points`, `rcx` is the index variable `i`, and `eax` is the register that holds `x`. Similarly, for `int* x = &points[i].y;`, compilers can generate

```asm
lea  eax, [rbx+rcx*4 + 4]
```

However, besides using it for address operations, compilers seem to prefer using `lea` to other arithmetic instructions as well for efficiency reason. For example, `int y = x * 5;` may generate

```asm
lea  eax, [rdi + 4*rdi]
```

instead of the more intuitive version of

```asm
imul  eax, [rdi], 5
```

`lea` is, in my point of view, a process of pointer arithmetic sandwiched with casts. For the previous example, the equivalent c code is

```c
int y = (int)(&((int*)x)[x]);
```

The above code first treats `x` as an `int` pointer (`(int*)x`), and then get address the `x`-th element of that pointer. That part is essentially the address `[rdi + 4*rdi]`. Next, it assigns the lower 32 bits of the address as an integer value to the destination.

I hope this example gives you some intuitive understanding about `lea`. Of course, no sane C programmer will write such kind of code by hand. The above code is not even conforming C++ for a good reason (C++ disallow casting from pointer to smaller type `int`). However, from a machine's perspective, such kind of "reinterpret_cast" is essentially a no-op, and machine languages leverage that all the time.
