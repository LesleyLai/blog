---
title: "用Typescript来实现中英文博客"
created: 2022-01-02
modified: 2022-01-24
tags:
  - code
  - i18n
  - typescript
  - react
---

各位 2022 年新年快乐！
今天我想谈谈与我大多数博客文章不同的东西：我是如何用 Typescript 来实现我的双语博客的。

自从我在 2015 年创建这个博客以来，我一直想把它变成中英文的来吸引更多的国内受众，而我终于在 2019 年底终于实现了这一点。
我的博客的国际化实现可能与大多数人不同，因为我没有使用任何例如[i18next](https://www.i18next.com/)的第三方库，
而主要依靠 Typescript 强大的类型系统。

我的方法可能不是最“正确”与可扩展的方式，
但是我认为对于个人博客网站来说，我的方法是一个非常合适的方案。
它提供了几个重要的优势：

- Typescript 的类型系统保证了我不会忘记翻译任何一个条目
- 我可以简单地对不同语言的界面采用不同的排版
- 我不需要单单为了我的博客网站而学习使用一个国际化库

因此，如果你想创建一个多语种的个人网站，我建议你使用类似的方法。

我的博客使用了[GatsbyJS](https://www.gatsbyjs.com/)静态网页生成器。
静态网页生成器可以在模板的帮助下将 Markdown 文件转换为 Html 网页[^1]。

[^1]: GatsbyJS 比较特殊，它并不完全按照我所说的静态网页生成器的方法工作。但你可以访问他们的网站了解更多。

对于博客文章来说，我只需要为每篇文章每种语言都准备单独的 markdown 文件就可以了。
比如说，你现在所看到中文文字以及这篇文章的英文版就会被储存在不同 markdown 文件中。
另一方面，在模板 UI 中仍然有很多文字需要翻译，
例如我在右边栏的自我介绍、不同的菜单选项、以及博客文章的标签。

GatsbyJS 使用 Javascript 作为模板的语言，
所有 GatsbyJS 的模板都是 React 组件。
我选择了可以转译为 Javascript 的 Typescript 作为我这个博客主要的开发语言。
因此，我很自然地为国际化问题开发了一个 Typescript 的解决方案，而 Gatsby 会把所有的 React 组件以及翻译逻辑都会自动变为静态的 HTML。
反过来说，假设你使用一个使用 Python 的静态网站生成器，那么在理想情况下你应该在 Python 中实现国际化，这样在载入你的网站时无需再动态加载翻译。

我把大部分国际化逻辑的实现都放在了[translation.tsx](https://github.com/LesleyLai/blog/blob/9500c49f22e886fe5aa706967e5dc4391a20ea15/src/utils/translations.tsx)文件中：

首先，我使用一个 `en` 对象来存储所有英文翻译条目。

```typescript
const en = {
  ai: "AI",
  algorithms: "Algorithms",
  archive: "Archive",
  ...
};
```

由于`en`只是一个普通的对象，我在其中可以储存任意的数据作为条目，例如 jsx 对象甚至是函数：

```typescript
  all_n_posts: (n: number) => (
    <>
      All <Link to={`/en/archive`}>{n} posts</Link>
    </>
  ),
```

有了`en`这个对象的定义，我们可以通过`typeof`操作符来得到它的类型：

```typescript
export type Translations = typeof en;
```

大多数编程语言都不具备类似于`typeof`的这种反射能力。有了`typeof`，我们就不要自己显式定义 `en` 对象的类型了。

现在有了`Translations`类型，我们可以以此类型来建立一个`zh`对象来存储中文：

```typescript
const zh: Translations = {
  ai: "AI",
  algorithms: "算法",
  archive: "博文目录",
  ...
};
```

这样类型系统会确保我不会忘记翻译任何条目。

然后，我们可以把所有语言的翻译都放到一个对象中。
在 Javascript 组件中，我们会使用这个对象来查询特定的翻译条目：

```typescript
export const translations = {
  en: en,
  zh: zh,
};
```

然后我们使用`keyof`操作符来获得包含各种语言的联合类型（union type）。
在我的情况下我会得到`"en" | "zh"`。
`keyof`可以说是另一个 Typescript 中非常有意思的反射特性。
由于 `keyof` 期望的是一个类型而不是一个对象，我们需要在使用 `keyof` 之前加上另一个 `typeof` 操作符：

```typescript
export type Language = keyof typeof translations;
```

每当我需要显式提供当前语言变量的类型，比如说在将当前语言作为参数传递时，我就会使用的`Language`上述类型。

最后，我们使用`Object.keys`来获得一个语言列表，通过此我们可以循环遍历所有的语言：

```typescript
export const languages = Object.keys(translations) as Language[];
```

我的这个博客只有两种语言，我也不懂除了中英文外的其他语言。
但在我的代码中，除了将英语作为“默认”语言外，并没有对特定语言进行硬编码。
因此如果我需要的话，我可以很简单地为这个网站加上第三个语言：
我只需要定义另外一个类型是`Translations`的对象并且把它加入到`translations`中。

我们需要将页面的当前语言传递给它的组件来使用翻译。
之后我们可以在我需要翻译的地方使用`translations[lang]["entry"]`（用具体需要的条目名来替换`entry`）。
同样的方法也适用于函数。我只需要用类似于`translations[lang]["all_n_posts"](n)`的方式来调用函数就可以了。

这样我就实现了整个国际化的逻辑!
要添加新的翻译，我只需要向`en`和`zh`对象中添加相应的翻译条目。
当然，维护一个双语博客最具挑战性的部分始终是翻译实际的博客文章。
而我并不能说我在把博文译回中文这方面做了非常好的工作。
但我希望至少我在技术方面的做法可以提供一些启发。
