---
id: self-host-comentario
title: "使用 Comentario 自托管评论系统"
lang: zh
created: 2025-04-26
tags:
  - meta
  - web
  - selfhost
description: "本文介绍了我如何将博客的评论系统从 Commento 云服务迁移到 Comentario 自托管。我分享了使用 Docker 搭建 Comentario、配置 Caddy 反向代理、以及自定义客户端 CSS 的过程。"
---

在静态网站上加入评论功能一直是个比较难实现的问题。这个博客最初使用的是 Disqus，但因为广告和追踪实在太多了，我迁移到了 [Commento](https://commento.io/)。 对我来说，一个评论系统需要具备以下功能， 而 Commento 正好具备了它们：
- 支持不登陆匿名评论，但同时也支持 OAuth
- 带后台的评论审核系统
- 评论回复
- 邮件通知
- 自定义头像
- Markdown

<aside class="side-note" style="margin-top: -250px">

当你一直使用广告拦截器时，很容易忽略 Disqus 究竟加了多少广告和追踪脚本。但光是它那臃肿的脚本，我就不想放在自己网站上。

</aside>

之后的多年我一直在用云托管的[Commento](https://commento.io/)。问题是 Commento 已经很久没人维护了，而且云服务$99美元的年费也非常之昂贵。我早就想换成别的方案，但是一直没有动力去实现。但是今年以来，Commento 云服务开始间歇性地当机，我甚至一度以为所有旧评论都丢了。正好我今年在[重新设计这个网站](/zh/site-update-2025)，所以自然而然地就想把评论区也一起换掉。

与几年前相比，现在的评论系统选择多了很多。我最终选择了 [Comentario](https://comentario.app)，这是 Commento 的一个衍生软件，迁移方便，功能也都齐全。唯一的问题是 Comentario 只支持自托管，而我完全没这方面的经验。

## 自托管部署

我是一个自托管的新手。当年就是因为完全没有自托管的经验，也不想花精力去轻易尝试，我才选择选择了一个$99刀的年费方案。在这次尝试的过程中我学到了不少东西。

<aside class="side-note" style="margin-top: -60px">

很久以前我在 DigitalOcean 上自托管过一个 [MediaWiki](https://www.mediawiki.org/wiki/MediaWiki) ，用来记数学和科学笔记。我还依稀记得 “[Apache](https://httpd.apache.org/)” 以及 “[nginx](https://nginx.org/)” 的名字。

但我当时其实根本不懂自己在干嘛，而当年用到的知识现在也都忘得一干二净了。而且最后我放弃了，因为用那种方式写笔记太麻烦了，而且还需要维护服务器。

</aside>

首先，我选择了一个虚拟专用服务器（VPS）。现在网上有很多便宜甚至免费的选项。然后我选择了 Docker 来部署 Comentario，因为 [Comentario 官方就支持 Docker Compose](https://docs.comentario.app/en/getting-started/docker-compose/)。以下是我的 docker 配置文件：

```yaml title="docker-compose.yaml"
services:
  db:
    image: postgres:17-alpine
    environment:
      POSTGRES_DB: comentario
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    restart: always

  app:
    image: registry.gitlab.com/comentario/comentario
    environment:
      BASE_URL: <已省略域名>
      SECRETS_FILE: "/secrets.yaml"
    ports:
      - "8080:80"
    volumes:
      - ./secrets.yaml:/secrets.yaml:ro
    restart: always
```

<aside class="side-note" style="margin-top: -190px">

我知道你可以通过查看本页面源码来找出 `<已省略域名>`，但我不会主动告诉你。

</aside>


Comentario 会将一些秘密信息存储在一个单独的文件中：

```yaml title="secrets.yaml"
postgres:
  host:     db
  port:     5432
  database: comentario
  username: postgres
  password: postgres

idp:
  github:
    key:    <已省略>
    secret: <已省略>
  # 计划之后会提供更多的登陆方式
```

把这两个文件放在同一个目录下，然后运行 `docker compose up -d` 就可以启动服务了。

### 自定义域名与 DNS

此时我已经可以通过 VPS 的 IP 地址访问评论服务了。因为我已经拥有一个自定义域名，只需要在 DNS 中添加一个 `A` 记录指向该 VPS 的 IP 地址即可。

### 反向代理

虽然可以通过 IP 加端口 `8080` 访问服务，但这显然不理想。我不想暴露端口，同时也希望支持 HTTPS。于是我学习反向代理这个概念，它正好可以处理这种问题。

我一开始试了 [nginx](https://nginx.org/)，但后来为了简单起见改用了 [Caddy](https://caddyserver.com/)。我只需要写一个如下的 [Caddyfile](https://caddyserver.com/docs/caddyfile)，然后启动 Caddy 即可：

```txt title="Caddyfile"
<已省略域名> {
    reverse_proxy localhost:8080
}
```

没错，这个文件就这么短！

## 前端嵌入与 CSS

根据[官方文档](https://docs.comentario.app/en/configuration/embedding/)，我们需要在页面中嵌入以下代码：

```html
<script defer src="<已省略域名>/comentario.js"></script>
<comentario-comments></comentario-comments>
```

Comentario 自带默认的CSS，但我为了让它更好地融入博客的设计，对样式做了大量自定义。我没有用CSS样式覆盖的方式，而是在 `<comentario-comments>` 标签上设置了 `css-override="false"`，然后直接把完整 CSS 打包进我的博客中。

## 顺便说两句
在这次迁移过程中，我还发现了一堆纯粹是照抄我原话的垃圾评论。我不是非常确定它们的目的是什么，但都已经被我删除了。

另外，现在我既然学会了自托管，未来就可以用它来替代掉一些云服务的订阅。我最先想到的是 RSS 阅读器和稍后读服务。

## 参考资源
在设置这个评论系统的过程中，我查了不少资料，以下是我觉得最有帮助的（不包括文档）：

- [my Comentario self-hosting setup | damien's zone](https://damien.zone/my-comentario-self-hosting-setup/)
- [Intro to self-hosting: how to get started hosting your applications](https://boringtech.net/blog/intro-to-self-hosting-how-to-get-started-hosting-your-applications/)
