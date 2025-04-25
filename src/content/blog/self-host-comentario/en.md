---
id: self-host-comentario
title: "Self hosting comments with Comentario"
lang: en
created: 2025-04-25
tags:
  - meta
  - web
  - selfhost
description: "A walkthrough of how I migrated my blog's comment system from the Commento cloud service to self-hosting with Comentario, Commento's active fork. I share my experience setting up Comentario with Docker, configuring a reverse proxy with Caddy, and customizing its client-side CSS. This post also includes reflections on the learning curve of self-hosting and notes on future plans to move away from other cloud services."
---

One of the challenges of running a static-site blog is enabling comments. This blog initially used Disqus, but I migrated to [Commento](https://commento.io/) since Disqus served way too much ads and tracking. Compare to alternatives, Commento also had the set of features I want from a comment system:
- Support comments without login, but also OAuth
- Moderation dashboard
- Threaded replies
- Email notification
- Custom user avatars
- Markdown

<span class="side-note" style="margin-top: -270px">

It's easy to overlook how much advertising and tracking Disqus includes when you always use ad-blockers, but even their bloated script alone is something I definitely don't want on my website.

</span>

For years, I used the cloud-hosted version of [Commento](https://commento.io/). However, Commento had been unmaintained for a long time, and the $99 annual fee always feels too expensive. I’d been wanting to switch to something else for a while but never quite had the motivation. That changed this year when the cloud service start to fail sporadically, and I even thought I had lost all the past comments. I also happened to be [redesigning my website](/en/site-update-2025) around the same time, so it felt like a natural moment to make the switch.

Compare to years ago, nowadays there are much more options for comments, but I settled with [Comentario](https://comentario.app), a fork of Commento, as it is easy to migrate and has all the features that I already used. The only issue is that Comentario only supports self-hosting, which is something I don't have experience with.

## Self-Hosting Setup

I am a self-hosting noob, who dreaded it so much that I even chosed a $99 annual solution a few years ago. Along the way to setting this thing up, I definitely learned a few things.

<span class="side-note" style="margin-top: -60px">

It's not quite accurate to say I'm a complete noob. A long time ago, I self-hosted a [MediaWiki](https://www.mediawiki.org/wiki/MediaWiki) instance for my math and science notes on a DigitalOcean Droplet. I vaguely remember something called "[Apache](https://httpd.apache.org/)", and another thing called "[nginx](https://nginx.org/)."

I definitely didn't know what I was doing, though, and whatever knowledge I picked up back then is now long forgotten. Eventually, I gave up, since the friction of both writing notes and maintaining the software in that workflow was too high.

</span>

First, I picked a [VPS](https://en.wikipedia.org/wiki/Virtual_private_server) service. There are a lot of cheap or even free options available online nowadays. Nowadays it is pretty common to use Docker to self-host, and [Comentario supports Docker Compose out of the box](https://docs.comentario.app/en/getting-started/docker-compose/). Below are my docker configurations:

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
      BASE_URL: <redacted domain>
      SECRETS_FILE: "/secrets.yaml"
    ports:
      - "8080:80"
    volumes:
      - ./secrets.yaml:/secrets.yaml:ro
    restart: always
```

<span class="side-note" style="margin-top: -200px">

Yes, you could find the `<redacted domain>` by reading the source code of this page. I'll not save you this trouble, though.

</span>


Comentario stores "secrets" in a separate file:
```yaml title="secrets.yaml"
postgres:
  host:     db
  port:     5432
  database: comentario
  username: postgres
  password: postgres

idp:
  github:
    key:    <redacted>
    secret: <redacted>
  # plan to add other providers later
```

Putting those two files in the same directory and I can start the app with `docker compose up -d`.

### Custom Domain and DNS

Now I could access the app via the IP address. Since I already own a custom domain, all I need to do is to add an `A` record to point to the VPS.

### Reverse Proxy

Now I have a web app that I can access via IP address and the port `8080`, but that is far from ideal. I don't want expose the port and I also need to support HTTPS. I learned something called [reverse proxy](https://en.wikipedia.org/wiki/Reverse_proxy) to handle exact this kind of situation.

Initially I tried to use [nginx](https://nginx.org/), but I setted with [Caddy](https://caddyserver.com/) for simplicity. All I need to do was to write a [Caddyfile](https://caddyserver.com/docs/caddyfile) like this and start the Caddy server:

```txt title="Caddyfile"
<redacted domain name> {
    reverse_proxy localhost:8080
}
```

Yes, it is that simple!

## Client-Side and CSS

Adding comments to this blog is trivial [following the instruction](https://docs.comentario.app/en/configuration/embedding/):
```html
<script defer src="<redacted domain>/comentario.js"></script>
<comentario-comments></comentario-comments>
```

Comentario includes its own CSS, but I needed to customize it extensively to match my site’s design. Rather than relying on CSS overrides, I chose to set `css-override="false"` on the `<comentario-comments>` tag and bundled the full CSS file myself in this blog.

## Final Notes
During the migration, I also noticed a bunch of spam comments that were just copy-pasting my words verbatim. I'm not sure what their purpose was, but I deleted all of them.

Also, now that I know how to self-host, I’m planning to cut my subscriptions to some other cloud-hosted services. RSS reader and a read-it-later tool immediately comes to my mind.

## Resources
I've browsed a lot of resources to set this up, here are the ones I found most useful (excluding documentation):
- [my Comentario self-hosting setup | damien's zone](https://damien.zone/my-comentario-self-hosting-setup/)
- [Intro to self-hosting: how to get started hosting your applications](https://boringtech.net/blog/intro-to-self-hosting-how-to-get-started-hosting-your-applications/)
