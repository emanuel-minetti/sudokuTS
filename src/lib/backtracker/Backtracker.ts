import * as _ from "lodash";

import {SudokuGame} from "../game/SudokuGame";
import {Sudoku} from "../game/Sudoku";
import {Square} from "../game/Square";
import {ColumnChooser, SimpleResultHandler, TChooseColumnFn} from "./DLXHelpers";
import {DLX} from "./DLX";

//TODO document
export class Backtracker {
    private readonly game: SudokuGame;
    private _rows: boolean[][];
    private _columnNames: string[];

    constructor(game: SudokuGame) {
        this.game = game;
        this._columnNames = this.createColumnNames();
        this._rows = this.createEmptyRepresentation();
        game.getCurrentState().getSquares().filter(square => square.isSet()).forEach(square =>
            this.setValue(square, square.getValue()!))
    }

    //TODO implement sudoku result handler
    public solve(findAll: boolean = false, strategy: TChooseColumnFn = ColumnChooser.chooseColumnSmallest) {
        let srh = new SimpleResultHandler();
        let dlx = new DLX(this._columnNames, this._rows, srh, strategy);
        dlx.solve();
        console.log(srh.getResult());
    }

    public get rows(): boolean[][] {
        return this._rows;
    }

    public get columnNames(): string[] {
        return this._columnNames;
    }

    private createColumnNames(): string[] {
        let columnNames: string[];
        let emptySudoku = new Sudoku();
        columnNames = emptySudoku.getSquares().map(square => "Some number in square " + square.getName());
        Sudoku.values.forEach(value => {
            columnNames = _.concat(columnNames, Sudoku.columnNames.map(columnName =>
                value + " must be present in column " + columnName));
            columnNames = _.concat(columnNames, Sudoku.rowNames.map(rowName =>
                value + " must be present in row " + rowName));
            columnNames = _.concat(columnNames, Sudoku.boxNames.map(boxName =>
                value + " must be present in box " + boxName));
        })
        return columnNames;
    }

    private createEmptyRepresentation():boolean[][] {
        let rows: boolean[][] = [];
        let emptySudoku = new Sudoku();
        Sudoku.values.forEach(value => {
            emptySudoku.getSquares().forEach(square => {
                let row = this._columnNames.map(() => false);
                this.getColumnsIndices(square, value).forEach(columnIndex => row[columnIndex] = true);
                rows.push(row);
            })
        })
        return rows;
    }

    private getColumnsIndices(square: Square, value: number): number[] {
        let columnIndices: number[] = [];
        columnIndices.push(square.getIndex());
        columnIndices.push(81 + (value - 1) * 27 + square.getColumnIndex());
        columnIndices.push(90 + (value - 1) * 27 + square.getRowIndex());
        columnIndices.push(99 + (value - 1) * 27 + square.getBoxIndex());
        return columnIndices;
    }

    //TODO write test for setting values
    private setValue(square: Square, value: number) {
        let valuesToRemove = Sudoku.values.filter(valueToRemove => valueToRemove !== value);
        valuesToRemove.forEach(valueToRemove => {
            this._rows = this._rows.filter((row, rowIndex) =>
                this.getRowIndex(square, valueToRemove) !== rowIndex);
        });
    }

    //TODO rename
    private getRowIndex(square: Square, valueToRemove: number): number {
        return (((valueToRemove - 1) * 81) + square.getIndex());
    }
}
