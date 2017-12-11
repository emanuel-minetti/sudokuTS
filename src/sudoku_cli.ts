import {SudokuGame} from "./lib/game/SudokuGame";
import {Solver} from "./lib/solver/Solver";
import {SudokuCli} from "./lib/cli/SudokuCli";
import {DLX} from "./lib/backtracker/DLX";
import {SimpleResultHandler} from "./lib/backtracker/DLXHelpers";
import {Backtracker} from "./lib/backtracker/Backtracker";

try {
    let options = SudokuCli.parseArguments(process.argv);
    let sudokuString = options.sudokuString;

    if (options.help) {
        console.log(SudokuCli.printHelp());
    }
    ;

    if (options.version) {
        console.log(SudokuCli.printVersion());
    }
    ;

    if (sudokuString) {
        if (options.solver) {
            let game = new SudokuGame(sudokuString);
            let solver = new Solver(game);
            solver.addStandardRules();
            solver.solve();
            console.log('Game:\n' + game.toString());
        }
        else {
            let game = new SudokuGame(sudokuString);
            let backtracker = new Backtracker(game);
            backtracker.solve();
            // let resultHandler = new SimpleResultHandler();
            // let dlx = new DLX(
            //     ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
            //     [
            //         [false, false, true, false, true, true, false],
            //         [true, false, false, true, false, false, true],
            //         [false, true, true, false, false, true, false],
            //         [true, false, false, true, false, false, false],
            //         [false, true, false, false, false, false, true],
            //         [false, false, false, true, true, false, true]
            //     ],
            //     resultHandler
            // );
            // dlx.solve();
            // console.log(resultHandler.getResult());
        }
    }
}
catch (e) {
    console.log(e.message);
    console.log(SudokuCli.printHelp());
}
