import * as _ from "lodash";

import {Sudoku} from "../game/Sudoku";
import {SudokuStateChange} from "../game/SudokuStateChange";
import {Square} from "../game/Square";
import {RulesHelper} from "./RulesHelper";

/**
 * A class with abstract rules to help building solver rules.
 */
export class AbstractRules {

    /**
     * An abstraction of the naked tuple rule.
     *
     * A helper function to build a `SolverRule` or more specifically
     * a `TRuleFunction`. It is an abstraction of the naked pair, triple
     * and quadruple rule.
     *
     * For each unit it takes all tupels of the given length of the not yet
     * set squares. For each tupel it takes all naked tupels, that is a
     * tupel whose union of its candidates has the given length. For each
     * such naked tuple it takes all units that contain this tuple. For each of
     * these common units it removes the union of candidates from the candidates
     * of its squares.
     *
     * @param {Sudoku} sudoku the sudoku to solve
     * @param {number} length the length of tupel and union of candidates
     * @returns {SudokuStateChange[]} an array of moves suggested by this rule
     */
    static nakedTupleRule(sudoku: Sudoku, length: number): SudokuStateChange[] {
        let moves: SudokuStateChange[] = [];
        let units = sudoku.getUnits();
        //for each unit
        units.forEach((unit) => {
            //find candidates for tuple
            let tupleCandidates: Square[] = RulesHelper.getUnsetSquares(unit);
            // for these candidates find all tuples
            let tuples = RulesHelper.getTupelesOfSquares(tupleCandidates, length);
            //for these tuples find all naked tuples
            tuples.forEach((tuple) => {
                let union = tuple.reduce((prev: number[], curr: Square): number[] =>
                    _.union(prev, curr.getCandidates()), []);
                if (union.length === length) {
                    //naked tuple found
                    //for this naked tuple find all common units
                    let commonUnits = sudoku.findCommonUnits(tuple);
                    //for each common unit
                    commonUnits.forEach((commonUnit) => {
                        //for each square in this unit
                        commonUnit.forEach((square) => {
                            //that is not part of the tuple
                            if (_.indexOf(tuple, square) === -1) {
                                //find the values to remove
                                let valuesToRemove = square.getCandidateIntersection(union);
                                if (valuesToRemove.length !== 0) {
                                    let move = new SudokuStateChange(square.getIndex(), valuesToRemove,
                                        'removed ' + valuesToRemove + ' from candidates of ' + square.getName());
                                    moves.push(move);
                                }
                            }
                        });
                    });
                }
            });
        });
        return moves;
    }

