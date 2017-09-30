import {SolverRule, TRuleFunction} from "./Solver";
import {SudokuStateChange} from "./SudokuGame";
import {Sudoku} from "./Sudoku";
import {Square} from "./Square";
import * as _ from "lodash";

export class BasicRules {
    rules: SolverRule[];

    constructor() {
        this.rules = [];

        let lsfRule: SolverRule = new SolverRule('last square free rule ', 0.5, BasicRules.lsfRuleFn);
        this.rules.push(lsfRule);

        let lslRule = new SolverRule('last square left rule ', 1, BasicRules.lslRuleFn);
        this.rules.push(lslRule);

        let lcRule = new SolverRule('last candidate rule ', 2, BasicRules.lcRuleFn);
        this.rules.push(lcRule);
    }

    /**
     * The 'last square free rule' checks whether there is a unit in
     * which there is only one square unfilled and fills it with the
     * last remaining value.
     *
     * @param {Sudoku} sudoku the state of the game
     * @returns {SudokuStateChange[]} an array of moves that could
     * done according this rule
     */
    static lsfRuleFn: TRuleFunction = (sudoku) => {
        let moves: SudokuStateChange[] = [];
        let units = sudoku.getUnits();
        units.forEach((unit, unitIndex) => {
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
                            candidates[0], 'in unit ' + Sudoku.unitNames[unitIndex]));
                    }
                })
            }
        });
        return moves;
    }

    /**
     * The 'last square left rule' checks for each unit whether there
     * is a value that can only be filled in one square of the unit.
     *
     * @param {Sudoku} sudoku the state of the game
     * @returns {SudokuStateChange[]} an array of moves that could
     * done according this rule
     */
    static lslRuleFn: TRuleFunction = (sudoku) => {
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
    }

    /**
     * The 'last candidate rule' checks for each square whether there is only
     * one last candidate left and sets it to this value.
     *
     * @param {Sudoku} sudoku the state of the game
     * @returns {SudokuStateChange[]} an array of moves that could
     * done according this rule
     */
    static lcRuleFn: TRuleFunction = (sudoku) => {
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
    }
}