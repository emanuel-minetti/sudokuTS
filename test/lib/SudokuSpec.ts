import {Sudoku} from "../../lib/Sudoku";

describe('Sudoku', function () {
    it('Square names ', function () {
        let sudoku: Sudoku = new Sudoku;
        expect(sudoku.getSquares()[26].getName()).toBe('H3');
    })
});