---
id: delve_into_cpp
title: "这些资源帮助你深入学习C++"
lang: zh
created: 2021-01-15
modified: 2021-01-15
tags:
  - code
  - cpp
  - learning
description: "这篇文章提供了实用的建议和精选资源，帮助读者学习 C++，并根据不同的背景和经验水平量身定制学习路径。"
---

这些年来，很多人都向我寻求学习 C++的帮助。
我算不上什么 C++专家，
但是作为一个从事 C++多年的人，
我想在这分享一些高质量并且同时适合初学者的 C++资源。
希望这些资源对您有所帮助。

当有人问我有关使用 C++的指导时，
我总是首先问他们已有的编程经验经验。
有些人刚开始学习编程，并决定学习 C++作为他们的第一门编程语言；
有些人已经掌握了少量的 C++，并且想要学习更多；
而有些人已经使用了其他语言编程多年，然后尝试学习一些 C++。
因为不同的人有不同的背景以及不同的学习目标，
所以我会推荐一些不同的材料。

不过，我想提到的一件事是，仅仅阅读书籍或观看视频并不是学习的最佳策略。
无论您处于什么阶段，把学到的知识用到实践中都非常重要，因此开始进行一些编程项目会对你的学习很有帮助。

另外一件我想提到的是，
我在这里推荐到资源基本上都是英文资源。
我强烈建议您试图通过英文资源来学习，
因为您只通过中文来学习编程，
那么您将失去使用绝大多是好的学习资料的机会。

## 如果我刚刚开始学习编程并选择 C++作为我的第一门编程语言，我该怎么做？

对于编程初学者来说，我推荐 Bjarne Stroustrup（C++之父）的《C++程序设计：原理与实践》第二版（Programming: Principles and Practice Using C++ 2nd edition）。
这本书有中文翻译，不过就像我之前说的，如果您有一点的英文阅读能力，我建议您阅读原版。
因为这本书很厚，所以您不一定能够坚持看完整本，但是无论您看了多少页你都能学到东西。