    /**
     * An abstraction of the hidden tuple rule.
     *
     * A helper function to build a `SolverRule` or more specifically
     * a `TRuleFunction`. It is an abstraction of the hidden pair, triple
     * and quadruple rule.
     *
     * For each unit it takes all tupels of the given length of the not yet
     * set values. For each tupel it takes all hidden tupels, that is a
     * tupel whose number containing squares is the given length. For each
     * such hidden it removes all values of this tuple from the remaining
     * squares of this unit.
     *
     * @param {Sudoku} sudoku the sudoku to solve
     * @param {number} length the length of the tuple
     * @returns {SudokuStateChange[]} an array of moves according this rule
     */
    static hiddenTupleRule(sudoku: Sudoku, length: number): SudokuStateChange[] {
        let moves: SudokuStateChange[] = [];
        let units = sudoku.getUnits();
        let allTuples: number[][];
        let remainingValues: number[];
        let value: number | null;
        //for each unit
        units.forEach((unit) => {
            //find all tuples of all remaining values in this unit
            remainingValues = RulesHelper.getRemainingValues(unit);
            allTuples = RulesHelper.getTuplesOfValues(remainingValues, length);
            //for each tuple
            allTuples.forEach((tuple) => {
                //find all squares containing values from the tuple
                let squares = RulesHelper.getUnsetSquares(unit);
                let containingSquares: Square[] = [];
                squares.forEach((square) => {
                    if (square.getCandidateIntersection(tuple).length !== 0) {
                        containingSquares.push(square);
                    }
                })
                if (containingSquares.length === length) {
                    //hidden tuple found
                    //so remove the difference from each square
                    containingSquares.forEach((square) => {
                        let difference = _.difference(
                            square.getCandidates(), tuple);
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

    /**
     * An abstraction of the pointing pairs and the box/line reduction rule.
     *
     * It checks each unit it's been given (boxes or lines) whether there is a
     * pointing pair or triple, that is in line. If there is a pointing pair or
     * triple it checks whether there is another unit that contains the
     * pointing pair or triplet. If it finds this other unit it removes the
     * values of the pointing pair or triplet from all squares of the other
     * unit that have it as candidates.
     *
     * @param {Sudoku} sudoku the game to solve
     * @param {Square[][]} units boxes or lines
     * @returns {SudokuStateChange[]} the resulting moves
     */
    static boxLineIntersection(sudoku: Sudoku, units: Square[][]) {
        let moves: SudokuStateChange[] = [];
        units.forEach(unit => {
            let remainingValues = RulesHelper.getRemainingValues(unit);
            remainingValues.forEach(remainingValue => {
                let containingSquares = unit.filter(square => square.containsCandidate(remainingValue));
                //catch number of containing squares
                let csLength = containingSquares.length;
                if (csLength === 2 || csLength === 3) {
                    //box/line intersection candidate found
                    let commonUnits = sudoku.findCommonUnits(containingSquares);
                    if (commonUnits.length === 2) {
                        //box/line intersection found
                        let otherUnit = commonUnits[0] !== unit ? commonUnits[0] : commonUnits[1];
                        otherUnit.forEach(square => {
                            if (containingSquares.indexOf(square) === -1) {
                                if (square.containsCandidate(remainingValue)) {
                                    //add move
                                    let move = new SudokuStateChange(
                                        square.getIndex(), [remainingValue],
                                        'removed ' + remainingValue +
                                        ' from candidates of ' +
                                        square.getName());
                                    moves.push(move);
                                }
                            }
                        });
                    }
                }
            });
        });
        return moves;
    }

    /**
     * An abstraction of the X-Wing rule.
     *
     * It abstracts whether columns or rows are searched for a defining 'X'. For each value it searches within
     * the given 'lines to search' whether there are two lines that contain the value exactly two times. If
     * these four defining squares are contained in exactly two of the 'lines to eliminate' a defining 'X' is
     * found. Now it removes the value from all squares of the two 'lines to eliminate' except from the
     * defining four.
     *
     * @param {Square[][]} linesToSearch the lines, that is rows or columns, to search for the defining 'X'.
     * @param {Square[][]} linesToEliminate the lines, that is columns or rows, to remove candidates from.
     * @returns {SudokuStateChange[]} the resulting moves
     */
    static abstractX_Wing(linesToSearch: Square[][], linesToEliminate: Square[][]) {
        let moves: SudokuStateChange[] = [];
        let definingUnitCandidates: Square[][];
        let values = Sudoku.values;
        //for each value
        values.forEach(value => {
            //find the first line which contains the value in the candidates of exactly two squares
            linesToSearch.forEach((firstDefiningUnit, firstUnitIndex) => {
                let firstContainingSquares = firstDefiningUnit.filter(square => square.containsCandidate(value));
                if (firstContainingSquares.length === 2) {
                    //find the second line which contains the value in the candidates of exactly two squares
                    linesToSearch.forEach((secondDefiningUnit, secondUnitIndex) => {
                        if (secondUnitIndex > firstUnitIndex) {
                            let secondContainingSquares = secondDefiningUnit.filter(square =>
                                square.containsCandidate(value));
                            if (secondContainingSquares.length === 2) {
                                //two containing lines found
                                //find intersecting lines
                                let unitsToEliminate = linesToEliminate.filter(squaresToEliminate => {
                                    return ((squaresToEliminate.indexOf(firstContainingSquares[0]) !== -1 &&
                                        squaresToEliminate.indexOf(secondContainingSquares[0]) !== -1)
                                        ||
                                        (squaresToEliminate.indexOf(firstContainingSquares[1]) !== -1) &&
                                        squaresToEliminate.indexOf(secondContainingSquares[1]) !== -1)
                                });
                                if (unitsToEliminate.length === 2) {
                                    //X-Wing found, so remove candidates
                                    unitsToEliminate.forEach(unitToEliminate => {
                                        unitToEliminate.forEach(squareToRemoveValue => {
                                            //if the square is none of defining squares
                                            if (firstContainingSquares.indexOf(squareToRemoveValue) === -1 &&
                                                secondContainingSquares.indexOf(squareToRemoveValue) === -1) {
                                                //and the square isn't already set and
                                                //contains the value as a candidate
                                                if (squareToRemoveValue.containsCandidate(value)) {
                                                    let move = new SudokuStateChange(squareToRemoveValue.getIndex(),
                                                        [value],
                                                        value + ' in ' + firstContainingSquares[0].getName() + '/' +
                                                        firstContainingSquares[1].getName() + ' and ' +
                                                        secondContainingSquares[0].getName() + '/' +
                                                        secondContainingSquares[1].getName() +
                                                        ', so removed ' + value + ' from ' +
                                                        squareToRemoveValue.getName());
                                                    moves.push(move);
                                                }
                                            }
                                        });
                                    });
                                }
                            }
                        }
                    });
                }
            });
        });
        return moves;
    }

    static abstractCrossExclude(linesToSearch: Square[][],
                         linesToEliminate: Square[][],
                         tupleLength: number): SudokuStateChange[] {
        let moves: SudokuStateChange[] = [];
        let lineTuples = RulesHelper.getTuplesOfLines(linesToSearch, tupleLength);
        let values = Sudoku.values;
        //for each value and each tuple of lines
        values.forEach(value => {
            lineTuples.forEach(lineTuple => {
                let definingLines: Square[][] = [];
                //for each line
                lineTuple.forEach(line => {
                    let containingSquares = line.filter(square => square.containsCandidate(value));
                    if (containingSquares.length > 0 && containingSquares.length <= tupleLength) {
                        definingLines.push(line);
                    }
                });
                if (definingLines.length === tupleLength) {
                    //defining tuple candidate found
                    //TODO find if there are intersecting lines
                    //TODO test and implement!
                        console.log("Defining triple found: Value: " + value);
                        console.log("\nLines: ");
                        definingLines.forEach(line => console.log(line.reduce(
                            (prev: String, curr: Square): String => {return prev + " " + curr.getName()}, ""
                        )));
                        console.log(("\n"));
                }
            });
        });

        return moves;
    }
}