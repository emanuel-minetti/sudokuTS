import * as _ from "lodash";

import {DLX} from "../../../lib/backtracker/DLX";
import {ColumnChooser, SimpleResultHandler} from "../../../lib/backtracker/DLXHelpers";

describe('A newly created DLX', () => {
    it('should report an error if created with rows of false length', () => {
        let resultHandler = new SimpleResultHandler();
        expect(() => new DLX(
            ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
            [
                [false, false, true, false, true, true],
                [true, false, false, true, false, false, true],
                [false, true, true, false, false, true, false],
                [true, false, false, true, false, false, false],
                [false, true, false, false, false, false, true],
                [false, false, false, true, true, false, true]
            ],
            resultHandler
        )).toThrowError('At least one row has a wrong length');
    });

    it('should be able to solve Knuth\'s Example choosing the first column', () => {
        let resultHandler = new SimpleResultHandler();
        let dlx = new DLX(
            ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
            [
                [false, false, true, false, true, true, false],
                [true, false, false, true, false, false, true],
                [false, true, true, false, false, true, false],
                [true, false, false, true, false, false, false],
                [false, true, false, false, false, false, true],
                [false, false, false, true, true, false, true]
            ],
            resultHandler,
            ColumnChooser.chooseColumnRight
        );
        dlx.solve();
        expect(resultHandler.getResult()).toEqual(
            'A D\n' +
            'B G\n' +
            'C E F\n\n'
        );
    });

    it('should be able to solve Knuth\'s Example choosing the smallest column', () => {
        let resultHandler = new SimpleResultHandler();
        let dlx = new DLX(
            ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
            [
                [false, false, true, false, true, true, false],
                [true, false, false, true, false, false, true],
                [false, true, true, false, false, true, false],
                [true, false, false, true, false, false, false],
                [false, true, false, false, false, false, true],
                [false, false, false, true, true, false, true]
            ],
            resultHandler,
            ColumnChooser.chooseColumnSmallest
        );
        dlx.solve();
        expect(resultHandler.getResult()).toEqual(
            'A D\n' +
            'E F C\n' +
            'B G\n\n'
        );
    });

    it('should be able to solve Knuth\'s Example choosing a random column', () => {
        let resultHandler = new SimpleResultHandler();
        let dlx = new DLX(
            ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
            [
                [false, false, true, false, true, true, false],
                [true, false, false, true, false, false, true],
                [false, true, true, false, false, true, false],
                [true, false, false, true, false, false, false],
                [false, true, false, false, false, false, true],
                [false, false, false, true, true, false, true]
            ],
            resultHandler,
            ColumnChooser.chooseColumnRandom
        );
        dlx.solve();
        expect(resultHandler.getResult()).toEqual(jasmine.any(String));
    });

    it('should be able to find all solutions of the 2 x 2 Latin Square', () => {
        let resultHandler = new SimpleResultHandler();
        let columnNames: string[] = [];
        let names: string[] = ['1', '2'];
        let columnSquareNames: string[] = names.map(name => "column " + name);
        let rowSquareNames: string[] = names.map(name => "row " + name);
        columnSquareNames.forEach(columnName => {
            rowSquareNames.forEach(rowName => {
                columnNames.push("Some number in " + columnName + " and " + rowName);
            });
        });
        names.forEach(numberName => {
            rowSquareNames.forEach(rowName => {
                columnNames.push("Number " + numberName + " must appear in " + rowName);
            });
        });
        names.forEach(numberName => {
            columnSquareNames.forEach(columnName => {
                columnNames.push("Number " + numberName + " must appear in " + columnName);
            });
        });
        let emptyRow: boolean[] = Array(columnNames.length);
        _.fill(emptyRow, false);
        let dlx = new DLX(
            columnNames,
            [
                emptyRow.map((entry, columnIndex) => [0, 4, 8].indexOf(columnIndex) !== -1),
                emptyRow.map((entry, columnIndex) => [0, 6, 10].indexOf(columnIndex) !== -1),
                emptyRow.map((entry, columnIndex) => [1, 5, 8].indexOf(columnIndex) !== -1),
                emptyRow.map((entry, columnIndex) => [1, 7, 10].indexOf(columnIndex) !== -1),
                emptyRow.map((entry, columnIndex) => [2, 4, 9].indexOf(columnIndex) !== -1),
                emptyRow.map((entry, columnIndex) => [2, 6, 11].indexOf(columnIndex) !== -1),
                emptyRow.map((entry, columnIndex) => [3, 5, 9].indexOf(columnIndex) !== -1),
                emptyRow.map((entry, columnIndex) => [3, 7, 11].indexOf(columnIndex) !== -1)
            ],
            resultHandler
        );
        dlx.solve();
        expect(resultHandler.getResult()).toEqual(
            "Some number in column 1 and row 1 Number 1 must appear in row 1 Number 1 must appear in column 1\n" +
            "Some number in column 1 and row 2 Number 2 must appear in row 2 Number 2 must appear in column 1\n" +
            "Some number in column 2 and row 1 Number 2 must appear in row 1 Number 2 must appear in column 2\n" +
            "Some number in column 2 and row 2 Number 1 must appear in row 2 Number 1 must appear in column 2" +
            "\n\n" +
            "Some number in column 1 and row 1 Number 2 must appear in row 1 Number 2 must appear in column 1\n" +
            "Some number in column 1 and row 2 Number 1 must appear in row 2 Number 1 must appear in column 1\n" +
            "Some number in column 2 and row 1 Number 1 must appear in row 1 Number 1 must appear in column 2\n" +
            "Some number in column 2 and row 2 Number 2 must appear in row 2 Number 2 must appear in column 2" +
            "\n\n"
        );
    });

    it('should be able to find one solution of the 2 x 2 Latin Square', () => {
        let resultHandler = new SimpleResultHandler();
        let columnNames: string[] = [];
        let names: string[] = ['1', '2'];
        let columnSquareNames: string[] = names.map(name => "column " + name);
        let rowSquareNames: string[] = names.map(name => "row " + name);
        columnSquareNames.forEach(columnName => {
            rowSquareNames.forEach(rowName => {
                columnNames.push("Some number in " + columnName + " and " + rowName);
            });
        });
        names.forEach(numberName => {
            rowSquareNames.forEach(rowName => {
                columnNames.push("Number " + numberName + " must appear in " + rowName);
            });
        });
        names.forEach(numberName => {
            columnSquareNames.forEach(columnName => {
                columnNames.push("Number " + numberName + " must appear in " + columnName);
            });
        });
        let emptyRow: boolean[] = Array(columnNames.length);
        _.fill(emptyRow, false);
        let dlx = new DLX(
            columnNames,
            [
                emptyRow.map((entry, columnIndex) => [0, 4, 8].indexOf(columnIndex) !== -1),
                emptyRow.map((entry, columnIndex) => [0, 6, 10].indexOf(columnIndex) !== -1),
                emptyRow.map((entry, columnIndex) => [1, 5, 8].indexOf(columnIndex) !== -1),
                emptyRow.map((entry, columnIndex) => [1, 7, 10].indexOf(columnIndex) !== -1),
                emptyRow.map((entry, columnIndex) => [2, 4, 9].indexOf(columnIndex) !== -1),
                emptyRow.map((entry, columnIndex) => [2, 6, 11].indexOf(columnIndex) !== -1),
                emptyRow.map((entry, columnIndex) => [3, 5, 9].indexOf(columnIndex) !== -1),
                emptyRow.map((entry, columnIndex) => [3, 7, 11].indexOf(columnIndex) !== -1)
            ],
            resultHandler,
            ColumnChooser.chooseColumnSmallest,
            1
        );
        dlx.solve();
        expect(resultHandler.getResult()).toEqual(
            "Some number in column 1 and row 1 Number 1 must appear in row 1 Number 1 must appear in column 1\n" +
            "Some number in column 1 and row 2 Number 2 must appear in row 2 Number 2 must appear in column 1\n" +
            "Some number in column 2 and row 1 Number 2 must appear in row 1 Number 2 must appear in column 2\n" +
            "Some number in column 2 and row 2 Number 1 must appear in row 2 Number 1 must appear in column 2" +
            "\n\n"
        );
    });
});