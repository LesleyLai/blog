---
title: "Don't invent your own resource manage idioms in C++" 
lang: en
create: '2016-10-26'
lastmodify: '2016-10-26'
categories:
- cpp
- resource
---


Recently, I have encountered a legacy code base at work. There are several tremendous class written like this:

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

The real class is much bigger. We can criticize this snippet in multiple ways. For example, the copy-operations will do shallow copy, which is counter-intuitive. And programmers of the dynamic libraries conform this interface need to allocate memory themselves, which is monotonous and error-prone. If we allocate more space to `phaseIdx` than `sizeof(int) * phase`, memory leak happens; if we allocate less space, the program will crash mysteriously.

I want to focus on the "DLL" part today. This class is designed as an interface for customized plug-ins of our software. We use them like this:

```cpp
void calculate ()
{
    ExtnlOutData data;
    extnlDllCalculate(&data);

    // Do something about data
}
```

The problem is that now all parts of our software need to be compiled by the same compiler which builds legacy shared libraries (In our case, it is Visual Studio 2008, which is quite ancient). The reason is that we destroy memory outside the dll while allocate memory inside the dynamic libraries. Since different compilers may call different memory management functions, the program will crash at the destructor of `data`. This situation is like what happens when we combine `malloc()` and `delete`, but it is a lot more insidious.


# Qt library: example

It is surprised to me that some otherwise well-designed code bases suffer similar problem. For instance, the [Qt Library](http://www.qt-project.org)'s parent-child relationship is a similar resource management strategy. If you have used QT, you must have written code like this:

```cpp
// Not real Qt code
void foo(QString name, QFont font)
{
    QTabWidget parent;
    auto child = new QWidget;
    parent.addTab(child);
    child.setName(name);
    child.setFont(font);
} // The distructor of parent will destory child
```

As a consequence, Qt, unlike most libraries, cannot be linked by different compilers than what itself compiled. For example, QT 5.7.0 for windows 64 binaries have three versions (VS 2015, VS 2013, MinGW) to satisfy different compiler users. We must use corresponding compilers to develop Qt application.

# Exception safety problem

If you are programmers develop software solely for POSIX platforms, you may think it is not your business. But I have another point relate to you, too. The point is, those *ad hoc* resource management strategies are innately exception-unsafe. Consider what will happen if `setName` or `setFont` can throw exceptions. An innocuous order change by clients will introduce leak:

```c++
child.setName(name);
child.setFont(font);
// if the above lines throw, the child will never be freed
parent.addTab(child);
```

No wonder old style libraries like QT forbid exceptions for "historical reasons". But the library authors still cannot prohibit clients do something like this:

```c++
child.setName(name);
child.setFont(font);
if (!child.valid()) throw Exception{"Invalid tab"}; // May cause leak
parent.addTab(child);
```


# RAII to rescue

In the title, I discourage you from inventing your own resource management routine. The reason is c++ already have a standard resource management idiom [RAII](https://en.wikipedia.org/wiki/Resource_acquisition_is_initialization). It can easily eradicate problems about leak and unmatched system functions memtioned above. We can redesign the first example like below:

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

As for the GUI example, if you decide to write a new GUI library now, you can design your interface like this:

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

This version is a bit more verbose, but it has the similar usage of Qt, without Qt's problems.
