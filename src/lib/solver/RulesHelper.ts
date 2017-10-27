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

    /**
     * Returns the remaining possible values for an given array os squares.
     *
     * @param {Square[]} unit the array of squares
     * @returns {number[]} the remaining values
     */
    static getRemainingValues(unit: Square[]): number[] {
        let remainingValues = Sudoku.values.slice();
        let value: number | null;
        unit.forEach((square) => {
            value = square.getValue();
            if (value) {
                _.pull(remainingValues, value);
            }
        });
        return remainingValues;
    }

    /**
     * Takes an array of squares and returns all tupeles of a given length.
     *
     * Returns all sorted tupels with unique squares of a given length and
     * a given array of squares.
     *
     * @param {Square[]} squares the squares to get tuples from
     * @param {number} length the length of the tuples
     * @returns {Square[][]} the tuples
     */
    static getTupelesOfSquares(squares: Square[], length: number): Square[][] {
        let indexTuples = RulesHelper.getTuples(squares.length, length);
        let squareTuples: Square[][] = [];
        let squareTuple: Square[];
        indexTuples.forEach((tuple) => {
            squareTuple = tuple.map((index) => squares[index]);
            squareTuples.push(squareTuple)
        });
        return squareTuples;
    }

    /**
     * Takes an array of values and returns all tupeles of a given length.
     *
     * Returns all sorted tupels with unique values of a given length and
     * a given array of values.
     *
     * @param {Square[]} squares the squares to get tuples from
     * @param {number} length the length of the tuples
     * @returns {Square[][]} the tuples
     */
    static getTuplesOfValues(values: number[], length: number): number[][] {
        let indexTuples = RulesHelper.getTuples(values.length, length);
        let valueTuples: number[][] = [];
        let valueTuple: number[];
        indexTuples.forEach((tuple) => {
            valueTuple = tuple.map((index) => values[index]);
            valueTuples.push(valueTuple)
        });
        return valueTuples;
    }


    /**
     * Returns all tuples of a given length of an index set of a given length.
     *
     * @param {number} setLength the length of the index set
     * @param {number} tupleLength the length of the tuples
     * @returns {number[][]} the tuples
     */
    static getTuples(setLength: number, tupleLength: number): number[][] {
        let tuples: number[][] = [];
        let set = _.range(setLength);
        let tupleIndices = _.range(tupleLength);
        tupleIndices.forEach((tupleIndex) => {
            if (tupleIndex === 0) {
                //if length is one return all members
                set.forEach((member) => {
                    tuples.push([member]);
                });
            } else {
                //build tuples incrementally
                let newTuples: number[][] = [];
                //take the tuples of length minus one
                tuples.forEach((tuple) => {
                    set.forEach((member) => {
                        if (tuple[tuple.length - 1] < member) {
                            //and create all possible continuations
                            newTuples.push(_.concat(tuple, member));
                        }
                    });
                })
                //and repeat
                tuples = newTuples;
            }
        })
        return tuples;
    }

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
                let union = tuple.reduce((prev, curr) => _.union(prev, curr.getCandidates()), []);
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
                    if (_.intersection(square.getCandidates(), tuple).length !== 0) {
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
}
