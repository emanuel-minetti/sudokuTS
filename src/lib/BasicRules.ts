import {SolverRule} from "./Solver";
import {SudokuStateChange} from "./SudokuGame";
import {Sudoku} from "./Sudoku";
import {Square} from "./Square";
import * as _ from "lodash";

export class BasicRules {
    rules: SolverRule[];

    constructor() {
        this.rules = [];
        let rule: SolverRule;

        rule = new SolverRule('last square free rule ', 0.05, (sudoku) => {
           let moves: SudokuStateChange[] = [];
            let units = sudoku.getUnits();
            units.forEach((unit) => {
                let count = 0;
                Sudoku.unitIndices.forEach((index) => {
                    if(unit[index].getValue()) {
                        count++;
                    }
                })
                if (count === 8) {
                    Sudoku.unitIndices.forEach((index) => {
                        let square = unit[index];
                        let candidates = square.getCandidates();
                        if (candidates) {
                            moves.push(new SudokuStateChange(square.getIndex(),
                                //TODO see #SuTS-20
                                candidates[0], 'in unit ' + Sudoku.unitNames[index]));
                        }
                    })
                }
            });
            return moves;
        });
        this.rules.push(rule);

        rule = new SolverRule('last square left rule ', 0.1, (sudoku) => {
            let moves: SudokuStateChange[] = [];
            let units = sudoku.getUnits();
            units.forEach((unit, index) => {
                Sudoku.values.forEach((value) => {
                    let squares: Square[] = [];
                    unit.forEach((square) => {
                        if (_.indexOf(square.getCandidates(), value) !== -1) {
                            squares.push(square);
                        }
                    });
                    if (squares.length === 1) {
                        let square = squares[0];
                        moves.push(new SudokuStateChange(square.getIndex(), value,
                            'for value ' + value + ' in unit ' + Sudoku.unitNames[index]));
                    }
                })
            });
            return moves;
        });
        this.rules.push(rule);

        rule = new SolverRule('last candidate rule ', 1, (sudoku) => {
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
