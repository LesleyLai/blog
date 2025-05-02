---
id: site-update-2025
title: "网站更新（2025年4月）"
lang: zh
created: 2025-04-22
modified: 2025-04-25
description: "本文介绍了我对本站的彻底重写，包括从 Gatsby.js 迁移到 Astro。"
tags:
  - meta
  - web
---

我最近对这个网站进行了彻底的重写。旧版是用[Gatsby.js](https://www.gatsbyjs.com/)构建的。虽然我喜欢它的整体风格，但它已经失修到了一个无法用最新版 Node.js 在本地构建的地步。

鉴于 Gatsby 几乎已经被放弃，我选择了 [Astro](https://astro.build/) 作为了我的新的静态网站生成器。

<aside class="side-note" style="margin-top: -50px">

我有些担心 Astro 最终也会变成像 Gatsby 一样的下场，毕竟它也是一个风投资助的“开源”项目。但目前为止，我对它还是满意的。

 </aside>


重建这个网站确实花了不少功夫。[旧版本的网站](https://web.archive.org/web/20250327200036/https://lesleylai.info/)随着时间的推移积累了许多小功能，要重新实现这些细节花了我不少时间。而且，虽然这个新网站的设计在风格上与旧版相似，但我对其布局和样式进行了大量改动。我还添加了一些新功能，比如[项目页面](/en/projects)的网格布局和深浅主题切换功能。

目前还有两件重要的事情尚未完成。首先，我还没有设置评论系统。之前我使用的是托管版的 [Commento](https://commento.io)，但我计划迁移到自托管 [Comentario](https://comentario.app)。其次，我的笔记目前仍是一个位于子域名 [notes.lesleylai.info](https://notes.lesleylai.info) 下的独立网站，将它迁移到本站将是一项不小的工作，但这个在我的计划内。

更新 2025-04-25：本站的评论系统又上线了！我在[之后的文章](/zh/self-host-comentario)中分享了我的配置。