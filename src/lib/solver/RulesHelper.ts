import {Square} from "../game/Square";
import * as _ from "lodash";
import {Sudoku} from "../game/Sudoku";
import {TRuleFunction} from "./SolverRule";
import {SudokuStateChange} from "../game/SudokuStateChange";

export class RulesHelper {
    //TODO document!
    static getUnsetSquares(unit: Square[]): Square[] {
        let unsetSquares: Square[] = [];
        unit.forEach((square) => {
            if (square.getCandidates() !== null)  {
                unsetSquares.push(square);
            }
        });
        return unsetSquares;
    }

    //TODO validate input and document!
    static getTupelsOfSquares(squares: Square[], length: number): Square[][] {
        let tupels: Square[][] = [];
        let tupleIndices = _.range(length);
        tupleIndices.forEach((tupleIndex) => {
            if (tupleIndex === 0) {
                squares.forEach((square) => {
                    tupels.push([square]);
                });
            } else {
                let newTupels:Square[][] = [];
                tupels.forEach((tupel) => {
                    squares.forEach((square) => {
                        if(tupel[tupel.length - 1].getIndex() < square.getIndex()) {
                            newTupels.push(_.concat(tupel, square));
                        }
                    });
                })
                tupels = newTupels;
            }
        })
        return tupels;
    }

    //TODO test, validate input and document!
    static findCommonUnits(sudoku: Sudoku, squares: Square[]): Square[][] {
        //find intersection of all unit indices of all squares
        let allUnits = sudoku.getUnits();
        let intersection = _.range(27);
        squares.forEach((square) => {
           intersection = _.intersection(intersection, square.getUnitIndices());
        });
        return intersection.map((unitIndex) => allUnits[unitIndex]);
    }

    //TODO document
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
