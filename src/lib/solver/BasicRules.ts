import {SolverRule, TRuleFunction} from "./SolverRule";
import {SudokuStateChange} from "../game/SudokuStateChange";
import {Square} from "../game/Square";
import * as _ from "lodash";
import {Sudoku} from "../game/Sudoku";
import {RulesHelper} from "./RulesHelper";

/**
 * A class grouping the simple sudoku rules.
 *
 * The rules were taken from the website 'http://www.sudokuwiki.org/sudoku.htm'
 * run by Andrew Stuart. The naming of the rules mostly follows the naming
 * on that site.
 */
export class BasicRules {

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
    private static _npRuleFn: TRuleFunction = (sudoku) => {
        return RulesHelper.nakedTupleRule(sudoku, 2);
    }

    /**
     * The 'naked triple rule' checks each unit whether there are three squares
     * that have just three candidates in common. If it finds such a triple, it
     * removes the common candidates from all other squares that are in units shared
     * by this triple.
     *
     * @param {Sudoku} sudoku the state of the game
     * @returns {SudokuStateChange[]} an array of moves that could be
     * done according this rule
     */
    private static _ntRuleFn: TRuleFunction = (sudoku) => {
        return RulesHelper.nakedTupleRule(sudoku, 3);
    }

    //TODO document!
    private static _hpRuleFn: TRuleFunction = (sudoku) => {
        let moves: SudokuStateChange[] = [];
        let units = sudoku.getUnits();
        let allPairs: number[][] = [];
        Sudoku.values.forEach((firstValue) => {
            Sudoku.values.forEach((secondValue) => {
                if (firstValue < secondValue) {
                    allPairs.push([firstValue, secondValue]);
                }
            });
        });
        //for each unit
        units.forEach((unit) => {
            //for each pair of values
            allPairs.forEach((pair) => {
                //find all squares that have one of the pair in their candidates
                let containingSquares: Square[] = [];
                unit.forEach((square) => {
                    let candidates = square.getCandidates();
                    let intersection = _.intersection(candidates, pair);
                    if (candidates && intersection.length != 0) {
                        containingSquares.push(square);
                    }
                });
                if (containingSquares.length === 2) {
                    let intersection = _.intersection(
                        containingSquares[0].getCandidates(),
                        containingSquares[1].getCandidates(),
                        pair);
                    if (intersection.length === 2) {
                        //hidden pair found
                        //so remove the difference from each square
                        containingSquares.forEach((square) => {
                            let difference = _.difference(
                                square.getCandidates(), pair);
                            if (difference.length !== 0) {
                                let move = new SudokuStateChange(square.getIndex(),
                                    difference, 'removed ' +
                                    difference + ' from candidates of ' +
                                    square.getName());
                                moves.push(move);
                            }
                        });
                    }
                }
            });
        });
        return moves;
    }

    //TODO document!
    private static _htRuleFn: TRuleFunction = (sudoku) => {
        let moves: SudokuStateChange[] = [];
        let units = sudoku.getUnits();
        let allTriples: number[][];
        let remainingValues: number[];
        let value: number | null;
        units.forEach((unit) => {
            allTriples = [];
            remainingValues = Sudoku.values.slice();
            //TODO move to a function!
            unit.forEach((square) => {
               value = square.getValue();
               if (value) {
                   _.pull(remainingValues, value);
               }
            });
            //TODO move to a function!
            remainingValues.forEach((firstValue) => {
                remainingValues.forEach((secondValue) => {
                    if (firstValue < secondValue) {
                        remainingValues.forEach((thirdValue) => {
                            if (secondValue < thirdValue) {
                                allTriples.push([firstValue, secondValue, thirdValue]);
                            }
                        })
                    }
                })
            });
            //TODO move to a function!
            allTriples.forEach((triple) => {
               let squares = RulesHelper.getUnsetSquares(unit);
               let containingSquares: Square[] = [];
               squares.forEach((square) => {
                   if (_.intersection(square.getCandidates(), triple).length !== 0) {
                        containingSquares.push(square);
                }
               })
               if (containingSquares.length === 3) {
                     //hidden triple found
                     //so remove the difference from each square
                     containingSquares.forEach((square) => {
                         let difference = _.difference(
                             square.getCandidates(), triple);
                         if (difference.length !== 0) {
                             let move = new SudokuStateChange(square.getIndex(),
                                 difference, 'removed ' +
                                 difference + ' from candidates of ' +
                                 square.getName());
                             moves.push(move);
                         }
                     });
               }
            })
        })

        return moves;
    }

    rules: SolverRule[];

    constructor() {
        this.rules = [];

        let npRule = new SolverRule('Naked Pair Rule: ', 4, BasicRules._npRuleFn);
        this.rules.push(npRule);

        let hpRule = new SolverRule('Hidden Pair Rule: ', 5, BasicRules._hpRuleFn);
        this.rules.push(hpRule);

        let ntRule = new SolverRule('Naked Triple Rule: ', 6, BasicRules._ntRuleFn);
        this.rules.push(ntRule);

        let htRule = new SolverRule('Hidden Triple Rule: ', 7, BasicRules._htRuleFn);
        this.rules.push(htRule);
    }
};
