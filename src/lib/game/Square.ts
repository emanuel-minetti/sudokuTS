import {Sudoku} from "./Sudoku";
import * as _ from "lodash";

/**
 * Represents a square of a {@code Sudoku}.
 *
 * A {@code Square} is part of a collection of {@code Square}s in
 * a {@code Sudoku}.
 *
 * Provides a collection of candidates which are valid values
 * to fill in this square. It also provides it's units, row, column
 * and peers as indices of the owning {@code Sudoku}. In addition
 * it provides a name of the square.
 */
export class Square {

    private readonly index: number;
    private readonly row: number;
    private readonly column: number;
    private readonly box: number;
    private readonly peerIndices: number[];
    private readonly name: string;
    private value: number | null;
    private candidates: number[] | null;

    constructor(index: number) {
        this.index = index;
        this.row = _.findIndex(Sudoku.rowIndicesArray, (a) => _.indexOf(a, index) !== -1);
        this.column = _.findIndex(Sudoku.columnIndicesArray, (a) => _.indexOf(a, index) !== -1);
        this.box = _.findIndex(Sudoku.boxIndicesArray, (a) => _.indexOf(a, index) !== -1);
        this.peerIndices = _.pull(_.union(Sudoku.rowIndicesArray[this.row],
            Sudoku.columnIndicesArray[this.column], Sudoku.boxIndicesArray[this.box]), index);
        this.value = null;
        this.candidates = Sudoku.values.slice();
        this.name = Sudoku.columnNames[this.column] + Sudoku.rowNames[this.row];
    }

    getValue(): number | null {
        return this.value;
    }

    setValue(value: number): void {
        this.value = value;
        this.candidates = null;
    }

    getPeerIndices(): number[] {
        return this.peerIndices;
    }

    getCandidates(): number[] | null {
        return this.candidates;
    }

    getRowIndex() {
        return this.row;
    }

    getRowName() {
        return Sudoku.rowNames[this.row];
    }

    getName() {
        return this.name;
    }

    getColumnIndex() {
        return this.column;
    }

    getColumnName() {
        return Sudoku.columnNames[this.column];
    }

    getBoxIndex() {
        return this.box;
    }

    getBoxName() {
        return Sudoku.boxNames[this.box];
    }

    getIndex() {
        return this.index;
    }
}