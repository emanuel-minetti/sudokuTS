
import * as _ from "lodash";
import {Square} from "./Square";

export class Sudoku {
    static squareIndices: number[] = _.range(81);
    static unitIndices: number[] = _.range(9);
    static rowIndicesArray: number[][] =
        Sudoku.unitIndices.map(unitIndex => _.range(unitIndex, unitIndex + 9, 1));
    static columnIndicesArray: number[][] =
        Sudoku.unitIndices.map(unitIndex => _.range(unitIndex, unitIndex + 72, 9));
    static boxIndicesArray: number[][] =
        Sudoku.unitIndices.map(unitIndex => _.union(
            _.range(unitIndex, unitIndex + 3, 1),
            _.range(unitIndex + 9, unitIndex + 12, 1),
            _.range(unitIndex + 18, unitIndex + 21, 1)));

    private squares: Square[];
    private rows: Square[][];
    private columns: Square[][];
    private boxes: Square[][];

    constructor() {
        this.squares = Sudoku.squareIndices.map(squareIndex => new Square(squareIndex));
        this.rows = Sudoku.unitIndices.map(unitIndex => Sudoku.rowIndicesArray[unitIndex].map(
            squareIndex => this.squares[squareIndex]));
        this.columns = Sudoku.unitIndices.map(unitIndex => Sudoku.columnIndicesArray[unitIndex].map(
            squareIndex => this.squares[squareIndex]));
        this.boxes = Sudoku.unitIndices.map(unitIndex => Sudoku.boxIndicesArray[unitIndex].map(
            squareIndex => this.squares[squareIndex]));

    }

    setValue(index: number, value: number) {
        if (this.squares[index].getValue() !== null) {
            throw new Error("Square already filled!");
        }
        let peersValues: (number | null)[] =
            this.squares[index].getPeerIndices().map(
                value2 => this.squares[value2].getValue());
        if (peersValues.indexOf(value) !== -1) {
            //TODO find offending squareIndex and adjust error message
            throw new Error("Value already filled by peer!");
        }
    }
}
