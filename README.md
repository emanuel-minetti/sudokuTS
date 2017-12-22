# SudokuTS
SudokuTS is a [TypeScript](https://www.typescriptlang.org/) implementation of the well-known
[Sudoku](https://en.wikipedia.org/wiki/Sudoku) game. It includes  a fully functional solver,
that is a solver that tries to solve a sudoku puzzle
like an human would do it. The Solver is heavily based on the strategies described
 by Andrew Stuart in his [SudokuWiki](http://www.sudokuwiki.org/sudoku.htm).
Also a backtracking solver, called "Backtracker", is implemented. A modification to
 this backtracker, that finds a single solution
to a potential puzzle will be implemented soon.
And eventually a generator of sudoku puzzles will follow.
The generator will be able to categorize puzzles in difficulty levels.
It is also planned to add a Browser-based GUI.

## Building
In order to build the SudokuTS, ensure that you have [Git](https://git-scm.com/downloads)
and [Node.js](https://nodejs.org/) (including [NPM](https://www.npmjs.com/)) installed.

Clone a copy of the repo:
    
    git clone https://github.com/emanuel-minetti/sudokuTS.git
Change into the sudokuTS directory:

    cd sudokuTS/
Install dependencies and compile TypeScript:    

    npm install
Test installation:

    node src/sudoku_cli.js -h
should print a help text.

## Usage

Included in the repo are a lot of example sudoku. The examples can be run like so:

    node src/sudoku_cli.js -s --file examples/y_wing.txt
    
## Coding principles

Principles include:
 - DRY (Don't repeat yourself)
 - Use JavaScript's functional programming wherever it helps making the code more readable 
 - KISS ("Keep it simple, stupid")
 - SOLID principles should be observed

## Contribution
Fell free to report any found bugs, problems or feature requests on the
[Issues](https://github.com/emanuel-minetti/sudokuTS/issues) page.

If you like to get involved in coding, it would be best you'll write an [e-mail](mailto:e.minetti@posteo.de). 


## ToDo List
- Improve the backtracker
- Implement the generator
- Implement the GUI
- Improve the solver
