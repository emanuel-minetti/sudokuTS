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
            resultHandler,
            ColumnChooser.chooseColumnSmallest
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
            'C E F'
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
            'B G'
        );
    });

    it('should be able to solve the 2 x 2 Latin Square', () => {
        let resultHandler = new SimpleResultHandler();
        let columnNames: string[] = [];
        let names: string[] =['1', '2'];
        let columnSquareNames: string[] = names.map(name => "column" + name);
        let rowSquareNames: string[] = names.map(name => "row" + name);
        columnSquareNames.forEach(columnName => {
            rowSquareNames.forEach(rowNme => {
                columnNames.push("Some number in " + columnName + " in " + rowNme);
            });
        });
        names.forEach(numberName => {
            rowSquareNames.forEach(rowName =>{
               columnNames.push("Number " + numberName + "must appear in " + rowName);
            });
        });
        names.forEach(numberName => {
            columnSquareNames.forEach(columnName =>{
                columnNames.push("Number " + numberName + "must appear in " + columnName);
            });
        });
        let emptyRow: boolean[] = Array(columnNames.length)
        let dlx = new DLX(
            columnNames,
            [
                emptyRow.map((entry, columnIndex) => [0, 4, 8].indexOf(columnIndex) !== -1),
                emptyRow.map((entry, columnIndex) => [0, 6, 10].indexOf(columnIndex) !== -1),
                emptyRow.map((entry, columnIndex) => [1, 5, 8].indexOf(columnIndex) !== -1),
                emptyRow.map((entry, columnIndex) => [1, 7, 8].indexOf(columnIndex) !== -1),
                emptyRow.map((entry, columnIndex) => [2, 4, 9].indexOf(columnIndex) !== -1),
                emptyRow.map((entry, columnIndex) => [2, 6, 11].indexOf(columnIndex) !== -1),
                emptyRow.map((entry, columnIndex) => [3, 5, 9].indexOf(columnIndex) !== -1),
                emptyRow.map((entry, columnIndex) => [3, 7, 11].indexOf(columnIndex) !== -1)
            ],
            resultHandler,
            ColumnChooser.chooseColumnSmallest
        );
        dlx.solve();
        expect(resultHandler.getResult()).toEqual(
            'A D\n' +
            'E F C\n' +
            'B G'
        );
    });
})