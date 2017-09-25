import {Sudoku} from "./Sudoku";

class SudokuStateChange {
    constructor(index: number ,value: number, reason?: string, rating?: number) { }
}

export class SudokuGame {
    originalState: Sudoku;
    changes: SudokuStateChange[];
    currentState: Sudoku;
    solvedState?: Sudoku;
    rating: number | undefined;

    constructor(sudokuString: string) {
        this.originalState = Sudoku.createSudokuByString(sudokuString);
        this.changes = [];
        this.currentState = Object.create(this.originalState);
    }

    changeState(index: number, value: number, reason?: string, rating?: number): boolean {
        try {
            this.currentState.setValue(index, value);
        }
        catch (e) {
            return false
        }
        finally {
            this.changes.push(new SudokuStateChange(index, value, reason, rating));
            if (rating) {
               this.rating = this.rating ? this.rating += rating : rating;
            }
            if (this.currentState.solved()) {
                this.solvedState = this.currentState;
            }
            return true;
        }
    };
}