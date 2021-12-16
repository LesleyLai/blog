---
id: std-align
title: "C++标准库的小工具： std::align"
lang: zh
create: '2021-12-15'
lastModify: '2021-12-15'
categories:
- code
- cpp
---

今天我想来讲述一下C++标准库中的 `std::align`函数。
因其用途有限，它可能是C++标准库中最鲜为人知的函数之一。
在下文中，我将用*arena allocator*来作为使用 `std::align` 的例子。

<!-- end -->

## Arena allocator

Arena allocator 可能是最简单的自定义内存管理策略。在一些文献中 arena allocator 也被叫为 bump allocator 或者 region-based allocator。
尽管它简单，arena allocator 是一种经常被使用的内存管理策略，以至于C++标准库中都有一个 arena allocator 的实现，虽然标准库叫它[std::pmr::monotonic_buffer_resource](https://zh.cppreference.com/w/cpp/memory/monotonic_buffer_resource)。

Arena allocator 的原理是我们先预分配一块很大的内存。
这一块内存既可以来自栈中，也可以是在堆中被 `malloc` 一次性分配。
之后当我们每次需要内存时，我们都从这块内存中分配一小块内存，而每次分配时我们所需要做的工作仅仅是增加一个指针的值。

<figure>
  <img style="width: 500px;" class="center-image" src="arena_1.svg" alt="Arena before allocation" />
  <figcaption style="text-align: center">图1 - 分配内存前的 Arena</figcaption>
</figure>

<figure>
  <img style="width: 500px;" class="center-image" src="arena_2.svg" alt="Arena after allocation" />
  <figcaption style="text-align: center">图2 - 分配内存后的 Arena</figcaption>
</figure>

Arena allocator 的速度非常快，尤其是和 `malloc` 这种原理复杂的函数相比较。
每次分配内存时我们只需要修改一个指针的值，而如果我们只分配可被平凡析构（trivially destructible）的对象，那么释放内存几乎是免费的。
如果我们释放内存时需要调用析构函数，情况会变得更加复杂，因为我们需要维护一个要销毁的对象列表，但我不会在本文中对此进行阐述。

Arena allocator 的缺点在于所有的内存只能被一齐释放，因为 arena allocator 不会记录每块单独的内存分配。
尽管如此，当我们有许多不同的对象需要分配时 arena allocator 仍然非常有用，
它在从编译器到游戏引擎的不同领域都有广泛应用。

## 一个arena allocator的精简实现

一下是一个对 arena allocator 的最简单的实现：

```cpp
struct Arena {
  std::byte* ptr = 0;
  std::size_t size_remain = 0;

  [[nodiscard]] auto alloc(std::size_t size) noexcept -> void*
  {
    if (size_remain < size) return nullptr;
    
    auto* alloc_ptr = ptr;
    ptr += size;
    size_remain -= size;
    return alloc_ptr;
  }
};
```

我们也可以存储一个结束指针而不是 `size_remain` 并将 `ptr + size` 与结束指针进行比较，
不过这样做并不会和我现在的做法有什么特别的差异。

这个arena allocator的实现省略了arena allocator中大量非常实用的功能。
例如，我们不能重置我们的arena allocator并重用里面的内存。
但是在本文中我不会对这些功能进行进一步的展开讨论。

为了使用我们的 arena allocator ，我们首先从一个预先分配的缓冲区构建我们的 arena allocator 。 然后我们可以从 arena allocator 中分配内存并在分配的内存之上创建对象：

```cpp
std::byte buffer[1000];
Arena arena {
  .ptr = buffer, 
  .size_remain = std::size(buffer)
};

auto* ptr = static_cast<std::uint8_t*>(arena.alloc(sizeof(std::uint8_t)));
ptr = new(ptr) std::uint8_t{42};
  
auto* ptr2 = static_cast<std::uint32_t*>(arena.alloc(sizeof(std::uint32_t)));
ptr2 = new(ptr2) std::uint32_t{1729};
```

因为我们的类型是整数，所以这里的位置[布置 new（placement new）](https://zh.cppreference.com/w/cpp/language/new#.E5.B8.83.E7.BD.AE_new)并不会进行任何实质上的操作，
但C++标准要求它们来启动一个对象的生存期（lifetime）。
如果我们没有布置 new 而直接做 `*ptr = 42` 之类的赋值，那么我们在理论上进行了未定义行为（undefined behavior）。

## 对齐（Alignment）

不幸的是，如上所示的 arena allocator 的实现是有问题的，因为我们现在的 `alloc` 所返回的指针并不一定符合我们所想要创建的对象的对齐要求。

在C++中，所有的类型以及对象都有对齐要求。
我们可以通过关键字 `alignas` 来手工设置一个对象的对齐要求，或者用关键字 `alignof` 来得到一个类型的对齐要求。

如果在一个未对齐的地址上启动一个对象的生存期，那么我们就碰到了未定义行为。
如果我们这么做的话，根据处理器构架的不同，也许我们会有非常慢得内存访问，或者甚至我们的程序可能会直接崩溃。

一般情况下我们C++程序员并不太关心对齐的问题，因为编译器自动会帮我们解决这些这些问题，同时类似于 `malloc` 的标准库函数也会自己妥善处理对齐问题。
但是当我们需要自定义内存管理策略时，对齐就突然间变得非常地重要了。

让我们来考虑一下之前的 arena allocator。
一开始我们的 arena allocator 是空的。
然后我们分配1个字节的内存并在其上构造一个 `std::uint8_t`，到目前为止一切都顺利。
但是接着我们再分配了4个字节，然后构造了 `std::uint32_t`。
`std::uint32_t` 需要4个字节的对齐要求，但是我们分配这4个字节的位置正好离对齐点有1个字节的错位：


<figure>
  <img style="width: 500px;" class="center-image" src="arena_3.svg" alt="Arena after allocating one uint8_t and one uint32_t" />
  <figcaption style="text-align: center">图3 - Arena在</figcaption>
</figure>


## 改进的Arena allocator

在写把对齐要求也放进考虑的 arena allocator 之前，
我们先写一个辅助函数 `align_forward`。
它可以将给定的指针 `ptr` 向前移动到一个满足特定对齐要求 `alignment` 的地址：

```cpp
[[nodiscard]] inline auto align_forward(std::byte* ptr, std::size_t alignment) noexcept
  -> std::byte*
{
  const auto addr = std::bit_cast<uintptr_t>(ptr);
  const auto aligned_addr = (addr + (alignment - 1)) & -alignment;
  return ptr + (aligned_addr - addr);
}
```

<aside style="margin-top: -110px">
<a href="https://en.cppreference.com/w/cpp/numeric/bit_cast"><code>std::bit_cast</code></a>是一个C++20的特性。在C++20之前，在这里需要使用<code>reinterpret_cast</code>.
</aside>

我们首先将我们的指针转换为一个整数，然后使用表达式 `(addr + (alignment - 1)) & -alignment` 将我们的地址四舍五入到对齐边界。

如果要理解这个表达式的含义，我们需要首先考虑负号`-`会对二进制整数的操作：它会把所有的位（bit）都倒过来，然后在结果上再加上1。

例如，假设我们的 `alignment` 是 `4`，它在二进制中被表示为

`0b00000100`,

当我们加上负号时我们会获得`-4`，它在补码（two's complement）中会把表示为

`0b11111100`. 

我省略了更高位的字节，但是你应该可以看出规律：
`-alignment`正好是可以用于剔除未对齐地址的低位的位掩码（bit-mask）。

在最后我们需要把对齐的地址`aligned_addr`从整数变回指针。
我选择使用指针算术（pointer arithmetics）而非再使用转型运算符（`std::bit_cast<std::byte*>(aligned_addr)`）。

有了这个函数，我们可以用它来帮助我们实现arena allocator：

```cpp
struct Arena {
  std::byte* ptr = 0;
  std::size_t size_remain = 0;

  [[nodiscard]]
  auto aligned_alloc(std::size_t alignment, std::size_t size) noexcept -> void*
  {
    std::byte* aligned_ptr = align_forward(ptr, alignment);
    const size_t size_for_alignment = aligned_ptr - ptr;
    const size_t bump_size = size_for_alignment + size;
    if (size_remain < bump_size) return nullptr;

    ptr = aligned_ptr + size;
    size_remain -= bump_size;
    return aligned_ptr;
  }
};
```

请注意，我将函数名称从 `alloc` 更改为 `aligned_alloc`，
因为我们必须显式地将对齐要求 `alignment` 参数传递给该函数。
我们调用 `align_forward` 来使得我们的指针 `ptr` 能够正确对齐。 
然后，我们计算一共需要多少字节（即用于对齐的字节数加上我们实际需要分配的大小 `size`）。
最后，如果我们有足够的空间来分配内存，我们即增加我们的指针`ptr`到分配后的位置，减少 arena allocator 中剩余的大小，并返回对齐后的指针。

当使用  `aligned_alloc` 时，我们需要传递对齐方式：

```cpp
auto* ptr = static_cast<std::uint8_t*>(
  arena.aligned_alloc(alignof(std::uint8_t), sizeof(std::uint8_t)));
ptr = new(ptr) std::uint8_t{42};
  
auto* ptr2 = static_cast<std::uint32_t*>(
  arena.aligned_alloc(alignof(std::uint32_t), sizeof(std::uint32_t)));
ptr2 = new(ptr2) std::uint32_t{1729};
```

你可以看到arena allocator使用起来略有些麻烦。
但在实际应用中，我们可以用模板函数来封装对 `aligned_alloc` 的调用。
重要的是，我们分配的内存将正确对齐：

<figure>
  <img style="width: 500px;" class="center-image" src="arena_4.svg" alt="Alignment-aware arena after allocating one uint8_t and one uint32_t" />
  <figcaption style="text-align: center">图4 - 考虑对齐的Arena在分配两块内存</figcaption>
</figure>

如果你仍然想要之前不需要显式提供对齐要求的 `alloc` 成员函数，
我们可以在其中调用 `aligned_alloc`并把对齐要求设置为`std::max_align_t`（一个平台上所以类型最大可能的对齐要求）：

```cpp
[[nodiscard]]
auto alloc(std::size_t size) noexcept -> void*
{
  return aligned_alloc(alignof(std::max_align_t), size);
}
```

这个版本的 `alloc` 总是返回与 `std::max_align_t` 一样严格对齐的指针。`std::malloc`同样满足这一要求。
如果我们分配许多对齐要求小于`std::max_align_t`的小对象，这种分配方式会浪费内存，但是它至少保证了对所有分配内存对齐要求的满足。

## `std::align`

我在C语言项目中会使用和上示基本相同的arena allocator实现。
但是在C++中，通过标准库的帮助，我们还能做得更好。

`std::align`是一个在`<memory>`头文件中所定义的标准函数。它的接口如下：

```cpp
namespace std {
  auto align(std::size_t alignment,
           std::size_t size,
           void*& ptr,
           std::size_t& space)
  -> void*;
}
```

因为有两个址传递的参数的关系，光光看函数声明，`std::align` 不是那么得容易理解。
但是它事实上所起到的目的和我们之前的 `align_forward` 函数非常接近。
前面两个参数 `alignment` 以及 `size` 就是我们传给 `aligned_alloc` 的两个参数，
而 `ptr` 以及 `space` 是我们的arena allocator的内部状态。

`std::align` 首先检查我们是否有足够的空间（ `space` ）来分配对齐调整后的 `size` 字节。
如果是这样，它会调整我们的指针 `ptr` 并对 `space` 减去用于对齐的字节数，然后它会返回对齐后的指针。

利用 `std::align`，
我们的代码会得到极大地精简：

```cpp
struct Arena {
  void* ptr = 0;
  std::size_t size_remain = 0;
  
  [[nodiscard]]
  auto aligned_alloc(std::size_t alignment, std::size_t size) noexcept -> void*
  {
    void* res = std::align(alignment, size, ptr, size_remain);
    if (res) {
        ptr = static_cast<std::byte*>(res) + size;
        size_remain -= size;
        return res;
    }
    return nullptr;
  }
};
```

因为 `std::align` 以及提供了类似的功能，我们不需要我们自己的 `align_forward` 辅助函数了，
这样我们就不需要手写指针到整数的转换以及的难以理解的位操作了。
我们的 `aligned_alloc` 函数也变得几乎和我们一开始的 `alloc` 函数一样简单。

请注意，由于 `std::align` 仅将 `ptr` 增加到对齐边界，并将 `size_remain` 减少用于对齐的字节数，我们仍然需要根据实际分配内存的大小 `size` 来更改这两个变量。

我们的代码还有另一个小的变化：`std::align` 要求我们使用 `void*`，而我们之前的代码使用的是 `std::byte*`。
由于我们不再需要自己进行指针算数，因此使用 `void*` 也不会有任何影响，而且`void*` 也正好是 `aligned_alloc` 需要返回的类型。

## 结论

我不确定在自定义内存管理策略之外，`std::align` 还有多大的应用。
也许它还可以被用来模拟类似于[灵活数组类型](https://zh.wikipedia.org/wiki/%E7%81%B5%E6%B4%BB%E6%95%B0%E7%BB%84%E7%B1%BB%E5%9E%8B)的功能。
但是不管怎么说，我很感谢C++标准库提供了这个小小的工具函数。
