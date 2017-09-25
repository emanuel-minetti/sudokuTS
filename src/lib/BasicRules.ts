import {SolverRule} from "./Solver";
import {SudokuStateChange} from "./SudokuGame";

export class BasicRules {
    rules: SolverRule[];

    constructor() {
        this.rules = [];
        let rule = new SolverRule('last candidate rule ', 0.5, (sudoku) => {
            let moves: SudokuStateChange[] = [];
            let squares = sudoku.getSquares()
            squares.forEach((square) => {
                let candidates = square.getCandidates();
                if (candidates !== null && candidates.length === 1) {
                    moves.push(new SudokuStateChange(square.getIndex(), candidates[0],
                        'in square ' + square.getName()));
                }
            });
            return moves;
        });
        this.rules.push(rule);
    }

    getRules(): SolverRule[] {
        return this.rules;
    }
}
