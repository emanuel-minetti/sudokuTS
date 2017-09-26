import * as _ from "lodash";
import {Square} from "./Square";

/**
 * A class that represents a valid state of a sudoku game.
 *
 * It provides the units of a sudoku as well as the rows,
 * columns, boxes and individual squares of a single state
 * of a sudoku game.
 */
export class Sudoku {
    static squareIndices: number[] = _.range(81);
    static unitIndices: number[] = _.range(9);
    static rowIndicesArray: number[][] =
        Sudoku.unitIndices.map(unitIndex => _.range(unitIndex * 9, unitIndex * 9 + 9, 1));
    static columnIndicesArray: number[][] =
        Sudoku.unitIndices.map(unitIndex => _.range(unitIndex, unitIndex + 73, 9));
    static boxIndicesArray: number[][] =
        Sudoku.unitIndices.map(unitIndex => {
            let intQuotient = Math.floor(unitIndex / 3);
            let intRemainder = unitIndex % 3;
            let baseValue = intRemainder * 3 + intQuotient * 27;
            return _.union(
                _.range(baseValue, baseValue + 3, 1),
                _.range(baseValue + 9, baseValue + 12, 1),
                _.range(baseValue + 18, baseValue + 21, 1));
        });
    private squares: Square[];
    private rows: Square[][];
    private columns: Square[][];
    private boxes: Square[][];
    private numberOfSetSquares: number;

    constructor() {
        this.squares = Sudoku.squareIndices.map(squareIndex => new Square(squareIndex));
        this.rows = Sudoku.unitIndices.map(unitIndex => Sudoku.rowIndicesArray[unitIndex].map(
            squareIndex => this.squares[squareIndex]));
        this.columns = Sudoku.unitIndices.map(unitIndex => Sudoku.columnIndicesArray[unitIndex].map(
            squareIndex => this.squares[squareIndex]));
        this.boxes = Sudoku.unitIndices.map(unitIndex => Sudoku.boxIndicesArray[unitIndex].map(
            squareIndex => this.squares[squareIndex]));
        this.numberOfSetSquares = 0;
    }

    /**
     * Creates a new {@code Sudoku] from a string representing a puzzle.
     *
     * It awaits a string containing 81 values of a sudoku puzzle
     * and arbitrary many other characters, A value may be one of
     * numbers from one to nine or one of the characters '*' or '0'
     * to represent a missing value. It returns a new valid instance of
     * the Sudoku class or an error if the given string doesn't
     * represent a valid state of a sudoku.
     *
     * @param {string} sudokuString the representing string
     * @returns {Sudoku} the new instance of the Sudoku class.
     */
    static createSudokuByString(sudokuString: string) {
        let sudoku = new Sudoku();
        try {
            sudoku.parseString(sudokuString);
        } catch (e) {
            throw e;
        }
        return sudoku;
    }

    //TODO create a static copy method for sudoku
    // static copy(orig: Sudoku): Sudoku {
    //
    // }

    /**
     * Sets a value of a square or throws an error.
     *
     * Sets the given value of the {@code Square} with the given
     * index.
     *
     * @param {number} index
     * @param {number} value
     */
    setValue(index: number, value: number) {
        let square = this.squares[index];

        if (square.getCandidates() === null) {
            throw new Error("Square already filled!");
        }

        if (_.indexOf(square.getCandidates(), value) !== -1) {
            // 'value' is 'candidate', so set it, remove it
            // from 'candidates' of all peers and increment numberOfSetSquares
            square.setValue(value);
            square.getPeerIndices().forEach(peerIndex => {
                let candidates = this.squares[peerIndex].getCandidates();
                if (candidates !== null) {
                    _.pull(candidates, value);
                }
            });
            this.numberOfSetSquares++;
        }
        else {
            // 'value' isn't candidate, so find offending peers
            let errorMessage = '';
            // check rows
            let rowValues = this.rows[square.getRowIndex()].map(squareInRow => squareInRow.getValue());
            let rowValuesIndex = _.indexOf(rowValues, value);
            if (rowValuesIndex !== -1) {
                errorMessage += 'Value: ' + value + ' is already set in row: ' + square.getRowName() +
                    ' by square: ' + this.rows[square.getRowIndex()][rowValuesIndex].getName() + '!\n';
            }
            // check columns
            let columnValues = this.columns[square.getColumnIndex()].map(squareInColumn => squareInColumn.getValue());
            let columnValuesIndex = _.indexOf(columnValues, value);
            if (columnValuesIndex !== -1) {
                errorMessage += 'Value: ' + value + ' is already set in column: ' + square.getColumnName() +
                    ' by square: ' + this.columns[square.getColumnIndex()][columnValuesIndex].getName() + '!\n';
            }
            // check boxes
            let boxValues = this.boxes[square.getBoxIndex()].map(squareInBox => squareInBox.getValue());
            let boxValuesIndex = _.indexOf(boxValues, value);
            if (boxValuesIndex !== -1) {
                errorMessage += 'Value: ' + value + ' is already set in box: ' + square.getBoxName() +
                    ' by square: ' + this.boxes[square.getBoxIndex()][boxValuesIndex].getName() + '!\n';
            }
            throw new Error(errorMessage);
        }
    }

    /**
     * Parses a string and sets the values of {@code this} or throws an error if
     * string doesn't represent a valid state of a sudoku.
     *
     * @param {string} sudokuString the string to parse
     */
    private parseString(sudokuString: string) {
        let charArray = sudokuString.split('');
        _.remove(charArray, char => _.indexOf(['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0'], char) === -1);
        if (charArray.length !== 81) {
            throw new Error('Wrong length of input!');
        }
        charArray.forEach((char, index) => {
            let value = parseInt(char);
            if (!isNaN(value) && value !== 0) {
                this.setValue(index, value);
            }
        });
    }

    getSquares(): Square[] {
        return this.squares;
    }

    solved(): boolean {
        return this.numberOfSetSquares === 81;
    }

    getRows() {
    return this.rows;
    }
}
