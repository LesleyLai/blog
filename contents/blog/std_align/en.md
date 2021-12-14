---
id: std-align
title: "Little C++ Standard Library Utility: std::align"
lang: en
create: '2021-12-13'
lastModify: '2021-12-13'
categories:
- code
- cpp
---

Recently, I learned about `std::align`,
which is one of the lesser-known functions in the C++ standard library because of its limited use cases.
Since it is hard to describe without a specific use case,
I will use a simple implementation of an *arena allocator* as a motivational example.

<!-- end -->

## Arena allocator

Arena, also called *bump allocator* or *region-based allocator*, is probably the simplest allocation strategy.
It is so widely used that even the C++ standard library has an arena implementation called [std::pmr::monotonic_buffer_resource](https://en.cppreference.com/w/cpp/memory/monotonic_buffer_resource).

With arena, we first have a large chunk of pre-allocated memory.
That chunk of memory itself can either come from the stack or one large allocation of another allocator such as `malloc`.
Afterward, we allocate memory from that chunk by bumping a pointer offset.

<figure>
  <img style="width: 500px;" class="center-image" src="arena_1.svg" alt="Arena before allocation" />
  <figcaption style="text-align: center">Figure.1 - Arena before allocation</figcaption>
</figure>

<figure>
  <img style="width: 500px;" class="center-image" src="arena_2.svg" alt="Arena after allocation" />
  <figcaption style="text-align: center">Figure.2 - Arena after allocation</figcaption>
</figure>

Arena allocation has outstanding performance characteristics, especially compared to complicated beasts like `malloc`.
Each allocation only needs to bump a pointer, and the deallocation is almost free if the objects allocated are trivially destructible.
If we need to call destructors, the situation gets much more complicated since we need to maintain a list of objects to destroy, but that is out-of-scope of this post.

The downside of the arena is that you can only free all the allocated memory at once since the arena doesn't track each individual allocation.
Nevertheless, it is useful in situations where we have a lot of heterogeneous allocations that only need to be freed together,
and is widely used in application domains from compilers to video games.

<aside style="margin-top: -120px">

There are some confusions between an arena allocator and a *stack allocator*.
Stack allocator is a natural evolution of the arena allocator,
where allocation in a stack allocator can be freed in a LIFO (last in, first out) order.

</aside>

## A minimum implementation of an arena

A straightforward implementation of the arena looks like the following:

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

We can also store an end pointer instead of `size_remain` and compare `ptr + size` to the end pointer,
though that won't change the overall picture too many.

We miss some useful features for this arena implementation.
For example, we can't reset the arena and reuse the memory inside.
But for this post,
I will ignore all those extensions we can do to our arena.

To use our arena, we first construct the arena from a pre-allocated buffer. Then we can allocate raw memory from the arena and create objects on top of the allocated memory:

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

The placement new here are no-op since our types are integers,
but they are required to start the object lifetime.
Without placement new, if we do assignments like `*ptr = 42` directly,
it is technically undefined behavior in C++.

## Alignment

Unfortunately, the simple solution above is wrong since we haven't considered *alignment*.
As a result, the pointer returned by `alloc` may not be appropriately aligned for the object we want to create at that memory location.

In C++, every type and object has an alignment,
which can be manually controlled by `alignas` and queried by `alignof`.

Starting the lifetime of objects on unaligned locations is undefined behavior.
If you try to access the said object, depending on different architectures,
you may get either slow memory access or even a mysterious crash.

We usually don't care about alignment too much since the compiler can figure it out for us,
and standard library functions such as `malloc` automatically do the right thing.
However, when we start to play with custom memory allocation strategies, alignment suddenly becomes essential to understand.

Consider what our previous usage of the arena does. Initially, our arena is empty.
Then we allocate a byte of memory and construct a `std::uint8_t` on it, and everything is still well so far.
However, when we allocate 4 bytes now, we will allocate it at the place off by one byte of the 4-bytes alignment boundary:


<figure>
  <img style="width: 500px;" class="center-image" src="arena_3.svg" alt="Arena after allocating one uint8_t and one uint32_t" />
  <figcaption style="text-align: center">Figure.3 - Arena after two allocations</figcaption>
</figure>


## Arena, fixed

To implement an `Arena` that considers alignment,
we first need to have this helper function `align_forward` that bump a given pointer forward to an aligned address given a specific alignment:

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
<a href="https://en.cppreference.com/w/cpp/numeric/bit_cast"><code>std::bit_cast</code></a> is a C++20 feature. Before C++20, you need <code>reinterpret_cast</code>.
</aside>

We first cast our pointer into an integer and then round up our (integer) address to the alignment boundary with that expression `(addr + (alignment - 1)) & -alignment`.

To understand what this expression is doing exactly, you need to think about the meaning of the `-` on integers in a bit-wise setting: it flips all the bits and then adds one to the result. For example, let's say our `alignment` is `4`, it is represented as 

`0b00000100`,

and when we apply negation, we get `-4`, which is represented as 

`0b11111100`. 

I omit all the leading bytes, but you should be able to see the pattern:
the negation of an alignment is precisely the bit-mask we want to mask out the lower bits.

Finally, we just need to cast our `aligned_addr` back into a pointer. I choose to do some pointer arithmetics instead of doing another bit cast (`std::bit_cast<std::byte*>(aligned_addr)`).

With the helper function in place, we can now implement our `Arena`:

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

Notice that I changed the function name from `alloc` to `aligned_alloc` since we must explicitly pass an `alignment` argument to this function. We call `align_forward` to adjust our pointer to the alignment boundary in the function. And then, we calculate how many bytes we need for the allocation (which is the number of bytes used for alignment plus the actual size we need to allocate). And finally, if we have enough size to allocate, we need to bump our pointer, decrease the remaining size, and return the adjusted pointer.

With this implementation, we can explicitly pass alignment to our arena:

```cpp
auto* ptr = static_cast<std::uint8_t*>(
  arena.aligned_alloc(alignof(std::uint8_t), sizeof(std::uint8_t)));
ptr = new(ptr) std::uint8_t{42};
  
auto* ptr2 = static_cast<std::uint32_t*>(
  arena.aligned_alloc(alignof(std::uint32_t), sizeof(std::uint32_t)));
ptr2 = new(ptr2) std::uint32_t{1729};
```

You can see that our client-side code becomes a bit more nuisance to write.
but in practice, we can hide calls to `aligned_alloc` behind a templated function.
The important thing is that our allocations will be properly aligned:

<figure>
  <img style="width: 500px;" class="center-image" src="arena_4.svg" alt="Alignment-aware arena after allocating one uint8_t and one uint32_t" />
  <figcaption style="text-align: center">Figure.4 - Alignment-aware arena after two allocations</figcaption>
</figure>

If you still want the old `alloc` member function that doesn't consider alignment,
we can write it as a wrapper of `aligned_alloc` that takes the alignment of `std::max_align_t`:

```cpp
[[nodiscard]]
auto alloc(std::size_t size) noexcept -> void*
{
  return aligned_alloc(alignof(std::max_align_t), size);
}
```

This version of `alloc` always returns pointers aligned as strictly as `std::max_align_t`,
similar to `std::malloc`.
This way also guarantees to have a correct alignment for each allocation,
though it can waste space if we have a lot of allocations for small objects.

The above implementation of the arena is reliable.
In fact, I use an essentially identical version of the arena in a bunch of C projects.
However, with a little bit of help from the standard library, we can do better in C++.

## Enter `std::align`

`std::align` is a standard function with the following interface:

```cpp
namespace std {
  auto align(std::size_t alignment,
           std::size_t size,
           void*& ptr,
           std::size_t& space)
  -> void*;
}
```

It does the following:
> Given a pointer `ptr` to a buffer of size `space`, returns a pointer aligned by the specified `alignment` for `size` number of bytes and decreases `space` argument by the number of bytes used for alignment. The first aligned address is returned. — [cppreference](https://en.cppreference.com/w/cpp/memory/align).

The interface of `std::align` is certainly not easy to grasp,
mainly because it has two in-out parameters passed by reference.
But it serves a similar purpose as our `align_forward` function.
The first two parameters, `alignment` and `size`, are the same parameters we passed to the arena allocator.
And `ptr` and `space` is the state of our arena.

`std::align` first check whether we have enough `space` to allocate `size` bytes after the alignment adjestment.
If so, it adjusts our pointer `ptr` and decreases `space` by the number of bytes used for alignment and returns the aligned pointer.

with `std::align`, our code can be greatly simplified:

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

We no longer need our helper function, `align_forward`, since `std::align` serves a similar purpose.
It is nice that we don't need to write pointer-to-integer casting and bit manipulation ourselves.
And our `aligned_alloc` function also looks almost as simple as the our initial `alloc` function that doesn't take alignment into consideration.

Notice that since `std::align` only increases `ptr` to alignment boundary and decreases `size_remain` by the number of bytes used for alignment, we still need to change those two variables with the actual `size` of the allocation.

Another small change is that `std::align` requires us to use `void*` while our previous implementation uses `std::byte*`.
Since we don't need to do pointer arithmetics ourselves anymore, it is fine to use `void*`, which is also the type our `aligned_alloc` needs to return anyway.

## Conclusion

I am not sure how many use cases `std::align` has outside of custom allocators.
Maybe it is also helpful to implement [flexible array members](https://en.wikipedia.org/wiki/Flexible_array_member)-like structures.
Nevertheless, I am glad we have this little utility in the C++ standard library.
