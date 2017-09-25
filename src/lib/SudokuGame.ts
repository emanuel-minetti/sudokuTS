import {Sudoku} from "./Sudoku";

class SudokuStateChange {
    index: number;
    value: number;
    reason: string | undefined;
    rating: number | undefined;
}

export class SudokuGame {
    originalState: Sudoku;
    changes: SudokuStateChange[];
    currentState: Sudoku;
    solvedState: Sudoku | undefined;
    rating: number | undefined;

    constructor(sudokuString: string) {
        this.originalState = Sudoku.createSudokuByString(sudokuString);
        this.changes = [];
        this.currentState = Object.create(this.originalState);
    }
}