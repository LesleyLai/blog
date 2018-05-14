---
id: unit-test-with-cmake
title: "Integrate a unit test framework in cmake"
lang: en
create: '2016-05-13'
lastModify: '2018-05-13'
categories:
- cmake
- C++
- test
---

Automatic tests are ubiquitous in software industry these days. Especially to large-scale software, it is necessary to have a set of test to ensure the specification is fulfilled and to prevent regression bugs. In this post, I will not bore you with why we do test. Instead, if you are using the [CMake](https://cmake.org/) build system, I will show you how easy it is to integrate test into the system.

In this tutorial, my directory structure includes two parts: the sources (in `src` subfolder) and tests (in `test` subfolder).

The test framework I chose is [Catch2](https://github.com/philsquared/Catch). However, the process of using different frameworks like CppUnit, Boost Test Library, doctest, or googletest should be very similar.

# Setup
Firstly, I added all the source code except `main.cpp` into a library called `common` and linked it by both the production program and the test.

`./CMakeLists.txt`

```cmake
cmake_minimum_required (VERSION 2.8) 
project (MyAwesomeProject) 

...

add_subdirectory (src)

...

add_executable(MyAwesomeProject src/main.cpp)
target_link_libraries (MyAwesomeProject common)

add_subdirectory (test)
```

`src/CMakeLists.txt`

```cmake
add_library (common a.hpp a.cpp b.hpp)
```

# Configure test framework

We can create a `test/CMakeLists.txt` that deals with testing stuff. You can then put the unit test library into your repository. Since Catch is a header-only library, we can use CMake's [interface library](https://cmake.org/cmake/help/latest/command/add_library.html#interface-libraries) to handle it. For libraries like googletest, just link it as a normal library.

``` cmake
# Add catch as an interface library
set(CATCH_INCLUDE_DIR <WHERE YOUR Catch.hpp is>)
add_library(Catch INTERFACE)
target_include_directories(Catch INTERFACE ${CATCH_INCLUDE_DIR})

# Add test executable
add_executable (tests testmain.cpp testA.cpp testB.cpp)
target_link_libraries(tests Catch CommonSourceCode)
```

## An alternative: CMake external project

An (unrecommended) alternative is to fetch the test framework from GitHub automatically and configured it as a CMake [external project](https://cmake.org/cmake/help/latest/module/ExternalProject.html). This way you do not need to worry about updating the test framework to its latest version. Do aware this way you cannot compile the code without Internet connection since whenever CMake runs it will try to fetch your unit test framework online.

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

# Add catch as an interface library
add_library(Catch INTERFACE)
target_include_directories(Catch INTERFACE ${CATCH_INCLUDE_DIR})

# Add test executable
add_executable (tests testmain.cpp testA.cpp testB.cpp)
target_link_libraries(tests Catch CommonSourceCode)
```

## `ctest` support
Now we can run the test program manually by executing the test executable. We can even configure our IDE to run the test excutable whenever we compile.

Still, we can do better. [CTest](https://cmake.org/cmake/help/latest/manual/ctest.1.html) is the test driver program that CMake provides. To enable `ctest`, we need CMake to realize our `tests` executable is for tests.

``` cmake
add_test(NAME tests COMMAND tests)
enable_testing()
```

To enable `CTest`, add the following line into the top level CMakeLists file after we define the project.

``` cmake
include(CTest)
```

## Package managers
If your project use package managers like [Conan](https://conan.io/) or [hunter](https://docs.hunter.sh/en/latest/index.html), integrating unit test frameworks should be brainless. However, the idea of making a test executable alongside the main one still apply.

# Conclusion
CMake is a widely accepted cross-platform build tool across the industry. Adding unit test and other supporting tools like [CI](https://en.wikipedia.org/wiki/Continuous_integration) and [static analysers](https://en.wikipedia.org/wiki/Static_program_analysis) to it is incredibly easy.

If you are still using IDE specific configurations or good old Makefiles for C or C++ projects, I will suggest you spend several hours learning how to use CMake. It will be a production boost.
