import {Sudoku} from "./lib/Sudoku";

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
let sudoku: Sudoku = Sudoku.createSudokuByString(sudokuString);
console.log(sudoku.toString());