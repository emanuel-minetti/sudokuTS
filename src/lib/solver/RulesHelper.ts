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
     * a given array of squares.
     *
     * @param {Square[]} squares the squares to get tuples from
     * @param {number} length the length of the tuples
     * @returns {Square[][]} the tupeles
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
     * Returns all tuples of a given length of an index set of a given length.
     *
     * @param {number} setLength the length of the index set
     * @param {number} tupleLength the length of the tuples
     * @returns {number[][]} the tuples
     */
    static getTuples(setLength: number, tupleLength: number): number[][] {
        if (setLength < tupleLength) {
            throw new Error('Can\'t find tuples with unique entries of a length longer than the set!');
        }
        if (setLength === 0) {
            throw new Error('Can\'t find tuples from an empty set!');
        }
        if (tupleLength === 0) {
            throw new Error('Can\'t find tuples of length zero!');
        }
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
        let intersection = squares.reduce(
            (prev, curr) => _.intersection(prev, curr.getUnitIndices()),
            _.range(27));
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
