---
title: "Recursive Modules in OCaml"
created: 2020-10-15
modified: 2020-10-15
tags:
  - code
  - ocaml
---

Recursive module is an interesting feature in OCaml.
To use it, we need to use the form

```ocaml
module rec module-name : module-signature = module-expr
```

Explicit signature is required when using recursive modules,
as the compiler can no longer deduce the module signature with recursion.

A typical recursive module looks like the following:

```ocaml
module rec M : sig
  (* explicit signature *)
end = struct
  (* Implementations *)
end
```

And we can even have mutually recursive modules, for example:

```ocaml
module rec A : sig ...end = struct ... end
and B : sig ... end = struct ... end
```

My primary use case of recursive modules is to combine with first-class modules.
First-class modules are ordinary values that wrap a module.
It is a powerful way to introduce dynamic polymorphism in OCaml.

Dynamic polymorphism is usually combined with recursive data types,
but Ocaml modules are not recursive by default.
Thus, recursive modules serve as valuable additions.

For example,
I use first-class modules and recursive modules in my [ocamlpt](https://github.com/LesleyLai/ocamlpt) project.
Ocamlpt is a path tracer,
where its scene contains different kinds of shapes.
The signature of a shape is the following:

```ocaml
module type Shape = sig
  type t
  val hit: Ray.t -> t -> Material.hit_record option
  val bounding_box: t -> Aabb.t
end
```

We want to make the shape polymorphic, so we need to use first-class modules.
In the below code, I introduce a `Shape_instance` modules that wrap both the shape module and the value of that module,
and I also add a `build_shape` function that builds first-class modules of the signature of `Shape_instance`.
This way, we can store those first-class modules, and Whenever we want to use them, we can unwrap the first-class modules to get a concrete `Shape_instance` module.

```ocaml
module type Shape_instance = sig
  module S: Shape
  val this: S.t
end

let build_shape
    (type a)
    (module S : Shape with type t = a)
    (shape: a)
  =
  (module struct
    module S = S
    let this = shape
  end : Shape_instance
  )
```

The above code is good enough to deal with concrete shapes such as spheres or triangles.
However, the shapes are organized in a tree structure called
[bounding volume hierarchy (BVH)](https://en.wikipedia.org/wiki/Bounding_volume_hierarchy).
And each BVH node can contain other shapes, including BVH nodes themselves.

We can implement the BVH node with recursive modules:

```ocaml
module rec Bvh_node : sig
  include Shape
  val create: (module Shape_instance) list -> t
end = struct

type t = {
  left: (module Shape_instance);
  right: (module Shape_instance);
  aabb: Aabb.t;
}

(* Other members of the Bvh_node module *)

(* Creating bvh code from a list of objects *)
let rec create (shapes: (module Shape_instance) list) =
  ...
  (* if shapes contain 3 elements *)
  let left = ...
  and right = ... in
  let aabb = Aabb.union left.aabb right.aabb in
  { left=(build_shape (module Bvh_node) left);
    right=(build_shape (module Bvh_node) right);
    aabb }

end
```

The above code works like magic,
but the code would not compile without the `rec` keyword before `Bvh_node`,
since the `create` function refers to the module `Bvh_node` itself.

All in all,
recursive modules is a way to support cyclic dependencies among components
that the purely hierarchical module systems cannot support.
Such cyclic dependencies are usually undesirable and can be avoided by changing the software design.
Nevertheless, sometimes there are legitimate reasons to have a module depend on itself,
especially consider how versatile the OCaml module system is.
In those cases, recursive modules can serve as a valuable asset.
