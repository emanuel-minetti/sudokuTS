
import * as _ from "lodash";
import {Square} from "./Square";

export class Sudoku {
    static squareIndices: number[] = _.range(81);
    static unitIndices: number[] = _.range(9);
    static rowIndicesArray: number[][] =
        Sudoku.unitIndices.map(unitIndex => _.range(unitIndex, unitIndex + 9, 1));
    static columnIndicesArray: number[][] =
        Sudoku.unitIndices.map(unitIndex => _.range(unitIndex, unitIndex + 72, 9));
    static boxIndicesArray: number[][] =
        Sudoku.unitIndices.map(unitIndex => _.union(
            _.range(unitIndex, unitIndex + 3, 1),
            _.range(unitIndex + 9, unitIndex + 12, 1),
            _.range(unitIndex + 18, unitIndex + 21, 1)));

    static createSudokuByString(sudokuString: string) {
        let sudoku = new Sudoku();
        try {
            sudoku.parseString(sudokuString);
        } catch (e) {
            throw e;
        }
        return sudoku;
    }

    private squares: Square[];
    private rows: Square[][];
    private columns: Square[][];
    private boxes: Square[][];

    constructor() {
        this.squares = Sudoku.squareIndices.map(squareIndex => new Square(squareIndex));
        this.rows = Sudoku.unitIndices.map(unitIndex => Sudoku.rowIndicesArray[unitIndex].map(
            squareIndex => this.squares[squareIndex]));
        this.columns = Sudoku.unitIndices.map(unitIndex => Sudoku.columnIndicesArray[unitIndex].map(
            squareIndex => this.squares[squareIndex]));
        this.boxes = Sudoku.unitIndices.map(unitIndex => Sudoku.boxIndicesArray[unitIndex].map(
            squareIndex => this.squares[squareIndex]));

    }

    setValue(index: number, value: number) {
        let square = this.squares[index];

        if (square.getCandidates() === null) {
            throw new Error("Square already filled!");
        }

        if (_.indexOf(square.getCandidates(), value) !== -1) {
            // 'value' is 'candidate', so set it and remove it
            // from 'candidates' of all peers
            square.setValue(value);
            square.getPeerIndices().forEach(peerIndex => {
                let candidates = this.squares[peerIndex].getCandidates();
                if(candidates !== null) {
                    _.pull(candidates, value);
                }
            });
        }
        else {
            // 'value' isn't candidate, so find offending peers
            let errorMessage = '';
            // check rows
            let rowValues = this.rows[square.getRowIndex()].map(squareInRow => squareInRow.getValue());
            let rowValuesIndex = _.indexOf(rowValues, value);
            if( rowValuesIndex !== -1) {
                errorMessage += 'Value: ' + value + ' is already set in row: ' + square.getRowName() +
                    ' by square: ' + this.rows[square.getRowIndex()][rowValuesIndex].getName() + '!\n';
            }
            // check columns
            let columnValues = this.columns[square.getColumnIndex()].map(squareInColumn => squareInColumn.getValue());
            let columnValuesIndex = _.indexOf(columnValues, value);
            if( columnValuesIndex !== -1) {
                errorMessage += 'Value: ' + value + ' is already set in column: ' + square.getColumnName() +
                    ' by square: ' + this.columns[square.getColumnIndex()][columnValuesIndex].getName() + '!\n';
            }
            // check boxes
            let boxValues = this.boxes[square.getBoxIndex()].map(squareInBox => squareInBox.getValue());
            let boxValuesIndex = _.indexOf(boxValues, value);
            if( boxValuesIndex !== -1) {
                errorMessage += 'Value: ' + value + ' is already set in box: ' + square.getBoxName() +
                    ' by square: ' + this.boxes[square.getBoxIndex()][boxValuesIndex].getName() + '!\n';
            }
            throw new Error(errorMessage);
        }
    }

    parseString(sudokuString: string) {
        let charArray = sudokuString.split('');
        _.remove(charArray,char => _.indexOf(['1','2','3','4','5','6','7','8','9','*'], char) === -1);
        if (charArray.length !== 81) {
            throw new Error('Wrong length of input!');
        }
        charArray.forEach((char, index) => {
            let value = parseInt(char);
            if (!isNaN(value)) {
                this.setValue(index, value);
            }
        });
    }
}
