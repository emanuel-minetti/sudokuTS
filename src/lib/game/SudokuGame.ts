import {Sudoku} from "./Sudoku";

/**
 * A class to represent a 'move' of a sudoku game.
 *
 * A 'move' may be to set a square to a value or to remove
 * an array of numbers from the candidates of a square.
 * It provides an index and a value (which may be an array
 * of numbers in case these are the values to remove from candidates)
 * to set as well as an optional reason and rating.
 */
export class SudokuStateChange {
    private index: number;
    private value: number | number[];
    private reason?: string;
    private rating?: number;

    constructor(index: number, value: number | number[], reason?: string, rating?: number) {
        this.index = index;
        this.value = value;
        this.reason = reason;
        this.rating = rating;
    }

    getIndex() {
        return this.index;
    }

    getValue() {
        return this.value;
    }

    getReason() {
        return this.reason;
    }

    getRating() {
        return this.rating;
    }

    setRating(rating: number) {
        this.rating = rating;
    }

    setReason(reason: string) {
        this.reason = reason;
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
     * A 'move' may be to set a square to a value or to remove a set of
     * values from the candidates of a square ({@see SudokuStateChange}).
     * To set a value is legal if the square isn't already set and the value
     * is a candidate of that square. To remove candidates is always legal.
     * Returns whether this move was legal. If the move was legal,
     * the move is executed the optional reason and rating are set.
     * If the game was solved with this move the appropriate fields
     * are set.
     *
     * @param {SudokuStateChange} move the move to do
     * @returns {boolean} whether the move was legal
     */
    changeState(move: SudokuStateChange): boolean {
        let value = move.getValue();
        if (typeof value === "number") {
            // set a value
            try {
                this.currentState.setValue(move.getIndex(), value);
                this.changes.push(new SudokuStateChange(move.getIndex(),
                    move.getValue(), move.getReason(), move.getRating()));
                let rating = move.getRating();
                if (rating) {
                    this.rating = this.rating ? this.rating += rating : rating;
                }
                if (this.currentState.isSolved()) {
                    this.solvedState = this.currentState;
                }
                return true;
            }
            catch (e) {
                return false
            }
        } else {
            // remove candidates
            this.currentState.removeCandidates(move.getIndex(), value);
            return true;
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
            changeString = 'Changed Square ' + this.currentState.getSquares()[change.getIndex()].getName();
            changeString += ' to value ' + change.getValue();
            changeString += change.getReason() ? ' because ' + change.getReason() + '\n' : '\n';
            changeString += '\tRating: ' + change.getRating() + '\n';
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

    /**
     * Returns a nice representation of the current state of a game
     * and some statistics.
     *
     * @returns {string} the representation of the current state
     */
    toString(): string {
        let result = 'Moves:\n' + this.getChangesString() +
            '\nNumber of Moves: ' + this.getChanges().length +
            '\nRating: ' + this.getRating() +
            '\nSolved: ' + this.isSolved() +
            '\nCurrent state:\n\n' + this.getCurrentState().toString();
        return result;
    }
}