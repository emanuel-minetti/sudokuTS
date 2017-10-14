import {SolverRule, TRuleFunction} from "./SolverRule";
import {SudokuStateChange} from "../game/SudokuStateChange";
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
    static get npRuleFn(): TRuleFunction {
        return this._npRuleFn;
    }

    static set npRuleFn(value: TRuleFunction) {
        this._npRuleFn = value;
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
    private static _npRuleFn: TRuleFunction = (sudoku) => {
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
                                            let move = new SudokuStateChange(
                                                square.getIndex(), intersection,
                                                'removed ' +
                                                intersection + ' from candidates of ' +
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

        let npRule = new SolverRule('Naked Pair Rule: ', 4, BasicRules._npRuleFn);
        this.rules.push(npRule);
    }

}