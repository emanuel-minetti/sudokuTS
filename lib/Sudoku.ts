
import * as _ from "lodash";
import {Square} from "./Square";

export class Sudoku {
    static squareIndices: number[] = _.range(81);
    static unitIndices: number[] = _.range(9);
    static rowIndicesArray: number[][] =
        Sudoku.unitIndices.map(value => _.range(value, value + 9, 1));
    static columnIndicesArray: number[][] =
        Sudoku.unitIndices.map(value => _.range(value, value + 72, 9));
    static boxIndicesArray: number[][] =
        Sudoku.unitIndices.map(value => _.union(
            _.range(value, value + 3, 1),
            _.range(value + 9, value + 12, 1),
            _.range(value + 18, value + 21, 1)));

    private squares: Square[];
    private rows: Square[][];
    private columns: Square[][];
    private boxes: Square[][];

    constructor() {
        this.squares = Sudoku.squareIndices.map(value => new Square(value));
        this.rows = Sudoku.unitIndices.map(
            value => Sudoku.rowIndicesArray[value].map(
                value2 => this.squares[value2]));
        this.columns = Sudoku.unitIndices.map(
            value => Sudoku.columnIndicesArray[value].map(
                value2 => this.squares[value2]));
        this.boxes = Sudoku.unitIndices.map(
            value => Sudoku.boxIndicesArray[value].map(
                value2 => this.squares[value2]));

    }

    setValue(index: number, value: number) {
        if (this.squares[index].getValue() !== null) {
            throw new Error("Square aledy filled!");
        }
        let peersValues: (number | null)[] =
            this.squares[index].getPeerIndices().map(
                value2 => this.squares[value2].getValue());
        if (peersValues.indexOf(value) !== -1) {
            throw new Error("Value already filled by peer!");
        }
    }
}
