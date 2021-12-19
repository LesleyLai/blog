---
id: make-impossible-state-unrepresentable
title: "Make Impossible State Unrepresentable, in C++（暂未翻译）"
lang: zh
create: '2019-10-26'
lastModify: '2019-10-26'
categories:
- code
- cpp
- dod
- functional
---

At [CppCon](https://cppcon.org/) 2019, I gave a lightning talk at called [*Make Impossible State Unrepresentable*](https://youtu.be/hYyRrYwfy3k). Due to the nature of a 5 minutes lightning talk, it was handwavy, and I cut a lot of prepared contents to fit the time. This post is a deeper dive into the topic with more detailed explanations and examples.

The same practice in typed-functional programming communities inspires this topic. However, I do not consider this theme too "functional," and it can certainly be applied to C++ or any other programming languages with a type system. The topic also has a strong relationship with "[strong typing](https://en.wikipedia.org/wiki/Strong_and_weak_typing)."

## The motivation

Consider the following code snippet that I copied from a [tutorial website](https://vulkan-tutorial.com/) for the [Vulkan Graphics API](https://www.khronos.org/vulkan/). Apparently, many people directly copy this tutorial to their codebase.

In the snippet, we have a struct of indices for different queues, and we first query the indices and use them to refer to those queues later.

```cpp
struct QueueFamilyIndices {
    std::optional<uint32_t> graphics;
    std::optional<uint32_t> present;

    bool isComplete() const {
        return graphics.has_value()
        && present.has_value();
    }
};

QueueFamilyIndices findQueueFamilies(/*...*/) {
  // ...
  QueueFamilyIndices indices;
  for (const auto& queue: queues) {
    if (/* queue i support graphics */) {
        indices.graphics = i;
    }

    if (/* queue i support present */) {
        indices.present = i;
    }

    if (indices.isComplete()) {
        break;
    }
  }
  return indices;
}
```

In this particular case, the function `findQueueFamilies` is the only place where we can have uninitialized queue indices, so why no get rid of all the `optional`s in the struct:

```cpp
struct QueueFamilyIndices {
    uint32_t graphics;
    uint32_t present;
};

std::optional<QueueFamilyIndices> findQueueFamilies(/*...*/) {
  // ...
  std::optional<uint32_t> graphicsFamily = std::nullopt;
  std::optional<uint32_t> presentFamily = std::nullopt;

  for (const auto& queue: queues) {
    if (/* queue i support graphics */) {
        graphicsFamily = i;
    }

    if (/* queue i support present */) {
        presentFamily = i;
    }

    if (graphicsFamily && presentFamily) {
        return QueueFamilyIndices{*graphicsFamily, *presentFamily};
    }
  }

  return std::nullopt;
}
```

The memory footprint of `QueueFamilyIndices` gets reduced from 16 bytes to 8 bytes. The reason is partly that we no longer store unnecessary information, and partly because of the inefficient alignments of multiple `std::optional` from the first `struct`.

<aside style="margin-top: -70px">

```cpp
struct A {
  optional<uint32_t> i;
  optional<uint32_t> j;
};

struct B {
  bool has_i;
  bool has_j;
  uint32_t i;
  uint32_t j;
};
```

In the above snippet, the `sizeof(A)` is 16 bytes while the `sizeof(B)` is only 12 bytes.
</aside>

We also reduced the need for assertions or runtime checking. Notice the `isComplete` function goes away for the second case, as we don't need to call this logic multiple times. In the first case, we would no be that confident, since we can have a bug that left `QueueFamilyIndices` uninitialized.

## Algebraic Data Types
The above example demonstrates the usage of algebraic sum types (`optional` or `variant`), albeit in an inefficient way at first. Those types belong to the new addition of the "vocabulary types" in C++17, though they have a long history in other programming languages and third-party C++ libraries. The name "sum type" comes from the [cardinality](https://en.wikipedia.org/wiki/Cardinality) of the set of the possible state of those types. Similarly, the more familiar `struct` or tuple are called "product type" because their cardinality is the product of the cardinality of all of their fields. Sum types are sometimes also called "tagged union" or "variant type".

Algebraic sum type has an advantage on [building state machines](https://www.bfilipek.com/2019/06/fsm-variant-game.html). A textbook example of such use case is network connection:

```cpp
struct Connection {
  struct Closed {};
  struct Connecting {
      IP ip;
  };
  struct Connected {
      IP ip;
      Id id;
  };

  std::variant<Closed, Connecting, Connected> state;
};
```

This implementation faithfully represents the data used by each state. For example, it doesn't make sense to store an IP address for `Connection` is it is `Closed`.

### Inheritance Hierarchy vs. Sum Type

Both sum types and inheritance are used for *runtime polymorphism*. In other words, only use them when you need runtime polymorphism. Sum types add one major constraint over inheritance. Virtual inheritance is [open to extension](https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle), while sum types are closed. The constraint is not necessarily a bad thing. For example, because as the compiler knows maximum size information statically, it can put the whole `variant` object on the stack.

<aside style="margin-top: -100px">

When I talk about "inheritance hierarchy" here, the only focus is the virtual-dispatch enabled inheritance. Notably, I do not include [CRTP](https://en.wikipedia.org/wiki/Curiously_recurring_template_pattern) or other usages of inheritances without any virtual functions that aim to reuse code instead of enabling subtyping polymorphism.

</aside>

In theory, dispatch over `variant` can be faster than the virtual dispatch, though none of the current implementations of `std::visit` are faster than virtual. However, in a potential future C++ version with language variant and pattern matching, there is evidence [^1] that variant would provide an advantage.

[^1]:
  [Mach7: Pattern Matching for C++](https://github.com/solodon4/Mach7)

However, the "open to extension" property of inheritance does prove useful from time to time. For example, consider that you are working on a compiler, you may represent your expression in a traditional OO-way like this:
```cpp
struct Expr { ... };

struct ConstExpr : Expr { ... };
struct LambdaExpr : Expr { ... };
struct ApplyExpr : Expr { ... };
```

Adding compilation errors is as simple as adding derived classes like `SyntaxErrorExpr` and `TypeErrorExpr` into the corresponding stages, and those errors are completely hidden between stages. By contrast, with sum type, one option is to create a mess like:
```cpp
using Expr = std::variant<ConstExpr, LambdaExpr, ApplyExpr,
                          SyntaxErrorExpr, TypeErrorExpr>;
```
This approach forces us to handle `TypeErrorExpr` in the *parser*. Another option is to pay extra overhead and to wrap every `Expr` into an [expected](http://www7.open-std.org/JTC1/SC22/WG21/docs/papers/2018/p0323r7.html). Both alternatives are less than ideal, and the problem becomes even bigger if the abstract syntax tree becomes more complex and contains a hierarchy.

Another type of polymorphism is [row polymorphism](https://en.wikipedia.org/wiki/Polymorphism_(computer_science)#Row_polymorphism). Row polymorphism only considers features and structures of a type. Like inheritance, row polymorphism is also open to extension, so it shares many advantages as inheritance. Row polymorphism is arguably a better alternative to virtual inheritance [^2][^3][^4][^5][^6]. Though row polymorphism is exactly what C++ [concept](https://en.cppreference.com/w/cpp/language/constraints) achieves, C++ lacks support build-in support of it for runtime polymorphism. [Go](https://gobyexample.com/interfaces) and [Typescript](https://www.typescriptlang.org/docs/handbook/interfaces.html) interfaces and [Rust trait](https://doc.rust-lang.org/rust-by-example/trait.html) are examples of such language features. In C++, runtime row polymorphism can be implemented by doing [type-erasure](https://quuxplusone.github.io/blog/2019/03/18/what-is-type-erasure/) manually.

[^2]:
  [Better Code: Runtime Polymorphism - Sean Parent](https://www.youtube.com/watch?v=QGcVXgEVMJg&feature=youtu.be)
[^3]:
  [Simon Brand: "How Rust gets polymorphism right"](https://www.youtube.com/watch?v=VSlBhAOLtFA)
[^4]:
  [CppCon 2017: Louis Dionne “Runtime Polymorphism: Back to the Basics”](https://www.youtube.com/watch?v=gVGtNFg4ay0)
[^5]:
  [Mathieu Ropert: Polymorphic ducks](https://mropert.github.io/2017/11/30/polymorphic_ducks/)
[^6]:
  [CppCon 2018: Borislav Stanimirov “DynaMix: A New Take on Polymorphism”](https://www.youtube.com/watch?v=ckY7Pc-A9Xc)


## Data Modeling
All of the above discussions lead to [data modeling](https://en.wikipedia.org/wiki/Data_modeling) -- defining and analyzing data requirements and define data models accordingly.  Both [data-oriented design](https://en.wikipedia.org/wiki/Data-oriented_design) and functional programming people like to talk about Data modeling.

From the point of view of an object-oriented developer, data modeling is similar to class design. Classes often work as self-contained entities that know how to do operations on themselves. However, such an approach requires packing all "logical related" data into one structure, and it often does not make sense. For example, below is how [pbrt-v3](https://github.com/mmp/pbrt-v3) implements triangles:

```cpp
struct TriangleMesh
{
  std::vector<int> vertexIndices;
  std::unique_ptr<Point3f[]> p;
  // other data
};

class Triangle
{
public:
  // Triangle operations

private:
  std::shared_ptr<TriangleMesh> mesh; // back pointer
  const int *v; // A pointer to vertex indices
};
```

Each `Triangle` need to store a back pointer to operate on itself. Moreover, there is no guarantee that the pointer `v` is not dangled. In this particular example, programmers make sure that `v` always points to memory managed by `TriangleMesh`.

<aside style="margin-top: -160px">

Aside from valid use cases on shared ownership, `std::shared_ptr` is often misused to represent "vague ownership."

</aside>

If we abandon the idea that triangles must know how to operates on themselves, then the triangles become just indices to the vertices:

```cpp
struct Triangle {
  std::uint32_t first;
  std::uint32_t second;
  std::uint32_t third;
};

struct TriangleMesh
{
  // Triangle operations

  std::vector<Triangle> triangles;
  std::unique_ptr<Point3f[]> p;
  // other data
};
```

Since we no longer need to worry about the dangling of indices, we don't need reference counting anymore.

## Transform the API

Sometimes following the guideline of better data modeling means changing the APIs. Such a change would make the API easier to use and harder to misuse, so it is better to start early than later.

Below is another example from graphics programming where we have commands to submit to GPU. We don't directly push the data to GPU, but instead, cache them in a `CommandBuffer` object that we can batch submit later.

```cpp
struct CommandBuffer {
  CommandBuffer& push_draw_command(uint32_t count, uint32_t vertex_offset,
                                   uint32_t instance_count);
  CommandBuffer& push_draw_indirect_command(void* indirect);
  CommandBuffer& push_bind_graphics_pipeline_command(GraphicsPipelineHandle pipeline);

  // ...
};
```

This graphics API directly maps to lower-level APIs like Vulkan and DirectX12 nicely and is very flexible. There is one huge drawback, nevertheless. The graphics pipeline object encapsulates all the logic of drawing, like how to interpret data we sent to the GPU. However, in the current API, you can freely start to draw objects without bind to a graphics pipeline:

```cpp
CommandBuffer buffer;
buffer.push_draw_command(count, 0, 1);
queue.submit(buffer);
```

One naive forward modification is putting the reference of the graphics pipeline inside each command. Nonetheless, we are paying an extra overhead here as the need to check if the graphics pipeline stays the same. If it is, we don't need to rebind the pipeline again, since rebinding a graphics pipeline can be a costly operation in GPU. Another optimization for this model is to add sorting against the graphics pipeline on top of each command. Such optimization, however, also introduces additional overhead.

```cpp
struct CommandBuffer {
  CommandBuffer& push_draw_command(GraphicsPipelineHandle pipeline, uint32_t count,
                                   uint32_t vertex_offset, uint32_t instance_count);
  CommandBuffer& push_draw_indirect_command(GraphicsPipelineHandle pipeline,
                                            void* indirect);

  // ...
};
```

A better fix is to introduce another structure, `DrawingCommandbuffer`, that contains a graphics pipeline and draw commands. In this model, there is no need for checking or sorting, and we can quickly build `DrawingCommandbuffer` in parallel.

```cpp
struct DrawingCommandbuffer {
  DrawingCommandbuffer(GraphicsPipelineHandle pipeline);

  DrawingCommandbuffer& push_draw_command(uint32_t count, uint32_t vertex_offset,
                                   uint32_t instance_count);
  DrawingCommandbuffer& push_draw_indirect_command(void* indirect);
};

struct CommandBuffer {
  void push_drawing_commands(DrawingCommandBuffer buffer);
};
```

Note that we can implement `DrawingCommandbuffer` in terms of Secondary Command Buffers of Vulkan, but there are no restrictions on how it must be implemented. Thus, implementations of different lower-level graphics APIs can use completely different approaches.


## Limitations
Not all invariant can be checked at compile-time, and that is why many programming languages support [contract](https://en.wikipedia.org/wiki/Design_by_contract) or at least runtime assertion. However, even counting all the "compile-time known state," there are limitations of applying "make impossible state unrepresentable" in C++. Some of them are due to the design of the C++ type system, and others are due to the performance requirements for C++ applications faces.

### The curious case of Move semantics

I love C++11 move semantics. However, despite move semantics solving a lot of problems, it opens a hole in the C++ type system. Consider a class that wraps resource with underlying C-style API. In the C++98 area, we achieved the perfect RAII since the resource' lifetime is tied with the lifetime of the object.

```cpp
class Window {
  // ...

private:
  // Would never be nullptr
  GLFWwindow* window;

  Window(const Window& other);
  Window& operator=(const Window& other);
}
```

We introduced move semantics to make it movable. However, to enable move semantics for our resource handle, we created a pointer-like object. The reason is that the after move states must be valid; to have a valid after-move state, we are forced to represent the empty state in our class. That is why we have `unique_ptr` but no `unique_reference` in the C++ standard library. And it is also partly why people repeatedly propose *[destructive move](http://www.open-std.org/JTC1/SC22/WG21/docs/papers/2014/n4034.pdf)*.

<aside style="margin-top: -30px">

Another reason for *destructive move* is performance. The performance improvements of move can be accomplished by [Arthur O'Dwyer](https://quuxplusone.github.io/blog/) 's great but less ambitious *trivially relocatable* \[[P1144](https://rawgit.com/Quuxplusone/draft/gh-pages/d1144-object-relocation.html)\] proposal.

</aside>

```cpp
class Window {
  // ...

  Window(Window&& other) noexcept : window{other.window} {
    other.window = nullptr;
  }

private:
  GLFWwindow* window;
}
```

# Conclusion

Utilizing the static type system well, we can eradicate the possibility of runtime invariant violations in a group of cases. This approach decreases the possibility of insane debugging sessions and the need for aggressive assertions. It also helps testing because we don't have to test what a static type system guaranteed. Moreover, we can see a performance gain sometimes by thinking about how to model data more carefully.
