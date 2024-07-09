---
id: raii
title: "不要发明自己的资源管理策略"
lang: zh
created: "2016-10-26"
modified: "2016-10-26"
tags:
  - cpp
  - code
  - opinion
---

最近，我在工作时遇到了一批旧代码，其中有几个巨大的类。它们是以类似这样的写法写的：

```cpp
class ExtnlOutData
{
public:
    int phase;
    int* phaseIdx;
    char** phaseNames;
    ...

    ExtnlDLLData() : phaseIdx(NULL), phaseNames(NULL) {}

    ~ExtnlDLLData()
    {
        if (phaseIdx) {
            delete[] phaseIdx;
            phaseIdx = NULL;
        }

        if (phaseNames) {
            for (int i = 0; i != phase; ++i) {
                if (phaseNames[i]) delete[] phaseNames[i];
            delete[] phaseNames;
            phaseNames = NULL;
        }
    }
}
```

这个示范比实际的类小很多，但我们已经可以从不同的角度来批评它了。比如说这个类的复制操作是违反直觉的浅拷贝。

不过在这里，我想关注“DLL”的部分。这个类是作为我们软件插件的接口而设计的，我们这么用它：

```cpp
void calculate ()
{
    ExtnlOutData data;
    extnlDllCalculate(&data);

    // Do something about data
}
```

看出问题了吗？我们现在必须用与当年编译动态库插件同样的编译器来编译这段代码（我们当时用的是 Visual Studio 2008，但对现在来说它太老了）。原因是因为我们在 DLL 内分配内存，却在 DLL 外销毁内存。不同的编译器可能会调用不同的函数来管理内存，导致 data 的析构函数崩溃。这个情况和我们混用`malloc()`与`delete`是一样的，无非是难以发现得多罢了。

# 更多例子

很多设计地很好的代码库也存在同样的问题。[Qt 库](http://www.qt-project.org)的父子关系和之前展示的代码的内存管理策略事实上是一样的。如果你用过 Qt,你肯定写过类似这样的代码：

```cpp
void foo(QString name, QFont font)
{
    // 这不是真正的Ot代码
    QTabWidget parent;
    auto child = new QWidget;
    parent.addTab(child);
    child.setName(name);
    child.setFont(font);
} // parent的析构函数负责销毁child
```

因此,和多数库不同，Qt 不能被链接到不是同一个编译器编译的程序上。比如说 QT 5.7.0 for windows 64 二进制包就发布了三个不同的版本（VS 2015/VS 2013/MinGW）来对应不同的编译器。我们必须用相应的编译器来开发 Qt 程序。

如果你的程序只在 POSIX 平台下运行，你可能觉得这不关你的事。不过我还有另外与你们也有关的一点要讲:这些混乱的资源管理策略很难做到异常安全。考虑一下如果 `setName` 或者 `setFont` 抛出异常会发生什么？外部程序员看似很无辜地顺序改动也会造成泄漏：

```cpp
child.setName(name);
child.setFont(font);
// 如果上面抛出了异常，child永远不会被释放
parent.addTab(child);
```

难怪类似于 Qt 这样的设计于很久以前的代码库倾向于全项目禁止使用异常。但库作者仍然无法阻止外部程序员这么做：

```cpp
child.setName(name);
child.setFont(font);
if (!child.valid()) throw Exception{"Invalid tab"}; // 可能造成泄漏
parent.addTab(child);
```

# RAII 来解决这种问题

在标题中，我已经劝阻你们发明自己的资源管理策略，因为 c++已经有标准的资源管理方式[RAII](https://en.wikipedia.org/wiki/Resource_acquisition_is_initialization)。RAII 可以轻易根除上面的泄漏或者不匹配的系统函数这种问题。第一个例子可以被这样从新设计：

```cpp
struct PhaseData
{
    int ID;
    std::string name;
}

class ExternalOutData
{
public:
    ...

private:
    std::vector<PhaseData> data;
    ...
}
```

而如果你要设计一个新的 GUI 库的话，你可以把你的接口设计成这么使用：

```cpp
void foo(MyString name, MyFont font)
{
    MyTabWidget parent;
    auto child = std::make_unique(MyWidget);
    child.setName(name);
    child.setFont(font);
    parent.addTab(std::move(child));
} // The distructor of parent will destory child
```

这个版本使用起来略显罗嗦，不过它有和 Qt 一样的用法而没有 Qt 的问题。
