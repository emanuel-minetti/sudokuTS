import {Sudoku} from "./Sudoku";
import {StringRepresentable} from "lodash";

export class SudokuStateChange {
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

    private readonly originalState: Sudoku;
    private changes: SudokuStateChange[];
    private currentState: Sudoku;
    private solvedState: Sudoku | null;
    private rating?: number;

    constructor(sudokuString: string) {
        this.originalState = Sudoku.createSudokuByString(sudokuString);
        this.changes = [];
        //TODO Third: use a newly created static copy method for copying sudokus
        this.currentState = Sudoku.copy(this.originalState);
        this.solvedState = null;
    }

    getChanges(): SudokuStateChange[] {
        return this.changes;
    }

    getOriginalState(): Sudoku {
        return this.originalState;
    }

    getCurrentState() {
        return this.currentState;
    }

    getSolvedState() {
        return this.solvedState;
    }

    getRating() {
        return this.rating;
    }

    doChangeState(index: number, value: number, reason?: string, rating?: number): boolean {
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

    changeState(move: SudokuStateChange): boolean {
        return this.doChangeState(move.index, move.value, move.reason, move.rating);
    }

    getChangesString(): string {
        let stringArray: string[] = [];
        this.changes.forEach((change) => {
            let changeString: string;
            changeString = 'Changed Square ' + this.currentState.getSquares()[change.index].getName();
            changeString += ' to value ' + change.value;
            changeString += change.reason ? ' because ' + change.reason + '\n' : '\n';
            stringArray.push(changeString)
        });
        return stringArray.join('');
    }

    isSolved(): boolean {
        return this.solvedState !== null;
    }
}