import * as _ from "lodash";

import {SudokuGame} from "../game/SudokuGame";
import {Sudoku} from "../game/Sudoku";
import {Square} from "../game/Square";
import {ColumnChooser, DataObject, IResultHandler, SimpleResultHandler, TChooseColumnFn} from "./DLXHelpers";
import {DLX} from "./DLX";
import {SudokuStateChange} from "../game/SudokuStateChange";

//TODO document and comment
export class Backtracker {
    private readonly game: SudokuGame;
    private _rows: boolean[][];
    private _columnNames: string[];

    constructor(game: SudokuGame) {
        this.game = game;
        this._columnNames = this.createColumnNames();
        this._rows = this.createRows();
        game.getCurrentState().getSquares().filter(square => square.isSet()).forEach(square =>
            this.setValue(square, square.getValue()!))
    }

    public solve(findAll: boolean = false, strategy: TChooseColumnFn = ColumnChooser.chooseColumnSmallest) {
        let sudokuResultHandler = new SudokuResultHandler(this.game.getCurrentState());
        let dlx = new DLX(this._columnNames, this._rows, sudokuResultHandler, strategy);
        dlx.solve();
        let moves = sudokuResultHandler.getResult();
        moves.forEach(move => {
           this.game.changeState(move);
        });
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

    private createRows():boolean[][] {
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

    private setValue(square: Square, value: number) {
        let valuesToRemove = Sudoku.values.filter(valueToRemove => valueToRemove !== value);
        valuesToRemove.forEach(valueToRemove => {
            this._rows[this.getRow(square, valueToRemove)] = this.columnNames.map(columnName => false);
        });
    }

    private getRow(square: Square, value: number): number {
        return (((value - 1) * 81) + square.getIndex());
    }
}

//TODO document and comment
class SudokuResultHandler implements IResultHandler {
    private moves: SudokuStateChange[] = [];
    private sudoku: Sudoku;

    constructor(sudoku: Sudoku) {
        this.sudoku = sudoku;
    }

    processResult = (root: DataObject, solution: DataObject[]) => {
        let node: DataObject;
        let columnName: string;
        let matchResultSquare: RegExpMatchArray | null;
        let matchResultValue: RegExpMatchArray | null;
        let squareMatcher = /square ([ABCDEFGHJ]\d$)/;
        let valueMatcher = /^(\d) must be present in /;
        let square: Square | null;
        let value: number | null;
        solution.forEach((row) => {
            node = row;
            square = null;
            value = null;
            do {
                columnName = node.column.name;
                matchResultSquare = columnName.match(squareMatcher);
                matchResultValue = columnName.match(valueMatcher);
                if (matchResultSquare) {
                    square = this.sudoku.getSquareByName(matchResultSquare[1]);
                }
                else if (matchResultValue) {
                    value = Number.parseInt(matchResultValue[1]);
                }
                else {
                    throw new Error("Unexpected column name");
                }
                node = node.right;
            }
            while (node != row && !(square && value))
            if (square && value) {
                if (!square.isSet()) {
                    this.moves.push(new SudokuStateChange(square.getIndex(), value,
                        "Square " + square.getName() + " set to " + value + " by backtracking"));
                }
            }
            else {
                throw new Error("Unexpected row in result")
            }
        });
    }

    getResult = () => this.moves;
}
