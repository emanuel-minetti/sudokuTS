import {Sudoku} from "./Sudoku";
import * as _ from "lodash";

export class Square {

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
        this.candidates = Sudoku.unitIndices.slice();
    }

    getValue(): number | null {
        return this.value;
    }

    setValue(value: number): void {
            this.value = value;
    }

    getPeerIndices(): number[] {
        return this.peersIndices;
    }
}