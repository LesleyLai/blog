---
title: "Improve Rust Link Time with lld"
created: 2020-11-01
modified: 2020-11-01
tags:
  - code
  - rust
---

Today I start to experiment with the WebGPU API, and I choose to use the [wgpu-rs](https://github.com/gfx-rs/wgpu-rs) implementation in Rust.
I am happy with the experience overall, but one difficulty I met is the long iterative compilation time:

<div class="right-image-container">
<figure>
  <img src="../../../assets/compiling.png" alt="Code is compiling meme" />
  <figcaption>
    Compiling<br/>
    Source: <a href="https://xkcd.com/303/">xkcd</a>
  </figcaption>
</figure>
</div>

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">The compile-time of my webgpu project is ridiculously slow (about 10s for this single file), any <a href="https://twitter.com/hashtag/Rust?src=hash&amp;ref_src=twsrc%5Etfw">#Rust</a> expert know how to improve that? <a href="https://t.co/SVZYs54L7E">https://t.co/SVZYs54L7E</a></p>&mdash; Lesley Lai | Remember ThePhD (@LesleyLai6) <a href="https://twitter.com/LesleyLai6/status/1323064619741573121?ref_src=twsrc%5Etfw">November 2, 2020</a></blockquote>

For some applications, slow compile-time is OK.
Coding some hard algorithms requires extensive thinking,
and if they compile and pass unit tests,
they are likely correct.

By contrast, for graphics and game programming, iteration time is paramount.
A lot of the time, there are no right or wrong answer to a problem,
instead, we need to do a lot of small tweakings.

Fortunately, a person (user Rukai) on the [Graphics Programming Discord](https://discord.gg/6mgNGk7) provides a solution.

What I need to do is to create a config file `~/.cargo/config` as

```toml
[build]
rustflags = [
  "-C", "link-arg=-fuse-ld=lld",
]
```

This flag sets `lld` to the linker, which is way faster than Rust's default linker.
And I also need to install `lld` on my computer.

And this simple change magically makes my iterative compilation time under 3s.
It is still not ideal from my perspective, but at least I can enjoy doing this project again.
