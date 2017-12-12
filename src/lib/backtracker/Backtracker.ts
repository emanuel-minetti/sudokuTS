import * as _ from "lodash";

import {SudokuGame} from "../game/SudokuGame";
import {Sudoku} from "../game/Sudoku";
import {Square} from "../game/Square";
import {ColumnChooser, SimpleResultHandler, TChooseColumnFn} from "./DLXHelpers";
import {DLX} from "./DLX";

//TODO document
export class Backtracker {
    private readonly game: SudokuGame;
    rows: boolean[][];
    columnNames: string[];

    //TODO Write tests for constructor
    constructor(game: SudokuGame) {
        this.game = game;
        this.columnNames = this.createColumnNames();
        this.rows = this.createEmptyRepresentation();
        game.getCurrentState().getSquares().filter(square => square.isSet()).forEach(square =>
            this.setValue(square, square.getValue()!))
    }

    //TODO implement sudoku result handler
    public solve(findAll: boolean = false, strategy: TChooseColumnFn = ColumnChooser.chooseColumnSmallest) {
        let srh = new SimpleResultHandler();
        let dlx = new DLX(this.columnNames, this.rows, srh, strategy);
        dlx.solve();
        //TODO remove logging to console
        console.log(srh.getResult());
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
                let row = this.columnNames.map(() => false);
                this.getColumnsIndices(square, value).forEach(columnIndex => row[columnIndex] = true);
                rows.push(row);
            })
        })
        return rows;
    }

    private getColumnsIndices(square: Square, value: number): number[] {
        let columnIndices: number[] = [];
        columnIndices.push(square.getIndex());
        columnIndices.push(80 + (value - 1) * 3 + square.getColumnIndex());
        columnIndices.push(81 + (value - 1) * 3 + square.getRowIndex());
        columnIndices.push(82 + (value - 1) * 3 + square.getBoxIndex());
        return columnIndices;
    }

    private setValue(square: Square, value: number) {
        let valuesToRemove = Sudoku.values.filter(valueToRemove => valueToRemove === value);
        valuesToRemove.forEach(valueToRemove => {
            this.rows = this.rows.filter((row, rowIndex) =>
                this.getRowIndex(square, valueToRemove) !== rowIndex);
        });
    }

    private getRowIndex(square: Square, valueToRemove: number): number {
        return (valueToRemove - 1) + square.getIndex();
    }
}
