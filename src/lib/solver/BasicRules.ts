import {SolverRule, TRuleFunction} from "./SolverRule";
import {SudokuStateChange} from "../game/SudokuStateChange";
import {Square} from "../game/Square";
import * as _ from "lodash";
import {Sudoku} from "../game/Sudoku";

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
        let moves: SudokuStateChange[] = [];
        let units = sudoku.getUnits();
        //for each unit
        units.forEach((unit) => {
            // get all squares with two candidates remaining
            let twinCandidates: Square[] = [];
            unit.forEach((square) => {
                let squareCandidates = square.getCandidates();
                if (squareCandidates !== null &&
                    squareCandidates.length === 2) {
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
                            let valuesToRemove =
                                firstTwinCandidate.getCandidates();
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
                                                square.getIndex(),
                                                intersection,
                                                'removed ' +
                                                intersection +
                                                ' from candidates of ' +
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

    /**
     * The 'naked triple rule' checks each unit whether there are three squares
     * that have only the same three candidates. If it finds such a triple, it
     * removes their candidates from all other squares that are in units shared
     * by this pair.
     *
     * @param {Sudoku} sudoku the state of the game
     * @returns {SudokuStateChange[]} an array of moves that could be
     * done according this rule
     */
    private static _ntRuleFn: TRuleFunction = (sudoku) => {
        let moves: SudokuStateChange[] = [];
        let units = sudoku.getUnits();
        //for each unit
        units.forEach((unit) => {
            let tripleCandidates: Square[] = BasicRules._getUnsetSquares(unit);
            // for these candidates find a naked triple
            tripleCandidates.forEach((firstTripleCandidate, firstIndex) => {
                tripleCandidates.forEach(
                    (secondTripleCandidate, secondIndex) => {
                    if (secondIndex > firstIndex) {
                        tripleCandidates.forEach(
                            (thirdTripleCandidate, thirdIndex) => {
                            if (thirdIndex > secondIndex) {
                                let union = _.union(
                                    firstTripleCandidate.getCandidates(),
                                    secondTripleCandidate.getCandidates(),
                                    thirdTripleCandidate.getCandidates());
                                if (union.length === 3) {
                                    // naked triple found
                                    // find common units
                                    let commonUnitIndices = _.intersection(
                                        firstTripleCandidate.getUnitIndices(),
                                        secondTripleCandidate.getUnitIndices(),
                                        thirdTripleCandidate.getUnitIndices()
                                    );
                                    // for each common unit
                                    commonUnitIndices.forEach((unitIndex) => {
                                        let unit = sudoku.getUnits()[unitIndex];
                                        // for each square in this common unit
                                        unit.forEach((square) => {
                                            if (firstTripleCandidate !== square &&
                                            secondTripleCandidate !== square &&
                                            thirdTripleCandidate !== square) {
                                                // find intersection from square's
                                                // candidates and values to remove
                                                let intersection = _.intersection(
                                                    square.getCandidates(), union
                                                );
                                                // if there is an intersection
                                                // add a move
                                                if (intersection.length !== 0) {
                                                    let move = new SudokuStateChange(
                                                        square.getIndex(),
                                                        intersection,
                                                        'removed ' +
                                                        intersection +
                                                        ' from candidates of ' +
                                                        square.getName());
                                                    moves.push(move);
                                                }
                                            }
                                        })
                                    });
                                }
                            }
                        })
                    }
                })
            });
        });
        return moves;
    };

    private static _hpRuleFn: TRuleFunction = (sudoku) => {
        let moves: SudokuStateChange[] = [];
        let units = sudoku.getUnits();
        let allPairs: number[][] = [];
        Sudoku.values.forEach((firstValue) => {
            Sudoku.values.forEach((secondValue) => {
                if (firstValue <= secondValue) {
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
    private static _getUnsetSquares(unit: Square[]): Square[] {
        let unsetSquares: Square[] = [];
        unit.forEach((square) => {
           if (square.getCandidates() !== null)  {
               unsetSquares.push(square);
           }
        });
        return unsetSquares;
    }

    //TODO implement and document!
    private static _getTupelsOfSquares(squares: Square[], length: number): Square[][] {
        let tupels: Square[][] = [];
        let tupel: Square[];
        for (let tupelIndex = 0; tupelIndex < length; tupelIndex++) {

        }
        return tupels;
    }

    rules: SolverRule[];

    constructor() {
        this.rules = [];

        let npRule = new SolverRule('Naked Pair Rule: ', 4, BasicRules._npRuleFn);
        this.rules.push(npRule);

        let hpRule = new SolverRule('Hidden Pair Rule: ', 4, BasicRules._hpRuleFn);
        this.rules.push(hpRule);

        let ntRule = new SolverRule('Naked Triple Rule: ', 4, BasicRules._ntRuleFn);
        this.rules.push(ntRule);
    }
};
