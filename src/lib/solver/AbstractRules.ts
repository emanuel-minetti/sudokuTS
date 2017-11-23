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
     * An abstraction of the X-Wing and Swordfish rules.
     *
     * This rule works on values and lines that is rows or columns. It takes lines to search (rows or columns) and lines
     * to eliminate the value from. It also takes a tuple length that determines the size of the defining square of
     * squares that is 2*2 or 3*3.
     *
     * For every value x it searches for tuples of lines to search that lines contain x 2 <= #x <= tuple length times.
     * Such a tuple is called 'defining lines'. For each set of defining lines it tests whether there are tuple length
     * lines to eliminate that contain x in at least two squares that intersect with the defining lines. If such lines
     * to eliminate exist they are called 'intersecting lines'. If the defining lines don't contain x in any square
     * other than the intersecting a Cross Exclude is found. Now x can be removed from all squares of the intersecting
     * lines except the defining squares.
     *
     * @param {Square[][]} linesToSearch the lines, that is rows or columns, to search for the defining square of squares.
     * @param {Square[][]} linesToEliminate the lines, that is columns or rows, to remove candidates from.
     * @returns {SudokuStateChange[]} the resulting moves
     */
    static abstractCrossExclude(linesToSearch: Square[][], linesToEliminate: Square[][],
                                tupleLength: number): SudokuStateChange[] {
        let moves: SudokuStateChange[] = [];
        let lineTuples = RulesHelper.getTuplesOfLines(linesToSearch, tupleLength);
        let values = Sudoku.values;
        //for each value and each tuple of lines
        values.forEach(value => {
            lineTuples.forEach(lineTuple => {
                //find defining lines that is lines that contain the value as a candidate
                //in 2 <= x <= tupleLength squares
                let definingLines = lineTuple.filter(line => {
                    let numberOfContainingSquares = line.filter(square => square.containsCandidate(value)).length;
                    return (numberOfContainingSquares >= 2 && numberOfContainingSquares <= tupleLength);
                });
                if (definingLines.length === tupleLength) {
                    //defining tuple candidate found
                    //find intersecting lines
                    let squaresInLineTuple: Square[] = _.flatten(lineTuple);
                    let intersectingLines = linesToEliminate.filter(
                        intersectingLine => {
                            let intersectingSquares = _.intersection(intersectingLine, squaresInLineTuple);
                            intersectingSquares = intersectingSquares.filter(square => square.containsCandidate(value));
                            return (intersectingSquares.length >= 2);
                        }
                    );
                    if (intersectingLines.length === 3) {
                        //test whether each defining line has the value as a candidate
                        // in at least two intersecting lines ...
                        if ((definingLines.reduce((result: boolean, definingLine: Square[]): boolean => {
                                return (result && (intersectingLines.reduce(
                                    (intermediateResult: number, intersectingLine: Square[]): number => {
                                        let intersection = _.intersection(definingLine, intersectingLine);
                                        return intermediateResult + (intersection[0].containsCandidate(value) ? 1 : 0);
                                    }, 0) >= 2));
                            }, true)) &&
                            //... and whether there are no candidate squares
                            //in defining lines outside the intersecting ones
                            (definingLines.reduce((result: boolean, definingLine: Square[]): boolean => {
                                let intersectingSquares = _.flatten(intersectingLines);
                                return (result && definingLine.reduce((result: boolean, square: Square): boolean => {
                                    return (result &&
                                        (!square.containsCandidate(value) ||
                                            (intersectingSquares.indexOf(square) !== -1)));
                                }, true));
                            }, true))) {
                            //CrossExclude found, so remove candidates
                            //find whether columns or rows are defining units
                            let isDefiningColumns = (definingLines[0][0].getColumnName() ===
                                definingLines[0][1].getColumnName());
                            //construct a string explaining the move
                            let definingString = definingLines.reduce((result: String, line: Square[]): String => {
                                return result + (isDefiningColumns ? line[0].getColumnName() : line[0].getRowName());
                            }, "");
                            definingString = intersectingLines.reduce((result: String, line: Square[]): String => {
                                return result + (isDefiningColumns ? line[0].getRowName() : line[0].getColumnName());
                            }, definingString);
                            //for each line to eliminate
                            intersectingLines.forEach(intersectingLine => {
                                intersectingLine.forEach(squareToRemoveValue => {
                                    //if the square is none of defining squares
                                    if (squaresInLineTuple.indexOf(squareToRemoveValue) === -1) {
                                        //and the square isn't already set and
                                        //contains the value as a candidate
                                        if (squareToRemoveValue.containsCandidate(value)) {
                                            let move = new SudokuStateChange(squareToRemoveValue.getIndex(),
                                                [value], value + ' in ' + definingString + ', so removed ' +
                                                value + ' from ' + squareToRemoveValue.getName());
                                            moves.push(move);
                                        }
                                    }
                                });
                            });
                        }
                    }
                }
                //}
            });
        });
        return moves;
    }
}