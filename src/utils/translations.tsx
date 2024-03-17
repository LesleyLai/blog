/*eslint sort-keys: "warn"*/
/*eslint "@typescript-eslint/camelcase": "off"*/

import { Link } from "gatsby";
import { TagID } from "../types/tags";
import * as React from "react";

const en = {
  about_content: (
    <>
      <p>
        Hi, I am <strong>Lesley Lai</strong>. I organize two weekly online meetups. I founded{" "}
        <a href="https://www.meetup.com/Graphics-Programming-Virtual-Meetup/">
          Graphics Programming Virtual Meetup
        </a>{" "}
        in 2020 and also co-organize{" "}
        <a href="https://www.meetup.com/programming-languages-toronto-meetup/">
          Programming Language Virtual Meetup
        </a>{" "}
        since 2022. In extra, I also help organizing{" "}
        <a href="https://www.includecpp.org/">#include &lt;C++&gt;</a>.
      </p>
      <p>
        My primary interests include{" "}
        <a href="https://en.wikipedia.org/wiki/Computer_graphics">Computer Graphics</a>
        {" and "} Programming Languages.
      </p>
      <p>
        I am pretty tech stack agnostic and like to work with and appreciate different programming
        languages and APIs. Nevertheless, I have been active in the C++ community for a long time.
      </p>
    </>
  ),
  ai: "AI",
  all_n_posts: (n: number) => (
    <>
      All <Link to={`/en/archive`}>{n} posts</Link>
    </>
  ),
  algorithms: "Algorithms",
  archive: "Archive",
  archive_title: "Blog Archive",
  blog: "Blog",
  books: "Books",
  build_using_gatsby: (
    <>
      This blog is built using <a href="https://www.gatsbyjs.org/">Gatsby</a>. The source is on the{" "}
      <a href="https://github.com/LesleyLai/blog">Github repo</a>.
    </>
  ),
  c: "C",
  cmake: "CMake",
  code: "Coding",
  code_at_github: (
    <>
      Code at <a href="https://github.com/LesleyLai">Github</a>
    </>
  ),
  compiler: "Compiler",
  contact: "Contact",
  contact_page_desc: "Contact me",
  contact_page_text: (
    <>
      <p>
        You can direct message me on <a href="https://twitter.com/LesleyLai6">Twitter</a>. I also{" "}
        hang out a lot in{" "}
        <a href="https://discord.gg/TsTDb4uYfR">Graphics Programming Virtual Meetup</a> and{" "}
        <a href="https://www.includecpp.org/discord/">#include ＜C++＞</a> Discord servers. You can
        direct message me on Discord if you are a member of either of those servers.
      </p>
      <p>
        You can also send an email to{" "}
        <a href="mailto:lesley@lesleylai.info?subject=Hello Lesley">lesley@lesleylai.info</a> or use
        the following contact form:
      </p>
    </>
  ),
  contact_form_message: "Message",
  contact_form_message_placeholder: "Type your message here...",
  contact_form_website_placeholder: "Your website (optional)",
  contact_submitted_message: "Thank you for getting in touch! I will contact you back via Email.",
  contact_validation_invalid_email: "Please enter a valid Email",
  contact_validation_invalid_website: "Please enter a valid url (or leave this field blank)",
  contact_validation_require_email: "Please enter your Email",
  contact_validation_require_message: "Please enter your message",
  contact_validation_require_name: "Please enter your name",
  cpp: "C++",
  create: "Create",
  csharp: "C#",
  cuda: "CUDA",
  designpattern: "Design Patterns",
  dod: "Data-oriented design",
  elm: "Elm",
  elsewhere: "Elsewhere",
  email: "Email",
  event: "Event",
  functional: "Functional Programming",
  game: "Game",
  graphics: "Graphics",
  graphql: "GraphQL",
  home: "Home",
  i18n: "i18n",
  java: "Java",
  javascript: "Javascript",
  lang: "English",
  lastModify: "Last Modify",
  learning: "Learning",
  library: "Library",
  linkedin: (
    <>
      Profile on <a href="https://www.linkedin.com/in/lesley-lai/">LinkedIn</a>
    </>
  ),
  logic: "Logic",
  math: "Mathematics",
  myname: "Lesley Lai",
  name: "Name",
  n_posts: (n: number) => `${n} Posts`,
  ocaml: "OCaml",
  offtopic: "Off Topic",
  oop: "OOP",
  opengl: "OpenGL",
  opinion: "Opinion",
  page_not_found: "404 NOT FOUND",
  page_not_found_text: "Sorry, the page you are looking for cannot be found.",
  personal: "Personal",
  physics: "Physics",
  pl: "Programming Languages",
  projects: "Projects",
  projects_page_description: "Check out my personal projects below",
  python: "Python",
  racket: "Racket",
  rasterizer: "Rasterization",
  react: "React",
  return_to_home: (
    <>
      Return to the <Link to="/">Home Page</Link>
    </>
  ),
  rt: "Ray tracing",
  rust: "Rust",
  scheme: "Scheme",
  show_projects_filtered: (count: number, tag: TagID) => (
    <>
      Show {count} projects filtered by <em>{en[tag]}</em>.
    </>
  ),
  showall: "Show all",
  showall_projects: "Show all projects. Click tags to list them by topics.",
  stuff_I_wrote_about: (tag: TagID) =>
    tag === "opinion" ? "Stuff I Wrote to State My Opinion" : `Stuff I Wrote About ${en[tag]}`,
  submit: "Submit",
  tags: "Tags",
  talks: "Talks",
  talks_page_desc: "Here are the talks that I gave in various events.",
  test: "Testing",
  title: "Lesley Lai",
  typescript: "Typescript",
  vulkan: "Vulkan",
  web: "Web",
  webgpu: "WebGPU",
  website: "Website",
  wgpu: "wgpu",
  x86: "x86",
};

