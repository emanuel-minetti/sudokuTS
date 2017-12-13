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
})