import {SudokuGame} from "./lib/SudokuGame";
import {Solver} from "./lib/Solver";

let sudokuStringArray = process.argv.slice(1);
let sudokuString = sudokuStringArray.join('');
console.log('String: ' + sudokuString)

let game = new SudokuGame(sudokuString);
let solver = new Solver(game);
solver.addStandardRules();
solver.solve();
console.log('Moves:\n' + game.getChangesString());
console.log('\nRating: ' + game.getRating());
console.log('\nSolved: ' + game.isSolved());
console.log('\nCurrent state: ' + game.getCurrentState().toString());