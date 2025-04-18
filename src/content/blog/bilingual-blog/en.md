---
id: bilingual-blog
title: "How I create bilingual functionality of this blog in plain Typescript"
lang: en
created: 2022-01-01
modified: 2025-04-11
tags:
  - code
  - i18n
  - typescript
  - react
description: "This post explains how I implemented the bilingual functionality of this blog in plain Typescript."
---

**Update 2025**: _I've since migrated this blog to [Astro](https://astro.build/), but the implementation strategy of the translation remains largely unchanged._

Happy new year 2022, everyone!
Today I want to talk about something different from most of my blog posts: how I implement my bilingual blog in pure Typescript.

Since I created this blog in 2015, I have always wanted to make it bilingual to reach a broader audience,
and I finally implemented it at the end of 2019.
My implementation of internationalization was probably different from most people,
as I use plain Typescript without any third-party libraries such as [i18next](https://www.i18next.com/).
And I heavily rely on Typescript's remarkable features in its type system for my implementation.

My solution is probably not the most "proper" or scalable by professional standard,
but I think it fits the particular use case of a personal blog well.
It provides several significant advantages:

- The type system guarantees that it is impossible to forget to translate an entry
- It is very flexible as I can have arbitrarily different Javascript for different languages (Since this website is implemented in React, I can use arbitrary JSX). This is a useful property when I only want to render certain UI elements in a selected language.
- I don't need to learn an i18n library just for my blog

<span class="side-note" style="margin-top: -110px">
For people not familiar with JSX, it is a syntax extension of Javascript that enables us to write HTML-like UI code easily. It is designed to work together with React.js, but people also use it with other technologies such as Vue.js. [Here](https://reactjs.org/docs/introducing-jsx.html) is an introduction to JSX.
</span>

And thus, I recommend you use a similar approach if you want to create a multilingual personal website.

This blog uses the static-site generator [GatsbyJS](https://www.gatsbyjs.com/).
If you are not familiar with static-site generators,
one cool thing they can perform is to transform contents in formats such as Markdown into proper HTML pages
with the help of a "template."

For blog posts,
I have separate markdown files for different languages.
For example, the Chinese version of this post and the text you are currently reading are stored in different markdown files.
However, there is still a lot of text in the "template" that needs to be translated.
Examples include my bio at the right sidebar, different menu items, and blog post tags.

The "template" of GatsbyJS is in Javascript (and I decided to use Typescript, which transpiles to JS), particular React components.
As a result, it is natural for me to try to develop a Typescript solution for the internationalization problem,
and all those React components and translations will be built into static HTML.
On the other hand, suppose you use a static-site generator using Python. In that case, ideally, you should implement internationalization in Python so the translation can be done at build time to avoid the overhead of dynamically loading translation for your website.

Most of my internationalization implementations are in the [translation.tsx](https://github.com/LesleyLai/blog/blob/9500c49f22e886fe5aa706967e5dc4391a20ea15/src/utils/translations.tsx) file:

First, I have an `en` object that stores every translation entry in English:

```typescript
const en = {
  ai: "AI",
  algorithms: "Algorithms",
  archive: "Archive",
  ...
};
```

Since `en` is just a plain object, I can also store more exciting data such as jsx objects or even functions as entries:

```typescript
  all_n_posts: (n: number) => (
    <>
      All <Link to={`/en/archive`}>{n} posts</Link>
    </>
  ),
```

With `en` as an object defined, we can query its type by the `typeof` operator:

```typescript
export type Translations = typeof en;
```

This reflection ability is handy, and most programming languages don't have it. Specifically, it saves us from defining the type ourselves. And it is a nice example of how a language feature helps us achieve [the DRY principle](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself).

Now with the `Translations` type, we can create another object that mirrors the structure of `en` object, but with an explicit type requirement:

```typescript
const zh: Translations = {
  ai: "AI",
  algorithms: "算法",
  archive: "博文目录",
  ...
};
```

This way, the type system ensures that I don't forget to translate any entries.

And then, we can assemble translations of all languages into a single object. This object serves as the main entry point in our template to query specific translation entries:

```typescript
export const translations = {
  en: en,
  zh: zh,
};
```

Then we use the `keyof` operator to get a union type of the keys of translation:
in this case, `"en" | "zh"`.
`keyof` is yet another excellent reflection feature of Typescript.
But since it expects a type rather than an object, we need to apply another `typeof` operator before applying `keyof`:

```typescript
export type Language = keyof typeof translations;
```

I use the above union type whenever I need explicit type annotation for languages, for example, when passing the current language as a parameter.

And finally, we use `Object.keys` to get a list of languages,
so we can loop through all languages.

```typescript
export const languages = Object.keys(translations) as Language[];
```

This website is only bilingual, and I don't know how to write in other languages.
Still, there is no hard-coding of particular languages on my implementation, except I treat English as the "default" language.
Thus, it is trivial to extend this implementation to support more languages.
The only thing need to do is to define another object with the `Translations` type and add it as an entry to `translations`.

To use translation, we first need to pass the current language of the page to its components.
Then we can use `translations[lang]["entry"]` exactly where I need the translation (replace `"entry"` with the entry I need).
This scheme works for functions too, as I can just call the function like `translations[lang]["all_n_posts"](n)`.

That's it! I implemented the whole internationalization logic!
To add new entries, we just need to add translations to the `en` and `zh` object.
However, the most challenging part of maintaining a bilingual blog is always translating actual blog posts.
And I can't say I did a perfect job, as indicated by the large number of English-only versions of posts on this site.
But, I’m going to keep working on it, and I hope that the technical aspect of my approach will inspire you to give it a try too!
