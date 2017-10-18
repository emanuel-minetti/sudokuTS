import {Square} from "../game/Square";
import * as _ from "lodash";
import {Sudoku} from "../game/Sudoku";
import {SudokuStateChange} from "../game/SudokuStateChange";

/**
 * A class with some static functions to help building solver rules.
 */
export class RulesHelper {

    /**
     * Takes an array of squares, i.e. a unit, and filters out the already
     * set ones.
     *
     * @param {Square[]} unit the squares to filter
     * @returns {Square[]} the filtered squares
     */
    static getUnsetSquares(unit: Square[]): Square[] {
        let unsetSquares: Square[] = [];
        unit.forEach((square) => {
            if (square.getCandidates() !== null) {
                unsetSquares.push(square);
            }
        });
        return unsetSquares;
    }

    //TODO validate input!
    /**
     * Takes an array of squares and returns all tupeles of a given length.
     *
     * Returns all sorted tupels with unique squares of a given length and
     * array of squares.
     *
     * @param {Square[]} squares
     * @param {number} length
     * @returns {Square[][]}
     */
    static getTupelsOfSquares(squares: Square[], length: number): Square[][] {
        let tupels: Square[][] = [];
        let tupleIndices = _.range(length);
        tupleIndices.forEach((tupleIndex) => {
            if (tupleIndex === 0) {
                //if length is one return all squares
                squares.forEach((square) => {
                    tupels.push([square]);
                });
            } else {
                //build tupels incrementally
                //TODO use reduce?!
                let newTupels: Square[][] = [];
                //take the tupels of length minus one
                tupels.forEach((tupel) => {
                    squares.forEach((square) => {
                        if (tupel[tupel.length - 1].getIndex() < square.getIndex()) {
                            //and create all possible continuations
                            newTupels.push(_.concat(tupel, square));
                        }
                    });
                })
                //and repeat
                tupels = newTupels;
            }
        })
        return tupels;
    }

    //TODO test and validate input!
    /**
     * Returns all units that contain the given squares.
     *
     * @param {Sudoku} sudoku the sudoku
     * @param {Square[]} squares the squares to find containing units
     * @returns {Square[][]} the common units
     */
    static findCommonUnits(sudoku: Sudoku, squares: Square[]): Square[][] {
        //find intersection of all unit indices of all squares
        let allUnits = sudoku.getUnits();
        //TODO use reduce!
        let intersection = _.range(27);
        squares.forEach((square) => {
            intersection = _.intersection(intersection, square.getUnitIndices());
        });
        return intersection.map((unitIndex) => allUnits[unitIndex]);
    }

    /**
     * A helper function to build a `SolverRule` or more specifically
     * a `TRuleFunction`. It is an abstraction of the naked pair, triple
     * and quadruple rule.
     *
     * For each unit it takes all tupels of the given length of the not yet
     * set squares. For each tupel it takes all naked tupels, that is a
     * tupel whose union of its candidates has the given length. For each
     * such naked tuple it takes all units that contain this tuple. For each of
     * these common units it removes the union of candidates from the condidates
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
            let tuples = RulesHelper.getTupelsOfSquares(tupleCandidates, length);
            //for these tuples find all naked tuples
            tuples.forEach((tuple) => {
                //TODO use reduce!
                let union: number[] = [];
                tuple.forEach((tupleSquare) => {
                    union = _.union(union, tupleSquare.getCandidates());
                });
                if (union.length === length) {
                    //naked tuple found
                    //for this naked tuple find all common units
                    let commonUnits = RulesHelper.findCommonUnits(sudoku, tuple);
                    //for each common unit
                    commonUnits.forEach((commonUnit) => {
                        //for each square in this unit
                        commonUnit.forEach((square) => {
                            //that is not part of the tuple
                            if (_.indexOf(tuple, square) === -1) {
                                //find the values to remove
                                let valuesToRemove = _.intersection(square.getCandidates(), union);
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
}
