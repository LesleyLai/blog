---
id: mutable-lambda-in-algorithms
title: "Beware passing mutable lambda to STL algorithms.（暂未翻译）"
lang: zh
create: '2020-09-30'
lastModify: '2020-09-30'
categories:
- cpp
- code
- opinion
---

Recently, I have seen some people passing complex mutable lambdas to standard algorithms.
Those usages usually come from one mindset:
"Since we want to follow 'no raw-loop,'
and the choice of STL algorithms is limited,
what can we do other than using a mutable lambda to hold our complicated logic?"
I think that both premises of this thought are wrong.
First, "no raw-loop" should be treated as an ideal instead of dogma.
Second, even though STL algorithms cannot cover every use case,
we can always write algorithms to fit our needs.


I expressed this thoughts in the following tweet:
<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Random thought: if you want to pass a complicated mutable lambda to a C++ standard algorithm, you are using the wrong algorithm.</p>&mdash; Lesley Lai (@LesleyLai6) <a href="https://twitter.com/LesleyLai6/status/1307897166455648258?ref_src=twsrc%5Etfw">September 21, 2020</a></blockquote>

And this post tries to expend this thought a little bit.

## Mutable Lambdas destroy the beauty of `<algorithms>`

Why we use `<algorithm>`? Is it because it is "elegant" or "modern?"
Or is it because "*Some experts said so*?"
Both are horrible reasons to prefer `<algorithm>` over loops.
For me,
`<algorithm>` provides the following benefits:

- Less mutable states
- Declarative
- Express intent
- Known correct implementation

Mutable lambda destroys all of them.
First, STL algorithms encapsulate mutable states into small functions.
Nevertheless, we only need *mutable* lambda when our algorithm fails to encapsulate all mutable logics.
Second,
since the mutable states and complex control flow are back,
we can no longer call our implementation declarative.
Third,
since we need complicated logic inside a lambda to stretch the algorithm to perform our task,
the algorithm does not express our intent.
Fourth,
since the algorithm does not express our intent,
even though the algorithm itself is correct,
there can still be bugs lure in our own *hard-to-understand* code.

## A LeetCode example

Let's look at the following C++ solution to the [LeetCode Two Sum problem](https://leetcode.com/problems/two-sum/) by [Yacob Cohen-Arazi](https://twitter.com/kobi_ca). The problem is worded as follows: "*Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target.*" and LeetCode provides the type signature of the `twoSum` function that we cannot change.

```cpp
std::vector<int> twoSum(std::vector<int>& nums, int target) {
  int idx1{}, idx2{};
  auto process_and_lookup(
      [m = std::unordered_map<int, int>(),
       i = 0, target, &idx1, &idx2]
      (const auto item) mutable {
        auto iter = m.find(target - item);
        if (iter == cend(m)) {
          m[item] = i++;
          return false;
        }
        idx1 = iter->second;
        idx2 = i;
        return true;
      });

  auto iter = std::find_if(
    cbegin(nums), cend(nums), process_and_lookup);
  assert(iter != cend(nums));
  return {idx1, idx2};
}
```

This version is long, messy, and hard to read.
It also contains five mutable states `m`, `idx1`, `idx2`, `i`, and `target`,
even though `target` is never modified.
Here is the loop version I wrote that are doing essentially the same logic:

```cpp
std::vector<int> twoSum(std::vector<int>& nums, int target) {
  std::unordered_map<int, int> nums_map;

  const int size = static_cast<int>(nums.size());
  for (int i = 0; i < size; ++i) {
    const auto item = nums[i];
    const auto iter = nums_map.find(target - item);
    if (iter != nums_map.end()) {
      return {iter->second, i};
    }
    nums_map.emplace(item, i);
  }
  throw std::runtime_error{"No solution exist"};
}
```

This loop version is shorter, easier to understand, and only contains two mutable states: the map `nums_map` and index `i`.