如果您不想要看书，
C++专家 Kate Gregory 在 Pluralsight 网站上提供了不少的视频教程。
其中她的入门教程是[Learn to Program with C++](https://www.pluralsight.com/courses/learn-program-cplusplus)。
如果你加入[#include{'<'}C++{'>'} discord 服务器](https://www.includecpp.org/discord/)，
你可以在服务器内直接为她要一份试用码。

## 如果我以前已经学习过一些 C++并且想更深入地学习，我该怎么做？

也许您已经从大学数据结构课程中使用过一些 C++，
又或者您学习了一些使用 C++的在线教程，
接下来该做什么？

根据我的个人经历以及我所听闻的，
大多数大学编程课程或那些在线教程的质量都偏低，而且讲师通常对 C++一知半解。
您可能会被之前的学习资源所误导，并且学习到了一些错误的实践或者是对概念的误解。
因此，选择正确的学习资料是对高效学习十分重要的一点。

在这种情况下，我同样会推荐 Bjarne Stroustrup 的《C++程序设计：原理与实践》第二版。
你可以看书看得比纯粹初学者更快一些，不过使用该书来系统地查漏补缺依然很有好处。
如果您更喜欢视频教程，
可以从 Kate Gregory 的[C++ Fundamentals Including C++17](https://www.pluralsight.com/courses/cplusplus-fundamentals-c17)开始。

## 如果我是另一门语言的资深人士并想学习 C++，该怎么办？

如果您已经精通了某个其他的编程语言，并且想开始学习一些 C++，
您可以直接选择更加进阶的材料。

对于书来说，
我建议阅读 Bjarne Stroustrup 的《C++程序设计语言》第四版（The C++ Programming Language (4th Edition)）。
这本书是我读过的最好的技术书籍之一。
不过这本书也同样相当得厚。如果您没有时间阅读该书并且想要有一个简短的 C++介绍，
您可以购买《A Tour of C++》第二版。

## 我认为我对 C++有一定的了解了。 下一步是什么？

如果您花了数月的时间学习上述资料，
并觉得您对 C++基本概念有相当的了解。
接下来该做什么？

<span class="side-note">

如果您是资深 C++程序员，你可能会注意到我用了“概念”一词。不过我并没有在讨论 C++20 的*[概念](https://zh.cppreference.com/w/cpp/language/constraints)*（concept）语言特性 😃.

</span>

如果您达到了这个阶段，那么您应该对下列的多数话题有相当的熟悉程度：

- 如何正确使用`const`
- 模板（templates）
- 引用（references）以及指针（pointers）
- 对标准库的熟练使用，尤其是迭代器（iterators）以及标准算法（algorithms）
- [RAII](https://zh.cppreference.com/w/cpp/language/raii)
- 析构函数（destructor）
- 复制/移动构造函数以及复制/移动赋值运算符
- 移动语义(move semantics)
- 运算符重载（operator overloading）
- [lambda 表达式以及函数对象](c++-lambda)
- 未定义行为（undefined behaviors）

如果你已经到了这个阶段，
那么为 C++找到实际用途或许比学习 C++语言本身更重要了。
C++被用于许多不同的用途，
而您也可以开始考虑如何把 C++应用在您感兴趣的领域上。

同样，现在是学习 C++生态系统的好时机，您可以花一些时间来深入学习例如[Catch2](https://github.com/catchorg/Catch2)等单元测试库，[CMake](https://cmake.org/)等构建系统, 以及[Conan](https://conan.io/)等包管理器。

另外一个可以考虑的事是开始学习另一门编程语言，
尤其是如果您目前仅了解 C++一门语言。
下一个不错的选择是与 C++截然不同的语言，例如 Javascript，Python 或 Lisp 等动态类型的语言。

话虽这么说，仍然有无尽得关于 C++语言本身的知识可以学习。
我将尝试在以下列出一些我喜欢的资源：

### 书籍

如果你仍然没有阅读《C++程序设计语言》第四版（The C++ Programming Language (4th Edition)的话，
这本书仍然是一个非常好的选择。除此之外，我还有一些其他的书可以推荐：

- Scott Mayer 的《Effective Modern C++》
- Jason Turner 的《C++ Best Practices》
- Nicolai M. Josuttis 的《C++17 - The Complete Guide》

还有一些书籍会关注于某些特定的方向，例如：

- David Vandevoorde、Nicolai M. Josuttis、以及 Douglas Gregor 的《C++ Templates - The Complete Guide, 2nd Edition》
- Arthur O'Dwyer 的《Mastering the C++17 STL》
- Ivan Čukić 的《Functional Programming in C++》
- Anthony Williams 的《C++ Concurrency in Action, 2nd edition》

### 大会讲话视频

大会讲话同样是学习 C++的绝佳资源。下列是一些我个人喜欢并且适合初学者的讲话：

- [CppCon 2019: Kate Gregory "Naming is Hard: Let's Do Better"](https://www.youtube.com/watch?v=MBRoCdtZOYg)
- [CppCon 2018: Kate Gregory "Simplicity: Not Just For Beginners"](https://www.youtube.com/watch?v=n0Ak6xtVXno)
- [CppCon 2017: Kate Gregory "10 Core Guidelines You Need to Start Using Now"](https://youtu.be/XkDEzfpdcSg)
- [CppCon 2017: Matt Godbolt "What Has My Compiler Done for Me Lately? Unbolting the Compiler's Lid"](https://www.youtube.com/watch?v=bSkpMdDe4g4)
- [Going Native 2013: Sean Parent "C++ Seasoning"](https://channel9.msdn.com/Events/GoingNative/2013/Cpp-Seasoning)
- [CppCon 2014: Herb Sutter "Back to the Basics! Essentials of Modern C++ Style"](https://youtu.be/xnqTKD8uD64)
- [CppCon 2015: Bjarne Stroustrup “Writing Good C++14”](https://youtu.be/1OEu9C51K2A)
- [CppCon 2018: Jason Turner "Applied Best Practices"](https://youtu.be/DHOlsEd0eDE)
- [CppCon 2017: Jason Turner “Practical C++17”](https://youtu.be/nnY4e4faNp0)

### 社群

加入编程社群有非常多的好处，你可以向专家提问，知道他人的动态，讨论有关工作的信息，甚至交到一些好朋友。

#### #include<C++>

[#include<C++>](https://www.includecpp.org/)是一个非常不错的 C++社群，
它提供了一个友好的讨论环境，并且你在里面可以找到多个在 C++界知名的人物。
您可以加入[它的 discord 服务器](https://www.includecpp.org/discord/)并且和大家一起讨论 C++。

#### 见面会(Meetups)

加入[North Denver Metro C++ Meetup](https://www.meetup.com/North-Denver-Metro-C-Meetup/)是我大学阶段做出的最好决定之一。如果您有时间的话，参加一些本地的 C++见面会是一个非常不错的选择。（因为新冠的原因，现在绝大多数见面会以及大会都在网上召开，这有利有弊，但一个很大的优势是您现在可以参加全球的见面会）您可以在[meetup.com](https://www.meetup.com/)网站上搜索本地的见面会。

#### 参加大会

如果您认真对待 C++，那么大会是结识志趣相投的人的好地方。
这是我知道的一些重复举办的 C++会议：

- [CppCon](https://cppcon.org/)
- [C++Now](https://cppnow.org/) (tuned toward a more advanced audience)
- [ACCU](https://accu.org/conf-main/main/)
- [Meeting C++](https://meetingcpp.com/)
- [Pacific++](https://pacificplusplus.com/)
- [C++ on Sea](https://cpponsea.uk/)
- [Core C++](https://corecpp.org/)

除此之外，ISO C++网站上有一个[大会列表](https://isocpp.org/wiki/faq/conferences-worldwide)。

#### 播客

网上有不少 C++的播客，尤其是 2020 年有不少新的播客涌现。当然，所有的这些播客都需要较好的英语听力水平：

- [CppCast](https://www.cppcast.com/)
- [cpp.chat](https://cpp.chat/)
- [TLB Hit](https://tlbh.it/)
- [ADSP: The Podcast](https://adspthepodcast.com/)
- [No Diagnostic Required](https://nodiagnosticrequired.tv/)
- [Two's Complement](https://www.twoscomplement.org/)

#### 博客

我推荐使用 RSS 来关注各种技术博客。
我个人关注超过 200 个关于 C++或者其他技术话题的博客，
下列是一些我个人认为最好的 C++博客：

- [Fluent C++](https://www.fluentcpp.com/)
- [Arthur O’Dwyer](https://quuxplusone.github.io/blog/)
- [Sutter’s Mill](https://herbsutter.com/)
- [Modernes C++](https://www.modernescpp.com/)
- [The Pasture](https://thephd.github.io/)
- [foonathan::​blog()](https://foonathan.net/)
- [Barry Revzin](https://brevzin.github.io/)
- [artificial::mind](https://artificial-mind.net/)
- [Bartek's coding blog](https://www.bfilipek.com/)
- [Simplify C++](https://arne-mertz.de/)
- [Video Cortex](http://videocortex.io/)
- [Shafik Yaghmour](https://shafik.github.io/)

<span class="side-note" style="margin-top: -440px">

我的这个博客同样有一个[RSS 源](https://lesleylai.info/zh/rss.xml).

</span>

需要注意的是某些博文会讨论非常高深的话题，因此您并不一定需要读懂每一篇博文。

### 其他资料

下面是一些其他有用的 C++资源：

- [cppreference](http://zh.cppreference.com/w/)是最好的 C++语言以及标准库 API 文档网站
- [Compiler Explorer](https://compiler-explorer.com/)一个在线编码环境，支持 ++和许多其他语言。 它可以编译后的汇编码以及运行程序。
- [Quick C++ benchmark](https://quick-bench.com/)是一个可以快速对 C++代码进行测速的网站。

## 引用以及扩展阅读

- _"SG20 Education And Recommended Videos For Teaching C++". Christopher Di Bella_, 2021, https://www.cjdb.com.au/sg20-and-videos. Accessed 15 Jan 2021.
- _"References And Links". #Include {'<'}C++{'>'}_, 2021, https://www.includecpp.org/resources/references/. Accessed 16 Jan 2021.
- Yaghmour, Shafik. _"Where To Get Started Learing C++ And What Resources To Use". Shafik Yaghmour's Blog_, 2019, https://shafik.github.io/c++/learning/2019/09/05/getting_started_learning_cpp.html. Accessed 16 Jan 2021.
