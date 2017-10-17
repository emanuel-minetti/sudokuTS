import {Square} from "../game/Square";
import * as _ from "lodash";
import {Sudoku} from "../game/Sudoku";

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
}
