import {Sudoku} from '../../lib/Sudoku';

describe('A Sudoku.ts ', function () {
    it('should report right square names  for an given index ', function () {
        let sudoku: Sudoku = new Sudoku;
        expect(sudoku.getSquares()[26].getName()).toBe('I3');
    })
    it('should report a list candigates'), function () {
        //TODO implement
    }
});