---
id: unit-test-with-cmake
title: "如何在cmake中嵌入单元测试框架"
lang: zh
created: "2016-05-14"
modified: "2016-05-14"
tags:
  - cmake
  - code
  - cpp
  - test
---

工程的目录结构会有两部分：源文件（在 `src` 子文件夹中）以及测试(在 `test` 子文件夹中)。我使用[CMake](https://cmake.org/)来构建这个工程。如果您从没用使用过 cmake 并且不打算在近期使用它，请直接按 `Ctrl/Cmd+W` 。

我选择的测试框架是[Catch](https://github.com/philsquared/Catch)，不过选择其他诸如 CppUnit、Boost Test Library、googletest 的框架的流程应该差不多。

首先， 我把除了 `main.cpp` 以外的所有源代码构建到一个叫做 `CommonSourceCode` 的库中，并且同时在主程序和测试程序中链接这个库。

CMakeLists.txt

```cmake
cmake_minimum_required (VERSION 2.8)
project (MyAwesomeProject)

...

add_subdirectory (src)

...

add_library (CommonSourceCode ${SRC_LIST})
add_executable(MyAwesomeProject src/main.cpp)
target_link_libraries (MyAwesomeProject CommonSourceCode)

add_subdirectory (test)
```

src/CMakeLists.txt

```cmake
set(SRC_LIST ${SRC_LIST} a.hpp a.cpp b.hpp PARENT_SCOPE)
```

注意这里我加入的 `PARENT_SCOPE` ，因为我没有打算在这个目录构建可执行程序。

我使用 Catch 的[文档](https://github.com/philsquared/Catch/blob/master/docs/build-systems.md)中的脚本来自动从 github 上获取我使用 Catch，并把它设置成一个[external project](https://cmake.org/cmake/help/v3.4/module/ExternalProject.html)：

test/CMakeLists.txt

```cmake
include(ExternalProject)
find_package(Git REQUIRED)

ExternalProject_Add(
    catch
    PREFIX ${CMAKE_BINARY_DIR}/test/catch
    GIT_REPOSITORY https://github.com/philsquared/Catch.git
    TIMEOUT 10
    UPDATE_COMMAND ${GIT_EXECUTABLE} pull
    CONFIGURE_COMMAND ""
    BUILD_COMMAND ""
    INSTALL_COMMAND ""
    LOG_DOWNLOAD ON
   )

# Expose required variable (CATCH_INCLUDE_DIR) to parent scope
ExternalProject_Get_Property(catch source_dir)
set(CATCH_INCLUDE_DIR ${source_dir}/include CACHE INTERNAL "Path to include folder for Catch")

add_library(Catch INTERFACE)
target_include_directories(Catch INTERFACE ${CATCH_INCLUDE_DIR})

add_executable (Test testmain.cpp testA.cpp testB.cpp)
target_link_libraries(Test Catch CommonSourceCode)

add_test (NAME MyTest COMMAND Test)
```

我省略了我的几个 CMakeFile 中包括 c++11 支持在内的部分内容，因为它们和我这里讲的东西没有关系。
