---
id: reversi-elm
name: "Elm黑白棋"
lang: zh
image: reversi
create: '2018-02-24'
lastModify: '2019-04-08'
github: https://github.com/LesleyLai/Reversi-Elm-V2
demo: https://lesleylai.github.io/Reversi-Elm-V2/
categories:
- ai
- elm
- game
- web
- functional
---

Reversi-Elm是一个用[Elm语言](https://elm-lang.org/)写的基于浏览器的黑白棋游戏实现。
它支持单机双人游戏、人机对战、以及AI对战AI模拟。
该游戏的AI实现基于极小化极大算法（minimax）以及Alpha-beta剪枝，
以及一个基于棋子个数、各棋子位置、以及行动力（玩家可选的合法行动数）的评价函数（evaluation function）。
