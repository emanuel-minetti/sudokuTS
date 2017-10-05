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

    // useful ranges
    static squareIndices: number[] = _.range(81);
    static unitIndices: number[] = _.range(9);
    static values: number[] = _.range(1, 10, 1);

    // indices of the units
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

    // unit names
    static rowNames: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    static columnNames: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
    static boxNames: string[] = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
    static unitNames = _.concat(Sudoku.rowNames, Sudoku.columnNames, Sudoku.boxNames);

    // properties
    private readonly squares: Square[];
    private readonly rows: Square[][];
    private readonly columns: Square[][];
    private readonly boxes: Square[][];
    private readonly units: Square[][];
    private numberOfSetSquares: number;

    constructor() {
        this.squares = Sudoku.squareIndices.map(squareIndex => new Square(squareIndex));
        this.rows = Sudoku.unitIndices.map(unitIndex => Sudoku.rowIndicesArray[unitIndex].map(
            squareIndex => this.squares[squareIndex]));
        this.columns = Sudoku.unitIndices.map(unitIndex => Sudoku.columnIndicesArray[unitIndex].map(
            squareIndex => this.squares[squareIndex]));
        this.boxes = Sudoku.unitIndices.map(unitIndex => Sudoku.boxIndicesArray[unitIndex].map(
            squareIndex => this.squares[squareIndex]));
        this.units = _.concat(this.rows, this.columns, this.boxes);
        this.numberOfSetSquares = 0;
    }

    /**
     * Creates and returns a new {@code Sudoku] from a string representing a
     * puzzle.
     *
     * It awaits a string containing 81 values of a sudoku puzzle
     * and arbitrary many other characters, A value may be one of
     * numbers from one to nine or one of the characters '*' or '0'
     * to represent a missing value. It returns a new valid instance of
     * the Sudoku class or throws an error if the given string doesn't
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

    /**
     * Creates and returns a copy of the given sudoku.
     *
     * @param {Sudoku} the original sudoku
     * @returns {Sudoku} the copy
     */
    static copy(original: Sudoku): Sudoku {
        let copy = new Sudoku();
        Sudoku.squareIndices.forEach((index) => {
            let value = original.squares[index].getValue();
            if (value) {
                copy.setValue(index, value);
            }
        })
        return copy;
    }

    /**
     * Returns a nicely formatted string representation of a sudoku
     *
     * @returns {string} the string representation of the sudoku
     */
    toString(): string {
        let resultArray: string[] = [];
        let values: (number | null)[] = this.squares.map((square) => square.getValue());
        values.forEach((value, index) => {
            resultArray.push(value ? value.toString() : '*');
            let pos = index + 1;
            if (pos % 3 === 0) {              //end of column block
                resultArray.push(' ');
                if (pos % 9 === 0) {          //end of row
                    if (pos % 27 === 0) {     //end of row block
                        if (pos !== 81) {
                            resultArray.push('\n            \n');
                        }
                    }
                    else {
                        resultArray.push('\n')
                    }
                }
            }
        });
        resultArray.push('\n');
        return resultArray.join('');
    }

    /**
     * Sets a value of a square or throws an error.
     *
     * Sets the given value of the {@code Square} with the given
     * index.
     *
     * @param {number} index of the square to set its value
     * @param {number} value to set
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

    //TODO document
    removeCandidates(index: number, values: number[]): boolean {
        return this.squares[index].removeCandidates(values);
    }

    getSquares(): Square[] {
        return this.squares;
    }

    isSolved(): boolean {
        return this.numberOfSetSquares === 81;
    }

    getRows() {
        return this.rows;
    }

    getUnits() {
        return this.units;
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
}
