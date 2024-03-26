---
id: noexcept-codegen
title: "noexcept对代码生成的影响"
lang: zh
created: "2020-03-02"
modified: "2020-09-20"
tags:
  - code
  - cpp
---

在C++代码中，如果我们把每个函数声明都加上`noexcept`，我们的代码会变得更高效吗？
事情不是这么地简单。
考虑以下代码片段:

```cpp
int g();

int f() {
  return g();
}
```

我故意不在此翻译单元（translation unit）中定义`g`，否则的话编译器会有足够的信息来内联（inline）`g`的所有内容。
尽管如此，所有主要的C++编译器都能弄清楚`f`仅包含对`g`的尾调用，并生成如下代码：

```nasm
f():
        jmp     g()
```

现在我们来考虑如下的代码片段:

```cpp
int g();

int f() noexcept {
  return g();
}
```

编译器在不知道`g`是否会抛出异常的情况下被迫在`f`生成代码来处理异常的确被抛出的情况。下列是不同的编译器生成的汇编码：

msvc

```nasm
$ip2state$int f(void) DB 02H
        DB      08H
        DB      00H
$cppxdata$int f(void) DB 060H
        DD      imagerel $ip2state$int f(void)

int f(void) PROC                                      ; f, COMDAT
$LN5:
        sub     rsp, 40                             ; 00000028H
        call    int g(void)                         ; g
        npad    1
        add     rsp, 40                             ; 00000028H
        ret     0
int f(void) ENDP                                      ; f
```

gcc

```nasm
f():
        sub     rsp, 8
        call    g()
        add     rsp, 8
        ret
```

clang

```nasm
f():
        push    rax
        call    g()
        pop     rcx
        ret
        mov     rdi, rax
        call    __clang_call_terminate
__clang_call_terminate:
        push    rax
        call    __cxa_begin_catch
        call    std::terminate()
```

## 如何处理C函数

现在我们知道，在`noexcept`函数中调用非`noexcept`的函数会产生低效的代码
我们如何处理某些保证不会抛出异常却没有被标记为`noexcept`的函数呢？
幸运的是，[Hana Dusíková](https://twitter.com/hankadusikova?s=20)已经给我们提供了一个解决方案：

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Did you ever get an suboptimal code, because you were calling external C function in your noexcept code?<br/><br/>Suffer no more:<a href="https://t.co/LA7C76a063">https://t.co/LA7C76a063</a></p>&mdash; Hana Dusíková 🍊 (@hankadusikova) <a href="https://twitter.com/hankadusikova/status/1276828584179642368?ref_src=twsrc%5Etfw">June 27, 2020</a></blockquote>

你可以通过将`noexcept_cast`函数标记为强迫内联（force inline），这样的话即使在debug mode下`noexcept_cast`函数也不会造成性能损失。

## 结论

请小心对`noexcept`使用，特别要注意那些可能会运行用户提供代码的高阶函数（higher-order functions）。
