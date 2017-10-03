import {SudokuGame} from "./lib/game/SudokuGame";
import {Solver} from "./lib/solver/Solver";
import {SudokuCli, SudokuCliOptions} from "./lib/cli/SudokuCli";
import {log} from "util";

let options = SudokuCli.parseArguments(process.argv);
let sudokuString = options.sudokuString;

console.log('SudokuString: ' + sudokuString);
console.log('File: ' + options.file);
console.log('Help: ' + options.help);
console.log('Solver: ' + options.solver);
console.log('Backtracker: ' + options.backtrack);
console.log('Version: ' + options.version);

if (options.help) {
  console.log(SudokuCli.printHelp());
};

if (options.version) {
    console.log(SudokuCli.printVersion());
};

let game = new SudokuGame(sudokuString);
let solver = new Solver(game);
solver.addStandardRules();
solver.solve();

console.log('Moves:\n' + game.getChangesString());
console.log('\nRating: ' + game.getRating());
console.log('\nSolved: ' + game.isSolved());
console.log('\nCurrent state: ' + game.getCurrentState().toString());