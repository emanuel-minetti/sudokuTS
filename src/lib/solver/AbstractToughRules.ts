import * as _ from "lodash";

import {Square} from "../game/Square";
import {Sudoku} from "../game/Sudoku";
import {SudokuStateChange} from "../game/SudokuStateChange";
import {RulesHelper} from "./RulesHelper";

/**
 * A class with tough abstract rules to help building tough solver rules.
 */
export class AbstractToughRules {

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
                //in (2 <= x <= tupleLength) squares
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
                        if ((definingLines.reduce((result: Boolean, definingLine: Square[]): Boolean => {
                                return (result && (intersectingLines.reduce(
                                    (intermediateResult: number, intersectingLine: Square[]): number => {
                                        let intersection = _.intersection(definingLine, intersectingLine);
                                        return intermediateResult + (intersection[0].containsCandidate(value) ? 1 : 0);
                                    }, 0) >= 2));
                            }, true)) &&
                            //... and whether there are no candidate squares
                            //in defining lines outside the intersecting ones
                            (definingLines.reduce((result: Boolean, definingLine: Square[]): Boolean => {
                                let intersectingSquares = _.flatten(intersectingLines);
                                return (result && definingLine.reduce((result: Boolean, square: Square): Boolean => {
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