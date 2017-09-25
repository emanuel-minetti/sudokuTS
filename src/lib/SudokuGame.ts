import {Sudoku} from "./Sudoku";

export class SudokuGame {
    originalState: Sudoku;
    changes: string[];
    currentState: Sudoku;
    solvedState: Sudoku | undefined;
    rating: number | undefined;

    constructor(sudokuString: string) {
        this.originalState = Sudoku.createSudokuByString(sudokuString);
        this.changes = [];
        this.currentState = Object.create(this.originalState);
    }
}