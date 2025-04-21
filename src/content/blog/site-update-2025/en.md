---
id: site-update-2025
title: "Site Update (April 2025)"
lang: en
created: 2025-04-21
description: "This post talks about me completely rebuilding this website, moving from Gatsby.js to Astro due to build issues and Gatsby's decline."
tags:
  - code
  - web
---

 I've done a complete rewrite of this site. My old version was made with [Gatsby.js](https://www.gatsbyjs.com/). While I liked the overall style, it had reached a point where I couldn’t even build it locally with a recent version of Node.js.

 Since Gatsby is pretty much abandoned, I choosed a new static-site generator [Astro](https://astro.build/).
 
<span class="side-note" style="margin-top: -50px">

 I do worry that Astro might end up like Gatsby since it is yet another VC-funded “open source” project. But so far, I’m happy with it.

 </span>

Rebuilding this site was definitely a lot of work. The [previous version](https://web.archive.org/web/20250327200036/https://lesleylai.info/) had accumulated many small features over time, and reimplementing all those little details took quite a bit of effort. And while the design of this site is similar to the previous one, I still made extensive change to its layout and style. I also added some new things, such as the grid layout of the [project](/en/projects) page and a theme toggle.

There are still two major things I need to take care of. First, I don’t have comments set up yet. I previously used the cloud-hosted version of [Commento](https://commento.io/), but I plan to migrate to [Comentario](https://comentario.app). Second, my notes are still a seperate website under the subdomain [notes.lesleylai.info](https://notes.lesleylai.info/). Migrating them over to this site will be a significant task, but I plan to do it in the future.