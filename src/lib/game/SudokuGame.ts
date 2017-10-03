import {Sudoku} from "./Sudoku";

/**
 * A class to represent a 'move' of a sudoku game.
 *
 * It provides an index and a value to set as well as a
 * optional reason and rating.
 */
export class SudokuStateChange {
    index: number;
    value: number;
    reason?: string;
    rating?: number;

    constructor(index: number, value: number, reason?: string, rating?: number) {
        this.index = index;
        this.value = value;
        this.reason = reason;
        this.rating = rating;
    }
}

/**
 * A class to represent a sudoku game.
 *
 * A sudoku game is a class which has
 * an original state, which can apply a move, which assures that
 * an applied move is valid and tests whether it's solved. In
 * addition it provides a history (i.e. an array of {@code SudokuStateChange}
 * and if solved a solved state. It also stores a summed up rating to
 * the changes made so far.
 */
export class SudokuGame {

    private readonly originalState: Sudoku;
    private changes: SudokuStateChange[];
    private currentState: Sudoku;
    private solvedState: Sudoku | null;
    private rating?: number;

    constructor(sudokuString: string) {
        this.originalState = Sudoku.createSudokuByString(sudokuString);
        this.changes = [];
        this.currentState = Sudoku.copy(this.originalState);
        this.solvedState = null;
    }

    getChanges(): SudokuStateChange[] {
        return this.changes;
    }

    getOriginalState(): Sudoku {
        return this.originalState;
    }

    getCurrentState(): Sudoku {
        return this.currentState;
    }

    getSolvedState(): Sudoku | null {
        return this.solvedState;
    }

    getRating(): number | undefined {
        return this.rating;
    }

    /**
     * Applies a move to a sudoku game.
     *
     * Returns whether this move was legal. If the move was legal,
     * the move is executed the optional reason and rating are set.
     * If the game was solved with this move the appropriate fields
     * are set.
     *
     * @param {SudokuStateChange} move the move to do
     * @returns {boolean} whether the move was legal
     */
    changeState(move: SudokuStateChange): boolean {
        try {
            this.currentState.setValue(move.index, move.value);
            this.changes.push(new SudokuStateChange(move.index, move.value, move.reason, move.rating));
            if (move.rating) {
                this.rating = this.rating ? this.rating += move.rating : move.rating;
            }
            if (this.currentState.isSolved()) {
                this.solvedState = this.currentState;
            }
            return true;
        }
        catch (e) {
            return false
        }
    };

    /**
     * Returns a string summoning all changes made to this game.
     *
     * @returns {string} the string representing the changes made
     */
    getChangesString(): string {
        let stringArray: string[] = [];
        this.changes.forEach((change) => {
            let changeString: string;
            changeString = 'Changed Square ' + this.currentState.getSquares()[change.index].getName();
            changeString += ' to value ' + change.value;
            changeString += change.reason ? ' because ' + change.reason + '\n' : '\n';
            changeString += '\tRating: ' + change.rating + '\n';
            stringArray.push(changeString)
        });
        return stringArray.join('');
    }

    /**
     * Returns whether the game is solved
     *
     * @returns {boolean} whether the game is solved
     */
    isSolved(): boolean {
        return this.solvedState !== null;
    }
}