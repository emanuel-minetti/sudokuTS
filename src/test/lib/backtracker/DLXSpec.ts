import {DLX} from "../../../lib/backtracker/DLX";
import {SimpleResultHandler} from "../../../lib/backtracker/ResultHandler";

describe('A newly created DLX' , () => {
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
            DLX.chooseColumnRight,
            resultHandler
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
            DLX.chooseColumnSmallest,
            resultHandler
        );
        dlx.solve();
        expect(resultHandler.getResult()).toEqual(
            'A D\n' +
            'E F C\n' +
            'B G'
        );
    });
})