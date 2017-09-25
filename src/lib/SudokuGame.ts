import {Sudoku} from "./Sudoku";
import {StringRepresentable} from "lodash";

class SudokuStateChange {
    index: number;
    value: number;
    reason?: string;
    rating?: number;
    constructor(index: number ,value: number, reason?: string, rating?: number) {
        this.index = index;
        this.value = value;
        this.reason = reason;
        this.rating = rating;
    }
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
            this.changes.push(new SudokuStateChange(index, value, reason, rating));
            if (rating) {
                this.rating = this.rating ? this.rating += rating : rating;
            }
            if (this.currentState.solved()) {
                this.solvedState = this.currentState;
            }
            return true;
        }
        catch (e) {
            return false
        }
    };

    getChangesString(): string {
        let stringArray: string[] = [];
        this.changes.forEach((change) => stringArray.push(change.reason ? change.reason : '\n'));
        return stringArray.join('\n');
    }
}