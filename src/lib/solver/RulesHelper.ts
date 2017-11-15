import * as _ from "lodash";

import {Square} from "../game/Square";
import {Sudoku} from "../game/Sudoku";

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
     * Returns the remaining possible values for an given array of squares.
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
     * Takes an array of arrays of squares, e.g. lines, and returns all tupeles of a given length.
     *
     * Returns all sorted tupels with unique values of a given length and
     * a given array of arrays of squares.
     *
     * @param {Square[][]} lines the lines to get tuples from
     * @param {number} length the length of the tuples
     * @returns {Square[][][]} the tuples
     */
    static getTuplesOfLines(lines: Square[][], length: number): Square[][][] {
        let indexTuples = RulesHelper.getTuples(lines.length, length);
        let lineTuples: Square[][][] = [];
        let lineTuple: Square[][];
        indexTuples.forEach((tuple) => {
            lineTuple = tuple.map((index) => lines[index]);
            lineTuples.push(lineTuple)
        });
        return lineTuples;
    }

}
