---
id: delve_into_cpp
title: "Resources that help you to delve into C++"
lang: en
created: "2021-01-15"
modified: "2021-03-29"
tags:
  - code
  - cpp
  - learning
---

_I already received some great feedback [^1] for this post, and any further feedbacks, error-correction, and resource recommendation are welcome. One way to contact me is to direct message me ([@Lesleylai6](https://twitter.com/LesleyLai6)) on Twitter_.

[^1]: Thanks to [Shafik Yaghmour](https://twitter.com/shafikyaghmour), [Kate Greogory](https://twitter.com/gregcons), and [Dwight Browne](https://twitter.com/dwightb2).

_Update 2021-03-29: Add a bunch of resources._

During the years, a lot of people ask me for help in learning C++.
I am no C++ expert,
but as a person who is doing C++ for years,
I want to share a bunch of beginner-friendly C++ resources that are known to be of high quality.
And hopefully this list of resources can help learners who are new to C++.

<!-- end -->

When anyone asks me for guidance about getting into C++,
I always ask first about their existing experiences.
Some people just start to learn programming and decide to learn C++ as their first language,
some people have learned a limited amount of C++ and want to learn more,
and some of them are already programming veterans in other languages.
Depend on your experiences,
you probably want to start with different materials,
and I try to cater to each of those backgrounds in this post.

One thing I want to mention, though, is that reading books or watching videos all the time is not the best strategy to learn.
Whatever stage you are in, it is much easier to learn when you apply ideas into code,
so spending time on coding projects helps.

## What if I just start learning to program and choose C++ as my first language?

For beginners, it is important to only "learn from the best" since it is hard to discern if your tutorial is making mistakes or encouraging bad practices.

For books, I recommend Bjarne Stroustrup (the creator of C++) 's ["Programming: Principles and Practice Using C++ 2nd edition"](https://www.amazon.com/Programming-Principles-Practice-Using-2nd/dp/0321992784) as a starting point.
The book is thick, so don't feel guilty if you cannot finish the whole book.

If you are more inclined toward tutorial videos,
look at Kate Gregory's [Learn to Program with C++](https://www.pluralsight.com/courses/learn-program-cplusplus).
If you join the [#include<c++> discord server](https://www.includecpp.org/discord/),
You can also message her there to get a trial code.

## What if I already learned some C++ before and want to delve in deeper?

What if you have some limited C++ experience before?
Maybe you already learned some C++ from your university data structure course,
or perhaps you followed some online tutorials that use C++.
From my personal experiences and what I heard,
most university programming courses or those online tutorials teach problematic practices, and the instructors often do not have a good grasp of the language.
Thus, "learn from the best materials" is especially important for you to offset prior misconceptions on C++.

For books, I will still recommend either Bjarne Stroustrup's ["Programming: Principles and Practice Using C++ 2nd edition"](https://www.amazon.com/Programming-Principles-Practice-Using-2nd/dp/0321992784).
And for video tutorials, you can try Kate Gregory's [C++ Fundamentals Including C++ 17](https://www.pluralsight.com/courses/cplusplus-fundamentals-c17).

## What if I am a veteran in another language and want to delve into C++?

If you are already a proficient programmer in some other languages and want to delve into C++,
you can choose materials with faster pace.

As for book recommendations,
Bjarne Stroustrup's ["The C++ Programming Language (4th Edition)"](https://www.stroustrup.com/4th.html) was one of the best-written books I ever read,
though do notice that this book was written with C++11 and misses some of the later developments.
The book is also very thick, so if you want a shorter introduction, try ["A Tour of C++ (Second edition)"](https://www.stroustrup.com/tour2.html).

## I think that I have a decent grasp of C++. What's next?

So you spend months with the above materials,
and feel that you have a decent grasp of basic C++ concepts.

<aside style="margin-top: -40px;">

For experienced C++ folks, no, I am not talking about _that [concept](https://en.cppreference.com/w/cpp/language/constraints)_ 😃.

</aside>

A sanity check to make sure about your understanding of C++ is whether you are familiar with the following topics,
to name a few:

- how to use `const`
- templates
- references and pointers
- usage of the standard library, in particular, iterators and algorithms
- [RAII](https://en.cppreference.com/w/cpp/language/raii)
- destructor
- copy and move constructor and assignment
- move semantics
- operator overloading
- [lambda expressions and function objects](c++-lambda)
- undefined behaviors

Now it is time to put C++ into practical usage.
C++ is used for diverse purposes,
and using C++ in specific areas is probably more critical than the C++ language itself.
It is perhaps also a good time to spend some time on the broader C++ ecosystems, like testing libraries such as [Catch2](https://github.com/catchorg/Catch2), build system generators such as [CMake](https://cmake.org/), and package managers such as [Conan](https://conan.io/) or [vcpkg](https://github.com/microsoft/vcpkg).

Another thing to consider is to start learning another programming language,
especially for folks who only know C++ at this point.
Good next languages to pick are those very different from C++,
for example,
dynamically-typed languages such as Javascript, Python, or a Lisp dialect.

That being said, there is still _a lot_ to learn about the C++ language itself. And I will try to list some resources that are still relative up-to-date and I enjoyed:

### Books

If you haven't read ["The C++ Programming Language (4th Edition)"](https://www.stroustrup.com/4th.html), I would still recommend it. And here is a bunch of other books I would like to recommend:

- ["Effective Modern C++"](https://www.amazon.com/Effective-Modern-Specific-Ways-Improve/dp/1491903996) by Scott Mayer
- ["C++ Best Practices"](https://leanpub.com/cppbestpractices) by Jason Turner
- ["C++17 - The Complete Guide"](http://www.cppstd17.com/) by Nicolai M. Josuttis

Some books focus on specific areas of the language, such as:

- ["C++ Templates - The Complete Guide, 2nd Edition"](http://www.tmplbook.com/) by David Vandevoorde, Nicolai M. Josuttis, and Douglas Gregor
- ["Mastering the C++17 STL"](https://www.amazon.com/Mastering-17-STL-standard-components/dp/178712682X) by Arthur O'Dwyer
- ["Functional Programming in C++"](https://www.manning.com/books/functional-programming-in-c-plus-plus) by Ivan Čukić
- ["C++ Concurrency in Action, 2nd edition"](https://www.manning.com/books/c-plus-plus-concurrency-in-action-second-edition) by Anthony Williams

### Conference Videos

Conference videos are also an excellent resource to learn more about C++. They focus on a diversity of topics; many of them are hard to find in books. And they also require low commitment (just spend an hour lunchtime watching some videos)

Here are some of my favorites that are also beginner-friendly:

- [CppCon 2019: Kate Gregory "Naming is Hard: Let's Do Better"](https://www.youtube.com/watch?v=MBRoCdtZOYg)
- [CppCon 2018: Kate Gregory "Simplicity: Not Just For Beginners"](https://www.youtube.com/watch?v=n0Ak6xtVXno)
- [CppCon 2017: Kate Gregory "10 Core Guidelines You Need to Start Using Now"](https://youtu.be/XkDEzfpdcSg)
- [CppCon 2017: Matt Godbolt "What Has My Compiler Done for Me Lately? Unbolting the Compiler's Lid"](https://www.youtube.com/watch?v=bSkpMdDe4g4)
- [Going Native 2013: Sean Parent "C++ Seasoning"](https://channel9.msdn.com/Events/GoingNative/2013/Cpp-Seasoning)
- [CppCon 2014: Herb Sutter "Back to the Basics! Essentials of Modern C++ Style"](https://youtu.be/xnqTKD8uD64)
- [CppCon 2015: Bjarne Stroustrup “Writing Good C++14”](https://youtu.be/1OEu9C51K2A)
- [CppCon 2018: Jason Turner "Applied Best Practices"](https://youtu.be/DHOlsEd0eDE)
- [CppCon 2017: Jason Turner “Practical C++17”](https://youtu.be/nnY4e4faNp0)

### Communities

Many people in the C++ community, and I am always willing to answer direct messaging questions. However, I, or most people you can contact online, have limited experiences.

To utilize the best wisdom of people,
you need to join programming communities,
and then you can ask questions in public and get a response from multiple people. [^2]

[^2]: Asking questions online is an art, and a poorly phrased question makes people don't know how to respond. Further, people are often too polite to point out that a question is poorly phrased. Kate Gregory's [How to ask for C++ coding help](http://www.gregcons.com/KateBlog/HowToAskForCCodingHelp.aspx) is an excellent read on how to ask for help online.

Being active in programming communities also has numerous other benefits, including getting job information and having more social support.

#### #include<C++>

[#include<C++>](https://www.includecpp.org/) is a wonderful community to join.
Its mission includes providing conference scholarship to people in need,
but for most people,
you can join [its discord server](https://www.includecpp.org/discord/) to hang out and talk about C++.

#### Local Meetups

Joining [North Denver Metro C++ Meetup](https://www.meetup.com/North-Denver-Metro-C-Meetup/) was one of the best decisions for me during my college years.
I understand that it is a hard time to pop into meetups at the time of writing since most of them are currently held online.
Nevertheless, I urge you to try to attend some meetups if you have time.
Online meetings also provide some advantages compare to physical ones.
For example, they require low commitment, and you can choose from all of those meetups worldwide.

#### Attending Conferences

If you are serious about C++, then conferences are great places to meet like-minded people.
There are C++ conferences around the globe.

Same as meetups, one difficulty at the time of writing is that most C++ conferences are hosted online, but they are still worthwhile to consider.
Here are some of the recurring C++ conferences or conferences that heavily feature C++, with their Twitter handle and Youtube Channel:

- [CppCon](https://cppcon.org/) ([@CppCon](https://twitter.com/CppCon)) [[Youtube](https://www.youtube.com/user/CppCon)] (U.S.-based)
- [C++Now](https://cppnow.org/) ([@cppnow](https://twitter.com/cppnow)) [[Youtube](https://www.youtube.com/user/BoostCon)] (U.S.-based, tuned toward a more advanced audience)
- [ACCU](https://accu.org/conf-main/main/) ([@ACCUConf](https://twitter.com/ACCUConf)) [[Youtube](https://www.youtube.com/channel/UCJhay24LTpO1s4bIZxuIqKw)] (UK-based, different programming languages, but has a lot of C++ contents)
- [Meeting C++](https://meetingcpp.com/) ([@meetingcpp](https://twitter.com/meetingcpp)) [[Youtube](https://www.youtube.com/user/MeetingCPP)] (German-based)
- [emBO++](https://www.embo.io) ([@emBO++](https://twitter.com/emboconference)) [[Youtube](https://www.youtube.com/channel/UCg2JbpJ-PGdFUEZEiNr0GWg)] (German-based)
- [Pacific++](https://pacificplusplus.com/) ([@pacificplusplus](https://twitter.com/pacificplusplus)) [[Youtube](https://www.youtube.com/channel/UCrRR5mU5aqvtZAuEGYfdTjw)] (Australia-based)
- [C++ on Sea](https://cpponsea.uk/) ([@cpponsea](https://twitter.com/cpponsea)) [[Youtube](https://www.youtube.com/channel/UCAczr0j6ZuiVaiGFZ4qxApw)] (UK-based)
- [Core C++](https://corecpp.org/) ([@corecpp](https://twitter.com/corecpp)) [[Youtube](https://www.youtube.com/channel/UCE14XYFaK1fDTnOTqlOFrrQ)] (Israel-based)
- [Code::Dive](http://www.codedive.pl) ([@code_dive_pl](https://twitter.com/code_dive_pl)) [[Youtube](https://www.youtube.com/channel/UCU0Rt8VHO5-YNQXwIjkf-1g/videos)] (Poland-based)
- [Code Europe](https://www.codeeurope.pl/) ([@code_europe](https://twitter.com/code_europe)) [[Youtube](https://www.youtube.com/channel/UChdVVEAilVHULlycMbqRpdg/)] (Poland-based, different programming languages)
- [NDC Conferences](http://ndcconferences.com/) ([@NDC_Conferences](https://twitter.com/ndc_conferences)) [[Youtube](https://www.youtube.com/channel/UCTdw38Cw6jcm0atBPA39a0Q/)] (Multiple locations, different programming languages) [^3]

[^3]: Some of the links above are collected from [shafik/cpp_youtube_channels](https://github.com/shafik/cpp_youtube_channels/blob/master/README.md)

There is [a list of conferences](https://isocpp.org/wiki/faq/conferences-worldwide) on the ISO C++ website.

#### Listening to Podcasts

There are a bunch of C++ podcasts, including a few new ones appeared in 2020:

- [CppCast](https://www.cppcast.com/)
- [cpp.chat](https://cpp.chat/)
- [TLB Hit](https://tlbh.it/)
- [ADSP: The Podcast](https://adspthepodcast.com/)
- [No Diagnostic Required](https://nodiagnosticrequired.tv/)
- [Two's Complement](https://www.twoscomplement.org/)

#### Following Blogs

I use RSS to keep track of the tech blogs,
and I highly recommend you try out RSS too.

I follow hundreds of blogs [^4], including C++ and various other topics.
Here are some of the best C++ ones that pops into my head:

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

<aside style="margin-top: -540px;">

This blog also has an [RSS feed](https://lesleylai.info/rss.xml).

</aside>

[^4]: If you want to see all the blogs I follow, visit [this gist](https://gist.github.com/LesleyLai/549f45fb0dfdf6ab31e6ffadaeaddb10).

Do notice that blogs sometimes can talk about very advanced topics.

#### Twitter

It is your personal preference on whether to join Twitter or not.
On the one hand, Twitter is a great platform to directly communicate with the programming communities and know what other people are up to.
And personally, Twitter is the platform that I know so many exciting developers worldwide.
On the other hand, Twitter has its downside with all the procrastinating and doomscrolling.
Some tweets you see can also make you upset.
My suggestion is to try Twitter out at least, and you can quit if it doesn't work for you.

If you are new to the C++ Twitterverse, [Shafik Yaghmour](https://twitter.com/shafikyaghmour) has a [list of C++ developers](https://twitter.com/i/lists/866902696053231616) and you can use it as a starting point to find people to follow.

### Misc resources

Here are some misc resources that are also worth mentioning.
Some of those are great online tools, while others are video series.

- [cppreference](http://en.cppreference.com/w/) should be your go-to site for C++ language and standard library reference, and it is usually a lot more accurate and up-to-date than its alternatives.
- [Compiler Explorer](https://compiler-explorer.com/) is an online coding environment that supports C++ and a dozen other languages. It can show the compiled assembly of your program and run your program. Unlike most online C++ coding environments, which often ship with an outdated compiler, there are many compilers to choose from in compiler explorer, including the most cutting-edge ones.
- [Quick C++ benchmark](https://quick-bench.com/) is an online tool to perform quick benchmarks on C++.
- [C++ Insights](https://cppinsights.io/) is an invaluable tool to show how compilers translation "syntactic sugar" such as lambda expressions and range-based for-loop behind the scenes. I used it in my [C++ lambda tutorial](/en/c++-lambda) post.
- [C++ Tips of the week](https://abseil.io/tips/)
- [Kate Gregory's STL Algorithms course](https://www.pluralsight.com/courses/beautiful-cplusplus-stl-algorithms) is a great resource to learn more about and appreciate C++ standard algorithms.
- [C++ Weekly](https://www.youtube.com/channel/UCxHAlbZQNFU2LgEtiqd2Maw) is a Youtube channel on various C++ topics, posted weekly.

## References and further reading

- _"SG20 Education And Recommended Videos For Teaching C++". Christopher Di Bella_, 2021, https://www.cjdb.com.au/sg20-and-videos. Accessed 15 Jan 2021.
- _"References And Links". #Include ＜ C++＞_, 2021, https://www.includecpp.org/resources/references/. Accessed 16 Jan 2021.
- Yaghmour, Shafik. _"Where To Get Started Learing C++ And What Resources To Use". Shafik Yaghmour's Blog_, 2019, https://shafik.github.io/c++/learning/2019/09/05/getting_started_learning_cpp.html. Accessed 16 Jan 2021.
