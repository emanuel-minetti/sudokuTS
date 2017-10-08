import {SolverRule, TRuleFunction} from "./SolverRule";
import {SudokuStateChange} from "../game/SudokuStateChange";
import {Sudoku} from "../game/Sudoku";
import {Square} from "../game/Square";
import * as _ from "lodash";

/**
 * A class grouping the simple sudoku rules.
 *
 * The rules were taken from the website 'http://www.sudokuwiki.org/sudoku.htm'
 * run by Andrew Stuart. The naming of the rule mostly follows the naming
 * on that site.
 */
export class BasicRules {
    /**
     * The 'last square free rule' checks whether there is a unit in
     * which there is only one square unfilled and fills it with the
     * last remaining value.
     *
     * @param {Sudoku} sudoku the state of the game
     * @returns {SudokuStateChange[]} an array of moves that could be
     * done according this rule
     */
    static lsfRuleFn: TRuleFunction = (sudoku) => {
        let moves: SudokuStateChange[] = [];
        let units = sudoku.getUnits();
        units.forEach((unit, unitIndex) => {
            let count = 0;
            Sudoku.unitIndices.forEach((index) => {
                if (unit[index].getValue()) {
                    count++;
                }
            })
            if (count === 8) {
                Sudoku.unitIndices.forEach((index) => {
                    let square = unit[index];
                    let candidates = square.getCandidates();
                    if (candidates) {
                        let reason = 'Set ' + square.getName() + 'to' +
                            candidates[0] +  'in unit ' +
                            Sudoku.unitNames[unitIndex];
                        moves.push(new SudokuStateChange(square.getIndex(),
                            candidates[0], reason
                            ));
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
     * @returns {SudokuStateChange[]} an array of moves that could be
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
                    let reason = 'Set ' + square.getName() + ' to ' + value +
                        ' in unit ' + Sudoku.unitNames[index];
                    moves.push(new SudokuStateChange(square.getIndex(), value,
                        reason));
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
     * @returns {SudokuStateChange[]} an array of moves that could be
     * done according this rule
     */
    static lcRuleFn: TRuleFunction = (sudoku) => {
        let moves: SudokuStateChange[] = [];
        let squares = sudoku.getSquares()
        squares.forEach((square) => {
            let candidates = square.getCandidates();
            if (candidates !== null && candidates.length === 1) {
                //TODO refactor
                moves.push(new SudokuStateChange(square.getIndex(), candidates[0],
                    'in square ' + square.getName()));
            }
        });
        return moves;
    }

    /**
     * The 'naked pair rule' checks each unit whether there are two squares
     * that have only the same two candidates. If it finds such a pair, it
     * removes their candidate from all other squares that are in units shared
     * by this pair.
     *
     * @param {Sudoku} sudoku the state of the game
     * @returns {SudokuStateChange[]} an array of moves that could be
     * done according this rule
     */
    static npRuleFn: TRuleFunction = (sudoku) => {
        let moves: SudokuStateChange[] = [];
        let units = sudoku.getUnits();
        //for each unit
        units.forEach((unit) => {
            // get all squares with two candidates remaining
            let twinCandidates: Square[] = [];
            unit.forEach((square) => {
                let squareCandidates = square.getCandidates();
                if (squareCandidates !== null && squareCandidates.length === 2) {
                    twinCandidates.push(square);
                }
            });
            // for these candidates find a naked pair
            twinCandidates.forEach((firstTwinCandidate, firstIndex) => {
                twinCandidates.forEach((secondTwinCandidate, secondIndex) => {
                    if (secondIndex > firstIndex) {
                        if (_.isEqual(firstTwinCandidate.getCandidates(),
                                secondTwinCandidate.getCandidates())) {
                            // naked pair found!
                            let valuesToRemove = firstTwinCandidate.getCandidates();
                            // find common units
                            let commonUnitIndices = _.intersection(
                                firstTwinCandidate.getUnitIndices(),
                                secondTwinCandidate.getUnitIndices()
                            );
                            // for each common unit
                            commonUnitIndices.forEach((unitIndex) => {
                                let unit = sudoku.getUnits()[unitIndex];
                                // for each square in these common units
                                unit.forEach((square) => {
                                    if (firstTwinCandidate !== square &&
                                        secondTwinCandidate !== square) {
                                        // find intersection from square's
                                        // candidates and values to remove
                                        let intersection =
                                            _.intersection(
                                                square.getCandidates(),
                                                valuesToRemove);
                                        // if there is an intersection add a move
                                        if (!_.isEqual(intersection, [])) {
                                            //TODO refactor
                                            let move = new SudokuStateChange(
                                                square.getIndex(), intersection,
                                                'removed  ' +
                                                intersection + 'candidates of ' +
                                                square.getName());
                                            moves.push(move);
                                        }
                                    }
                                })
                            })
                        }
                    }
                })
            });
        });
        return moves;
    };

    rules: SolverRule[];

    constructor() {
        this.rules = [];

        let lsfRule: SolverRule = new SolverRule('Last Square Free Rule: ', 0.5,
            BasicRules.lsfRuleFn);
        this.rules.push(lsfRule);

        let lslRule = new SolverRule('Last Square Left Rule: ', 1,
            BasicRules.lslRuleFn);
        this.rules.push(lslRule);

        let lcRule = new SolverRule('Last Candidate Rule: ', 2,
            BasicRules.lcRuleFn);
        this.rules.push(lcRule);

        let npRule = new SolverRule('Naked Pair Rule: ', 4, BasicRules.npRuleFn);
        this.rules.push(npRule);
    }
}