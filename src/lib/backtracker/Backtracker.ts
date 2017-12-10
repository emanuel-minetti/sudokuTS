import * as _ from "lodash";

import {SudokuGame} from "../game/SudokuGame";
import {Sudoku} from "../game/Sudoku";
import {Square} from "../game/Square";

export class Backtracker {
    private readonly game: SudokuGame;
    private rows: boolean[][];
    private columnNames: string[];

    constructor(game: SudokuGame) {
        this.game = game;
        this.columnNames = this.createColumnNames();
        this.rows = this.createEmptyRepresentation();
        game.getCurrentState().getSquares().filter(square => square.isSet()).forEach(square =>
            this.setValue(square, square.getValue()!))
    }

    private createColumnNames(): string[] {
        let columnNames: string[];
        let emptySudoku = new Sudoku();
        columnNames = emptySudoku.getSquares().map(square => "Some number in square " + square.getName());
        Sudoku.values.forEach(value => {
            _.concat(columnNames, Sudoku.columnNames.map(columnName =>
                value + " must be present in column " + columnName));
            _.concat(columnNames, Sudoku.rowNames.map(rowName =>
                value + " must be present in column " + rowName));
            _.concat(columnNames, Sudoku.boxNames.map(boxName =>
                value + " must be present in column " + boxName));
        })
        return columnNames;
    }

    private createEmptyRepresentation():boolean[][] {
        let rows:boolean[][] = [];
        let emptySudoku = new Sudoku();
        Sudoku.values.forEach(value => {
            emptySudoku.getSquares().forEach(square => {
                let row = this.columnNames.map(() => false);
                this.getColumnsIndices(square, value).forEach(columnIndex => row[columnIndex] = true);
            })
        })
        return rows;
    }

    private getColumnsIndices(square: Square, value: number): number[] {
        let columnIndices: number[] = [];
        columnIndices.push(square.getIndex());
        columnIndices.push(81 + (value - 1) * 3 + square.getColumnIndex());
        columnIndices.push(82 + (value - 1) * 3 + square.getRowIndex());
        columnIndices.push(83 + (value - 1) * 3 + square.getBoxIndex());
        return columnIndices;
    }

    //TODO implement
    private setValue(square: Square, value: number) {
    }
}
