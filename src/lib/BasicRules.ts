import {SolverRule} from "./Solver";
import {SudokuStateChange} from "./SudokuGame";

let rules: SolverRule[] = [];

rules.push(new SolverRule('last candidate', 0.5, (dryRun => {
    //TODO rethink architecture
    //TODO implement
    return [new SudokuStateChange(1, 2,)];
})));