import {Square} from "../game/Square";
import * as _ from "lodash";

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

    //TODO test and document!
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
        // tupels.forEach((tupel) => {
        //     console.log('Tupel: ')
        //     tupel.forEach((square) => {
        //         console.log(square.getIndex() + ' ');
        //     })
        //     console.log('\n')
        // })

        return tupels;
    }
}