The `<algorithm>` version lands badly here because `std::find_if` does not match this problem's intent.
`std::find_if` finds a *single* element that matches a predicator,
but our situation requires to find two elements that match a predicator together.
As a result,
it does not provide enough useful functionalities for this problem
but instead serves as an obstacle.
I consider this kind of `<algorithm>` usages instances of the [abstraction inversion](https://en.wikipedia.org/wiki/Abstraction_inversion) anti-pattern,
where the abstraction is so unfit for the task that we start to re-implements the implementation details that our abstractions suppose to hideaway.
This kind of usage makes the code hard to read,
introduces potential non-trivial runtime cost,
and increases the possibility of introducing bugs.
The `<algorithm>` header tries to address all of the adversities,
but by using mutable lambda,
we somehow land us in a situation worse than the loop counterparts of our functions.

## Another Example: Calculates inner product until it satisfies a predicate

[Dima Savin](https://twitter.com/dima_savin) gives me a tricky problem:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Ok, which algorithm should I use to calculate the inner product until it exceeds a value and get the index when it happened? Didn&#39;t find find just the right thing in a table by <a href="https://twitter.com/code_report?ref_src=twsrc%5Etfw">@code_report</a> that doesn&#39;t require a mutable lambda.</p>&mdash; Dima Savin (@dima_savin) <a href="https://twitter.com/dima_savin/status/1307962236346957825?ref_src=twsrc%5Etfw">September 21, 2020</a></blockquote>

This problem is tricky to solve with STL algorithms
since STL algorithms are designed to compose sequentially,
and as we will see in the loop version,
there is multiple interleaved logic during the iteration.

Thus, I will use the loop version as the starting point.
Since Dima does not specify what happens if we didn't find the index,
I return the final result of `i`,
which should be the index of the last element plus one:

```cpp
template <std::input_iterator Itr, std::input_iterator Itr2, class T>
auto inner_product_till(
        Itr first1, Itr last1, Itr2 first2, const T upper_bound)
   -> std::size_t
{
  T acc{};
  std::size_t i = 0;
  for (; first1 != last1; ++first1, ++first2, ++i) {
    acc = std::move(acc) + *first1 * *first2;
    if (acc > upper_bound) { return i; }
  }
  return i;
}
```

This version is certainly not ideal.
It contains four mutable states `first1`, `first2`, `i`, and `acc`.
Nevertheless,
the logic inside the loop is simple,
and every decent C++ programmers should be able to grasp this code
in a relatively short amount of time.

I am satisfied with this version.
Even the person who proposed "no raw loop" ideology in the first place,
[Sean parent](https://sean-parent.stlab.cc/),
will not consider this kind of simple loops that are nicely encapsulated in a function "raw loops."

> A raw loop is any loop inside a function where the function serves purpose larger than the algorithm implemented by the loop — Sean Parent, 2013 [^1]

[^1]: Sean Parent, 2013. C++ Seasoning. Retrieved September 23, 2020, from http://channel9.msdn.com/Events/GoingNative/2013/Cpp-Seasoning

The `std::find` + mutable lambda version, however,
is certainly inferior to the loop version.
This version contains the same amount of mutable states,
and is signaficantly harder to read even for people familiar
with this kind of lambda-heavy style of programming:

```cpp
template <std::input_iterator Itr, std::input_iterator Itr2, class T>
auto inner_product_till(
        Itr first1, Itr last1, Itr2 first2, const T upper_bound)
   -> std::size_t
{
  std::size_t i = 0;
  std::find_if(first1, last1,
              [acc = T{}, first2, upper_bound, &i]
                (const T& elem) mutable {
                  acc = std::move(acc) + elem * *first2;
                  if (acc > upper_bound) return true;
                  ++first2;
                  ++i;
                  return false;
                });
  return i;
}
```

If we step back a little bit and think about what logic we try to achieve here.
We can find two interleaving steps.
First, we need to perform an inner product to the elements we meet so far.
Second, we find whether this calculated inner product is greater than the `upper_bound`.
If we ignore the "interleaving" part,
then we can use `std::transform` and `std::partial_sum` to perform the first step and `std::find_if` to perform the second step:

```cpp
template <std::input_iterator Itr, std::input_iterator Itr2, class T>
auto inner_product_till(
        Itr first1, Itr last1, Itr2 first2, const T upper_bound)
    -> std::size_t
{
  std::vector<T> products;
  std::transform(first1, last1, first2, std::back_inserter(products),
                 std::multiplies<T>{});
  std::partial_sum(products.begin(), products.end(),
                   products.begin());
  const auto result = std::find_if(products.begin(), products.end(),
                      [&](T e) { return e > upper_bound; });
  return std::distance(products.begin(), result);
}
```

This version is the closest to my thought flow,
however, it is also very inefficient
since it allocates extra heap memory and eagerly computes results that we may not need.
Lazy ranges view solves the performance problem,
If ranges have numeric algorithms support,
then we can potentially write the following code:

```cpp
template <std::input_range Range, class T>
auto inner_product_till(Range r1, Range r2, const T upper_bound)
    -> std::size_t
{
  return std::ranges::distance(
    std::view::transform(r1, r2, std::multiplies<T>{})
    | std::view::partial_sum
    | std::view::take_while([&](T e) { return e > upper_bound; }));
  );
}
```

This version is splendid.
It does not allocate and exit early,
so in theory, it can be as efficient as the raw loop version or the mutable lambda version,
and it is certainly much more readable and less error-prone to write than both of them.
Unfortunately, none of the algorithms in the `<numeric>` header is included in the C++20 ranges.
As a result, `std::view::partial_sum` is not a thing at the time of this writing.
Nevertheless, the [range-v3](https://github.com/ericniebler/range-v3) library includes all those functionalities.

## Don't be afraid of writing your own algorithm

Another way to solve this problem is to write your own algorithm.
For example, in the above example,
we can write our own `view::partial_sum` view adapter.

Our algorithm often does not need to be very generic in practice,
as you can always enhance it later when you need to reuse this piece of code.
The starting point of an algorithm can merely be "extracting a loop into a function."[^2]

[^2]: Writing your algorithm is not rocket science, but the more generic an algorithm is, the more factors we need to consider. [Ben Deane](https://twitter.com/ben_deane)'s talk [Constructing Generic Algorithms: Principles and Practice](https://www.youtube.com/watch?v=InMh3JxbiTs) is an excellent resource on this topic.

Also, the interesting thing is that
the above `inner_product_till` is an STL-compatible algorithm.
And we can treat it as one of the lowest levels of abstraction.
If it is well tested, fast, and well behaved, who cares about whether it uses loops or other algorithms under-the-hood?
It is not as generic as `std::inner_product`,
but we can always add initial value and the plus/multiply binary operations as parameters later if we need them.

## What about using mutable lambdas in `std::generate`?

A lot of usages of `std::generate` use mutable lambdas as a "generator" function.
For example, the following code generates the first 20 numbers of
the recurrence relationship $x_0 = 0, x_n = 2x_{n-1} + 1$.

<aside style="margin-top: -40px;">

This recurrence relationship has a simple close form $x_n = 2^n-1$,
though in more complicated problems,
using mutables may be necessary.

</aside>

```cpp
int seq[20];

std::generate(std::begin(seq), std::end(seq),
    [x = 0]() mutable {
        return std::exchange(x, x * 2 + 1);
    });
```

This kind of "generator" usage of `std::generate` and mutable lambdas is common,
and I think, unlike previous examples, they are fine.

There is an advantage of this version compared to using a loop.
Compared to the equivalent loop version,
the scope of the mutable variable `x` is constrained to be in lambda's scope.
And we should strive to make the scope of variables (especially mutable) as small as possible.
Nevertheless, we can surround the loop with explicit brace pair to get a similar effect:

```cpp
int seq[20];

{
  int x = 1;
  for (auto& elem: seq) {
    elem = std::exchange(x, x * 2 + 1);
  }
}
```

## Consider the alternatives over passing mutable lambdas to STL algorithms

To sum everything up, I believe passing mutable lambdas to STL algorithms other than `std::generate` or `std::generate_n` is an anti-pattern that we should try to avoid. There are several alternatives. Sometimes we can switch to a better algorithm. Sometimes using a plain-old loop is the better option. And sometimes, we can write our customized algorithms to achieve the task.
