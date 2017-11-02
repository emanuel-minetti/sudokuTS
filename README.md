# SudokuTS
SudokuTS is a [TypeScript](https://www.typescriptlang.org/) implementation of the well-known
[Sudoku](https://en.wikipedia.org/wiki/Sudoku) game. It is planned to develop
a fully functional solver, that is a solver that tries to solve a sudoku puzzle
like a human would do it. The Solver is heavily based on the strategies described
 by Andrew Stuart in his [SudokuWiki](http://www.sudokuwiki.org/sudoku.htm).
 Then a back tracer that finds every possible solution
of a potential puzzle will be implemented. And eventually a generator of sudoku puzzles follows.
The generator
will be able to categorize puzzles in difficulty rates.
It is also planned to add a Browser-based GUI.

## Building
In order to build the SudokuTS, ensure that you have [Git](https://git-scm.com/downloads)
and [Node.js](https://nodejs.org/) (including [NPM](https://www.npmjs.com/)) installed.

Clone a copy of the repo:
    
    git clone https://github.com/emanuel-minetti/sudokuTS.git
Change into the sudokuTS directory:

    cd sudokuTS/
Install dependencies:

    npm install
Compile TypeScript (ignore potential error messages):    

    node node_modules/typescript/bin/tsc
Test installation:

    node src/sudoku_cli.js -h
should print a help text.





## ToDo List
- Improve the solver
- Implement the backtracker
- Implement the generator
- Implement the GUI
