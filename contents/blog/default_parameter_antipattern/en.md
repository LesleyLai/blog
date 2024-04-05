---
id: default-parameter-antipattern
title: "Using default parameters to circumvent the type system is an anti-pattern"
lang: en
created: "2021-02-26"
modified: "2021-02-26"
tags:
  - code
  - java
  - oop
  - opinion
---

I am doing some peer programming for a university course project today.
In our codebase, we have a `Ship` class like the following:

<!-- end -->

```java
public class Ship {
    private final String name;
    private final int length;
    private int hitCount = 0;

    public Ship(String name, int length) {
        this.name = name;
        this.length = length;
    }

    // other methods
    ...
}
```

Later, the new requirement of the course project requires us to add another field, what we called `captainsQuertersHealth`, to the class,
so we made the following change:

```java
public class Ship {
    private final String name;
    private final int length;
    private int hitCount = 0;
    // highlight-start
    private final int captainsQuertersHealth;
    // highlight-end

    // highlight-start
    public Ship(String name, int length, int captainsQuertersHealth) {
    // highlight-end
        this.name = name;
        this.length = length;
        // highlight-start
        this.captainsQuertersHealth captainsQuertersHealth;
        // highlight-end
    }

    // other methods
    ...
}
```

However, we had tons of unit tests that test against the old interface and they don't care about the `captainsQuertersHealth` field.
My partner suggested adding a default parameter.
Since the course project is in Java, which doesn't support default parameters by default, he recommends adding an overloaded constructor:

```java
public Ship(String name, int length) {
  this(name, length, 1);
}
```

This constructor delegates to the previous constructor and always default `captainsQuertersHealth` to one.
It is certainly convenient.
However, adding this constructor means that the compiler will not be able to generate a compile-time error at places where we use this constructor,
and at those places, we do care about `captainsQuertersHealth`.
As a result, it would postpone a compiler catchable bug to runtime.

I convinced my teammate that it was a bad idea.
And our final solution was to add a helper in unit tests:

```java
private Ship createShip(String name, int length) {
  return new Ship(new, length, 1);
}
```

I am not saying that you shouldn't use default parameters or function overloading, but do notice their shortcoming and use them judiciously.
