---
id: eml
name: "Embedded ML"
lang: en
create: '2018-09-14'
github: https://github.com/LesleyLai/eml
image: eml
categories:
- cpp
- pl
- functional
---

Embedded ML is a static-typed embedded scripting language written in C++.
The Embedded ML language is inspired by languages from the [ML family](https://en.wikipedia.org/wiki/ML_(programming_language)).
This project includes a compiler and a bytecode [stack-machine](https://en.wikipedia.org/wiki/Stack_machine) runtime. The compiler first parses the source code by a hand-rolled a recursive-descent [pratt parser](https://en.wikipedia.org/wiki/Operator-precedence_parser#Pratt_parsing) and then pipes the result AST (abstract syntax tree) into type checker and code generator. Afterward, the runtime executes the bytecode generated by the code generator.
