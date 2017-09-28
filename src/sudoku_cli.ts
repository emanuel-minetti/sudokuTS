import {SudokuGame} from "./lib/SudokuGame";
import {Solver} from "./lib/Solver";

console.log('Hello from sudoku_cli!');

let sudokuString =
    '9** *** *6* \n' +
    '**2 89* *** \n' +
    '1** **5 2** \n' +
    '            \n' +
    '**1 **7 *96 \n' +
    '*** 1*9 *** \n' +
    '35* 4** 8** \n' +
    '            \n' +
    '**3 9** **2 \n' +
    '*** *42 5** \n' +
    '*6* *** **7 \n';

let game = new SudokuGame(sudokuString);
let solver = new Solver(game);
solver.addStandardRules();
solver.solve();
console.log('Moves:\n' + game.getChangesString());
console.log('\nRating: ' + game.getRating());
console.log('\nSolved: ' + game.isSolved());
console.log('\nCurrent state: ' + game.getCurrentState().toString());