export type Translations = typeof en;

const zh: Translations = {
  about_content: (
    <>
      <p>
        大家好，我是赖思理，我是两个线上计算机俱乐部的组织者： 我在2020年发起了
        <a href="https://www.meetup.com/Graphics-Programming-Virtual-Meetup/">图形编程线上俱乐部</a>
        ，而从2022年开始我也同时负责组织
        <a href="https://www.meetup.com/programming-languages-toronto-meetup/">
          编程语言线上俱乐部
        </a>
        的活动。 这两个俱乐部都是每周举办、面向全世界的兴趣研讨小组。 除此之外，我同时也帮助组织
        <a href="https://www.includecpp.org/">#include &lt;C++&gt;</a>社群。
      </p>
      <p>我的个人兴趣包括计算机图形学以及编程语言。</p>
    </>
  ),
  ai: en.ai,
  all_n_posts: (n: number) => (
    <>
      所有<Link to={`zh/archive`}>{n}篇博文</Link>
    </>
  ),
  algorithms: "算法",
  archive: "博文目录",
  archive_title: "博文目录",
  blog: "博客",
  books: "书籍",
  build_using_gatsby: (
    <>
      本博客使用<a href="https://www.gatsbyjs.org/">Gatsby</a>
      来搭建，源码在<a href="https://github.com/LesleyLai/blog">Github</a>
      上。
    </>
  ),
  c: en.c,
  cmake: en.cmake,
  code: "编程",
  code_at_github: (
    <>
      <a href="https://github.com/LesleyLai">Github</a>
    </>
  ),
  compiler: "编译器",
  contact: "联系我",
  contact_page_desc: "联系我",
  contact_page_text: (
    <>
      <p>
        您可以向<a href="mailto:lesley@lesleylai.info?subject=赖思理你好">lesley@lesleylai.info</a>
        发送邮件， 或者使用以下的联系表单：
      </p>
    </>
  ),
  contact_form_message: "留言",
  contact_form_message_placeholder: "请在这里留下留言……",
  contact_form_website_placeholder: "您的个人网站 （选填）",
  contact_submitted_message: "感谢您联系我。我会通过电子邮件来回复您。",
  contact_validation_invalid_email: "请输入一个合法的电子邮箱地址",
  contact_validation_invalid_website: "请输入一个合法的网址 （或者将这一栏留空）",
  contact_validation_require_email: "请输入您的电子邮箱地址",
  contact_validation_require_message: "请输入您的留言",
  contact_validation_require_name: "请输入您的姓名",
  cpp: en.cpp,
  create: "创建时间",
  csharp: en.csharp,
  cuda: en.cuda,
  designpattern: "设计模式",
  dod: "面向数据设计",
  elm: en.elm,
  elsewhere: "链接",
  email: "电子邮箱",
  event: "活动",
  functional: "函数式编程",
  game: "游戏",
  graphics: "图形学",
  graphql: en.graphql,
  home: "主页",
  i18n: "国际化",
  java: en.java,
  javascript: en.javascript,
  lang: "中文",
  lastModify: "最近修改时间",
  learning: "学习",
  library: "软件库",
  linkedin: (
    <>
      <a href="https://www.linkedin.com/in/lesley-lai/?locale=zh_CN">领英</a>
    </>
  ),
  logic: "逻辑学",
  math: "数学",
  myname: "赖思理",
  name: "姓名",
  n_posts: (n: number) => `${n}篇博文`,
  ocaml: en.ocaml,
  offtopic: "非技术",
  oop: "面向对象编程",
  opengl: en.opengl,
  opinion: "观点",
  page_not_found: "找不到该页面",
  page_not_found_text: "抱歉，您要访问的页面无法被找到。",
  personal: "个人相关",
  physics: "物理",
  pl: "编程语言",
  projects: "个人项目",
  projects_page_description: "下列是我的一些个人项目",
  python: en.python,
  racket: en.racket,
  rasterizer: "光栅化",
  react: en.react,
  return_to_home: (
    <>
      返回<Link to="/zh">主页</Link>
    </>
  ),
  rt: "光线追踪",
  rust: en.rust,
  scheme: en.scheme,
  show_projects_filtered: (count: number, tag: TagID) => (
    <>
      显示{count}个关于{zh[tag]}的项目。
    </>
  ),
  showall: "显示所有",
  showall_projects: "显示所有项目。您可以通过标签来限定显示包含指定标签的项目。",
  stuff_I_wrote_about: (tag: TagID) =>
    tag === "opinion" ? `阐述个人观点的博文` : `关于${zh[tag]}的博文`,
  submit: "提交",
  tags: "标签",
  talks: "演讲",
  talks_page_desc: "以下为我在不同场所的一些讲话：",
  test: "软件测试",
  title: "赖思理的博客",
  typescript: en.typescript,
  vulkan: en.vulkan,
  web: en.web,
  webgpu: en.webgpu,
  website: "网站",
  wgpu: en.wgpu,
  x86: en.x86,
};

export const translations = {
  en: en,
  zh: zh,
};

export type Language = keyof typeof translations;

export const languages = Object.keys(translations) as Language[];
