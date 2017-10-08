import {SudokuGame} from "./lib/game/SudokuGame";
import {Solver} from "./lib/solver/Solver";
import {SudokuCli} from "./lib/cli/SudokuCli";

try {
    let options = SudokuCli.parseArguments(process.argv);
    let sudokuString = options.sudokuString;

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
    console.log('Game:\n' + game.toString());
}
catch (e) {
    console.log(e.message);
    console.log(SudokuCli.printHelp());
}
