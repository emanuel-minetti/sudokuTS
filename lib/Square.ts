import {Sudoku} from "./Sudoku";
import * as _ from "lodash";

export class Square {
    static rowNames: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    static columnNames: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
    static boxNames: string[] = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];

    private readonly index: number;
    private readonly row: number;
    private readonly column: number;
    private readonly box: number;
    private readonly peersIndices: number[];
    private value: number | null;
    private candidates: number[] | null;

    constructor(index: number) {
        this.index = index;
        this.row = _.findIndex(Sudoku.rowIndicesArray, (a) => _.indexOf(a, index) !== -1);
        this.column = _.findIndex(Sudoku.columnIndicesArray, (a) => _.indexOf(a, index) !== -1);
        this.box = _.findIndex(Sudoku.boxIndicesArray, (a) => _.indexOf(a, index) !== -1);
        this.peersIndices = _.pull(_.union(Sudoku.rowIndicesArray[this.row],
            Sudoku.columnIndicesArray[this.column], Sudoku.boxIndicesArray[this.box]), index);
        this.value = null;
        this.candidates = _.range(1, 10, 1);
    }

    getValue(): number | null {
        return this.value;
    }

    setValue(value: number): void {
        this.value = value;
        this.candidates = null;
    }

    getPeerIndices(): number[] {
        return this.peersIndices;
    }

    getCandidates(): number[] | null {
        return this.candidates;
    }

    getRowIndex() {
        return this.row;
    }

    getRowName() {
        return Square.rowNames[this.row];
    }

    getName() {
        return Square.columnNames[this.row] + Square.rowNames[this.column];
    }

    getColumnIndex() {
        return this.column;
    }

    getColumnName() {
        return Square.columnNames[this.column];
    }

    getBoxIndex() {
        return this.box;
    }

    getBoxName() {
        return Square.boxNames[this.box];
    }
}