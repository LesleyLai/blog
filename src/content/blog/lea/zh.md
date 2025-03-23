---
id: lea
title: 'X86 "lea" 指令背后的直觉'
lang: zh
created: 2019-06-11
modified: 2019-06-11
tags:
  - c
  - code
  - x86
---

一些朋友们在之前的[北丹佛地区C++聚会](https://www.meetup.com/North-Denver-Metro-C-Meetup/events/261292867/)上提到X86指令中的 `lea` 并不如其他的指令那么好理解。`lea` 是“load effective address”的缩写，一般来说被解释为“把某个内存地址从放到目标位置”。在Intel汇编语法下，`lea` 被写作

```asm
lea destination, source
```

举一个例子， 如果我们有一个 `struct Point` 的数组 `points`：

```c
struct Point
{
    int x;
    int y;
    int z;
};
```

当遇到 `int x = points[i].y;` 时，编译器可以生成如下的汇编：

```asm
mov  eax, [rbx+rcx*4 + 4]
```

在此行，寄存器 `rbx` 储存了数组 `points` 的地址，寄存器 `rcx` 代表 `i` ，而寄存器 `eax` 代表返回值 `x`。同理,编译器可将 `int* x = &points[i].y;` 编译为

```asm
lea  eax, [rbx+rcx*4 + 4]
```

编译器对于 `lea` 的妙用不止步与地址操作，它们也喜欢用 `lea` 进行算术操作。例如 `int y = x * 5;`就更有可能被编译成以下的形式：

```asm
lea     eax, [rdi + 4*rdi]
```

而不是下面的这种直接使用算术指令的形式。

```asm
imul    eax, [rdi], 5
```

我个人认为最好把 `lea` 理解成指针算术（pointer arithmetic）加上类型转换。如果用这种思维来看待前面的例子，那么相应的C代码是

```c
int y = (int)(&((int*)x)[x]);
```

这段代码首先把 `x` 当成一个 `int` 指针 ( `(int*)x` )，然后得到该指针指向的第`x`个元素。这样我们就得到了地址 `[rdi + 4*rdi]`。接下来，我们把该地址的低32位作为一个数字移到终点 `y`。

我希望该例能够给你一些对 `lea` 的直觉理解。当然，没有正常的C程序员会手写如上的代码 而在C++下该段代码更是非法（C++不允许把指针转换成小类型 `int`）。不过，从一个机器的角度，这种类型转换完全是免费的，而机器码经常会进行这种操作。
