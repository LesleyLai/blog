---
id: noexcept-codegen
title: "The surprising codegen impact of noexcept"
lang: en
created: 2020-03-02
modified: 2020-09-20
tags:
  - code
  - cpp
description: "Would spamming the noexcept keyword make your C++ code faster? Sometimes. But not always. This post talks about the suprising downside when adding noexcept to functions."
---

Would spamming the `noexcept` keyword make your code faster? Sometimes. But not always. Consider the following snippet of code:

```cpp
int g();

int f() {
  return g();
}
```

I intentionally do not define `g` in this translation unit since otherwise, the compiler will be too smart and inline everything.
Nevertheless, all the major C++ compilers can figure out that `f` only contains a tail-call to `g` and generate codes like this:

```asm
f():
        jmp     g()
```

Now lets consider the following code:

```cpp
int g();

int f() noexcept {
  return g();
}
```

Since the compilers have no idea if `g` would throw or not, they are forced to generate codes that invoke `std::terminate` in case bad things happened.
Here is the result codegen from various compilers:

msvc

```asm
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

```asm
f():
        sub     rsp, 8
        call    g()
        add     rsp, 8
        ret
```

clang

```asm
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

## How to deal with C functions?

Now we know that `noexcept` can cause overhead if we call a non-noexcept function inside, how do we deal with functions that will not throw but are not mark as `noexcept`? Fortunately, the venerable [Hana Dusíková](https://bsky.app/profile/hanicka.net) came up with a clever solution:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Did you ever get an suboptimal code, because you were calling external C function in your noexcept code?<br/><br/>Suffer no more: <a href="https://compiler-explorer.com/z/zyyAeW">https://compiler-explorer.com/z/zyyAeW</a></p>&mdash; Hana Dusíková 🍊 (@hankadusikova) June 27, 2020</blockquote>

You can mark the `noexcept_cast` function force inline by compiler-specific extensions so it will not decrease performance in debug mode.

## Conclusion

Don't spam `noexcept` if you don't have a project-wise "no exception" policy. And be especially careful with higher-order functions that may invoke user-defined functions. All in all, `noexcept` is a part of the type system and the contract of your API. Only add `noexcept` to function that you want to guarantee not to throw.
