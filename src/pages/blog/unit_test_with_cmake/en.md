---
id: unit-test-with-cmake
title: "Integrate unit test framework in cmake" 
lang: en
create: '2016-05-13'
lastModify: '2016-05-13'
categories:
- cmake
- test
---


The directory structure of the project source files will include two parts: the sources (in `src` subfolder) and tests (in `test` subfolder). I have used [CMake](https://cmake.org/) to build this; if you have never used cmake before and do not wish to use it, just press `Ctrl/Cmd+W`.

The test framework I chose is [Catch](https://github.com/philsquared/Catch). However, the process of using different frameworks like CppUnit, Boost Test Library, or googletest should be very similar.

Firstly, I added all the source code except `main.cpp` into a library called `CommonSourceCode` and linked it by both the production program and the test.

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

Notice the inclusion of `PARENT_SCOPE` because I did not build the executable in this folder.

I then used the script from Catch's [document](https://github.com/philsquared/Catch/blob/master/docs/build-systems.md) to automatically fetch it from github and configured it as an [external project](https://cmake.org/cmake/help/v3.4/module/ExternalProject.html):

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

I have omitted part contents, such as c++11 support, in my CMakeFiles since they are irrelevant here.
