---
id: rust-manually-drop
title: "Use ManuallyDrop in Rust to control drop order of structure fields"
lang: en
created: 2023-02-06
modified: 2023-02-06
tags:
  - code
  - rust
description: "This post explains Rust's ManuallyDrop construct, and how it helps control the order of destructor calls."
---

_First, for some context: I wrote this blog post more than a year ago but have yet to make it public since my mental health greatly degraded while I was still editing it. Now that I want to go back into blogging, I decide to release this post in its current form, though I lost interest in editing it._

As programmers, "clean-up" always feels like the boring part of our code. Fortunately, in Rust, we have destructors that help us to automatically write correct, ergonomic clean-up code. However, in the rare case where the order of destruction matters, compiler-generated destructor calls can be a hindrance.

In this post, I will show you how to use the Rust standard library `ManuallyDrop` type to explicitly control how and when structure fields get dropped.

## The problem

Rust drops fields in the declaration order[^1]. For example, considering the following structure:

[^1]: [Destructors - The Rust Reference](https://doc.rust-lang.org/reference/destructors.html): "The fields of a struct are dropped in declaration order."

```rust
struct Name {
    first: String,
    last: String,
}
```

In this case, `first` will be the first field to destroyed, followed by `last`.

This behavior, though unintuitive (especially if you come from a C++ background[^2]), is fine for most of the time, as we programmers often don't care about exactly order of things get freed. For example, in the above example, there are no dependencies between `first` and `last` fields, so destroying either of them first is fine.

[^2]: C++ calls destructor in [reverse declaration order](https://en.cppreference.com/w/cpp/language/destructor#Destruction_sequence) order

However, there are cases where destuction-order do matters. Unless we are ok to order fields in our struct in a gratuitous reverse order, it is probably not worth relying on the compiler-generated destruction order. Worse, in some instances, we may want to interleave user code execution and the fields being dropped inside the `drop` method, and the compiler's automatically generated destructor calls failed us here.

## A Vulkan example

I met the problem when doing some [Vulkan](https://www.vulkan.org/) exploration in Rust via the excellent [ash](https://docs.rs/ash/latest/ash/) crate. I use another crate, [gpu-allocator](https://crates.io/crates/gpu-allocator), to manage GPU memory.

The topic of this post is not about the Vulkan API. If you are not familiar with it, the only thing you need to know is that the time of destruction is very important in this API, and many entities in Vulkan have implicit dependencies. Before destroying anything in Vulkan, we need to ensure that the corresponding resource is not used on the GPU. Also, we can't destroy an object if any other objects depend on it.

It is common in Vulkan applications to have a `Renderer` structure like the following:

```rust
use gpu_allocator::vulkan::{Allocator};

pub struct Renderer {
    entry: ash::Entry,
    instance: ash::Instance,
    ...
    physical_device: vk::PhysicalDevice,
    device: vk::Device,
    ...
    allocator: Allocator,
    ...
}
```

Since the `allocator` depends on `instance` and `device`, those two must be destroyed after the `allocator`. On the other hand, certain other resources, such as buffers allocated by the `allocator`, need to be destroyed before the `allocator` gets destroyed.

The ash crate abandons using destructors and [RAII](https://en.wikipedia.org/wiki/Resource_acquisition_is_initialization) all thgether but instead relies on manual resource managements inside `unsafe` blocks. In ash, we are expected to write code like the following:

```rust
unsafe {
    instance.destroy_instance(None);
}
```

Even though non-idiomatic in Rust, ash's approach is fine with me. RAII combines with the Vulkan API pretty poorly for multiple reasons [^3]. However, [`gpu_allocator`](https://github.com/Traverse-Research/gpu-allocator), despite depending on the ash crate, decide to implement the `Drop` trait for its `Allocator`. And we are in a situation where we must call the destructor of the `allocator` in the middle of a chain of calls to `ash`'s clean-up functions.

[^3]: In Vulkan, we don't deleting an object until we are sure that the GPU is not using it. Deleting objects out-of-order is a big issue, and it may even crash your driver.

<span class="side-note" style="margin-top: -80px">

All examples that `gpu_allocator` provides write all code in the `main` function.

</span>

In C++, we just manually call the destructors when meeting such a situation, and everything will work fine. Can we do that in Rust? Here is a try:

```rust
impl Drop for Renderer {
    fn drop(&mut self) {
        // ...

        // ... All the allocation must be freed BEFORE the allocator get dropped
        self.allocator.free(allocation).unwrap();
        unsafe { self.device.destroy_buffer(self.buffer, None) };

        // We try to drop our allocator here
        self.allocator.drop();

        // device and instance must be destroyed AFTER the allocator
        unsafe {
            self.device.destroy_device(None);
            self.instance.destroy_instance(None);
        }
    }
}
```

However, Rust forbids explicit destructor calls, and the above program fails to compile. The Rust compiler then gives this "helpful" message:

> consider using `drop` function: `drop(self.allocator)`.

So let's try that:

```rust
impl Drop for Renderer {
    fn drop(&mut self) {
        // ...

        std::mem::drop(self.allocator);

        // ...
    }
}
```

Unfortunately, the above solution doesn't compile either, and it gives the "cannot move out of `self.allocator` which is behind a mutable reference" error. The reason is that the `drop` method takes `self` by reference, while `std::mem::drop` tries to borrow its field `self.allocator`. Even though we know that our renderer will get destroyed after the `drop` method, from the Rust type system's perspective, `std::mem::drop` is trying to "steal" one of its fields.

## Using `Option` to circumvent the drop order

If you are an experienced Rust programmer, you have probably already come up with an idiomatic way to our problem: making the `allocator` field into an `Option`.

```rust
pub struct Renderer {
    ...
    allocator: Option<Allocator>,
    ...
}
```

Then when we want to drop `self.allocator`, we can assign it to `None`.

```rust
impl Drop for Renderer {
    fn drop(&mut self) {
        ...
        self.allocator = None;
        ...
    }
}
```

Alternatively, we can combine a `std::mem::drop` with a `.take()` call: `std::mem::drop(self.allocator.take())`.

The `Option` solution works, and many people will probably be happy with it. However, I am dissatisfied for several reasons. Probably most importantly, the usage of `Option` pollutes all the `self.allocator` usage with extra `.unwrap()` ceremony.

The `Option` usage here also violates Rust's "zero-overhead abstration" principle, as we add runtime overhead purely to satisfy the type system. Though I consider this point less important since the performance overhead of using `Option` here is neglectable in the large picture on things.

## Introducing `ManuallyDrop`

[std::mem::ManuallyDrop](https://doc.rust-lang.org/stable/std/mem/struct.ManuallyDrop.html) is a type wrapper that inhibits the Rust compiler from automatically calling the underlying type's destructor.

Let's apply `ManuallyDrop` to our `allocator`:

```rust
pub struct Renderer {
    ...
    allocator: ManuallyDrop<Allocator>,
    ...
}
```

What makes `ManuallyDrop` a much more ergonomic choice than `Option` is its implementation of [`Deref`](https://doc.rust-lang.org/std/ops/trait.Deref.html), which makes it possible for us to use methods of `Allocator` directly. A bonus point is that, unlike `Option`, `ManuallyDrop` doesn't add any performance overhead.

When we are done, we can use `ManuallyDrop::drop` to drop our field. This function specifically takes a mutable reference, so we won't have the same problem we faced with the standard `drop` function before:

```rust
impl Drop for Renderer {
    fn drop(&mut self) {
        ...
        unsafe {
            ManuallyDrop::drop(&mut self.allocator);
        }
        ...
    }
}
```

Notice that `ManuallyDrop::drop` is an `unsafe` function since it makes `self.allocator` in a "zombie" state that shouldn't be touched. But since the whole `Renderer` structure will no longer exist after being dropped, it is not likely to pose any problem in practice.

## Drawback of `ManuallyDrop`

`ManuallyDrop` is perfect for the above use case, but it can cause some hassle when we can't automatically dereference it. This case will only happen on assignment, so if we need to assign a new value to a `ManuallyDrop` variable, we need to dereference it with `*` explicitly:

```rust
let mut x = ManuallyDrop::new(42);
*x = 55;
```

This slightly annoying syntax is only a minor issue, but it does break the illusion that `ManuallyDrop<T>` behaves exactly like the underlying type `T`. However, the annoyance can add up if we have a lot of fields of type `ManuallyDrop`, for example, when generating binding with C++ libraries. The good news is that there is a [proposal](https://github.com/rust-lang/lang-team/issues/135) that aims to provide a more ergonomic solution in the future.

## Conclusion

`ManuallyDrop` is a seldom necessary utility in normal Rust code. Nevertheless, it is currently the ideal solution when we want explicit control of how structure fields get dropped.
