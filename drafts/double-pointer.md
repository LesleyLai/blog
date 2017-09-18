<div class="HTML">
&#x2014; layout: post title: Usage of pointers to pointers in a linked list implementation lang: en ref: Pointer to Pointer date: 2014-11-01T17:31:26+0800 categories: c cpp pointer &#x2014;

</div>

Some people consider the usage of pointers confusing, not to mention double pointers. However, we can use pointers to pointers to solve some interesting problem. In this post, I will talk about how pointers to pointers provide a better solution of the removing operation in a linked-list.


# Problem

Consider a linked-list:

```c++
template <typename T>
class List<T> {
public:
    ...

    // Removes the first element that are equal to value
    void remove( const T& value );
private:
    struct Node {
        T value;
        Node* next;
    };

    Node* head_;
};
```

Removing a node from the list usually requires a bit of ugly special case handling for removing the very first node, like you see below.

```c++
template <typename T>
void List<T>::remove( const T& value ) {
  if (head_->value == value)
  {
    head_ = head_->next;
    head_->next = nullptr;
    return;
  }

  for (Node* current = head_; current != nullptr; current = current->next_) {
      if (current->next_ == observer)
      {
          current->next_ = observer->next_;
          observer->next_ = NULL;
          return;
      }
  }
}
```

With pointers to pointers, we can do this:

```c++
void List<T>::remove( const T& value ) {
    Node* victim = nullptr;

    for(Node** itr = &toGameFront; *itr != nullptr; itr = &(*itr)->next) {
        if (current->next_ == head_) {
            victim = *itr;

            if (victim->next == nullptr) killer = toGameFront;
            else killer = victim->next;

            *itr = victim->next;
            moveToGrave(victim, killer->name);
            return;
        }
    }

    throw ERROR_NOT_FIND; //Cannot find the victim
}
```
