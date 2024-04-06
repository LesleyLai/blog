---
name: "Reversi Elm"
image: reversi
created: "2018-02-24"
modified: "2019-04-08"
github: https://github.com/LesleyLai/Reversi-Elm-V2
demo: https://lesleylai.github.io/Reversi-Elm-V2/
tags:
  - ai
  - elm
  - game
  - web
  - functional
---

Reversi-Elm is a browser-based clone of the classic board game [Reversi](https://en.wikipedia.org/wiki/Reversi) in the [Elm Programming Language](https://elm-lang.org/).
It supports both human vs. human games, human vs. computer games, and computer vs. computer games.
The AI agent is built based on the [minimax](https://en.wikipedia.org/wiki/Minimax) algorithm with [alpha-beta pruning](https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning).
It also uses a simple [evaluation function](https://en.wikipedia.org/wiki/Evaluation_function) which bases on piece count, location of pieces, and mobility (number of legal moves).
