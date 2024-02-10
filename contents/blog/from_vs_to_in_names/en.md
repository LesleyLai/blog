---
id: enum-traits
title: "Small Naming Tip: Use \"from\" Instead of \"to\" in Function and Variable Names"
lang: en
create: "2024-02-10"
lastModify: "2024-02-10"
categories:
  - code
  - opinion
---

Today, I'm tackling a piece of code involving several mappings. Like many others, I typically label such maps as `x_to_y`, and that's also what I've done here:

```rust
let mut value_to_var: HashMap<Value, (String, usize)> = HashMap::new();
let mut var_to_num: HashMap<String, usize> = HashMap::new();
// This is not a hash table but I use the index as the key
let mut num_to_canonical_var = vec![];
```

When I need to use those maps, my code often looks like this:

```rust
let canonical_variable = num_to_canonical_var[var_to_num.get(var).unwrap()];
```

As you can observe, the sequence isn't particularly intuitive. The code executes a transformation from "variable -> number -> canonical variable," but understanding it requires reading from the inside out, akin to unraveling a spiral.
Reading inside out can be challenging. Despite my nearly decade-long experience with C and C++, I still struggle at times to decipher the inside-out syntax of C declarations. Others [share this sentiment](https://fuckingfunctionpointers.com/) as well.

What if I change all the `to` to `from`?

```rust
let mut var_from_value: HashMap<Value, (String, usize)> = HashMap::new();
let mut num_from_var: HashMap<String, usize> = HashMap::new();
let mut canonical_var_from_num = vec![];
```

Now, we can write code like the following:

```rust
let canonical_variable = canonical_var_from_num[num_from_var.get(var).unwrap()];
```

This code is much easier to comprehend, as related names share physical proximity. The transformation it performs is also readily apparent just by reading from right to left.

The same idea can also be applied to functions. For instance, `let shader = shader_from_file(file)` reads better than `let shader = file_to_shader(file)`. It isn't a coincidence, considering that both functions (at least the pure ones) and a map data structure aim to create a mapping between data.
