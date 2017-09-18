import {Sudoku} from "./lib/Sudoku";

console.log('Hello from sudoko_cli!');

let sudokuString =
    '300 000 000 \n' +
    '970 010 000 \n' +
    '600 583 000 \n' +
    '            \n' +
    '200 000 900 \n' +
    '500 621 003 \n' +
    '008 000 005 \n' +
    '            \n' +
    '000 435 002 \n' +
    '000 090 056 \n' +
    '000 000 001';
let sudoku: Sudoku = Sudoku.createSudokuByString(sudokuString);
console.log(sudoku.toString());