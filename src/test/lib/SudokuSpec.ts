import {Sudoku} from '../../lib/Sudoku';
import {Square} from "../../lib/Square";
import * as _ from 'lodash';

describe('A Square of an empty Sudoku ', () => {
    let sudoku: Sudoku;
    let square: Square;

    beforeAll(() => {
        sudoku = new Sudoku;
        square = sudoku.getSquares()[26];
    });

    it('should report its name', () => {
        expect(square.getName()).toBe('I3');
    });

    it('should report a full list of candidates', () => {
        expect(square.getCandidates()).not.toBeNull();
        expect(square.getCandidates()).toEqual(_.range(1,10,1));
    });

    it('should have no value set', () => {
        expect(square.getValue()).toBeNull();
    });

    it('should report its box name', () => {
        expect(square.getBoxName()).toBe('III');
    });

    it('should be able to set its value', () => {
        sudoku.setValue(26, 3);
       expect(square.getValue()).toBe(3);
    });

    it('should update the candidates of its peers', () => {
        expect(sudoku.getSquares()[square.getPeerIndices()[10]].getCandidates()).not.toContain(3);
        expect(sudoku.getSquares()[square.getPeerIndices()[10]].getCandidates()).toContain(2);
    });

    describe('The sudoku class', () => {
        var sudokuString =
            '9** *** *6* \n' +
            '**2 89* *** \n' +
            '1** **5 2** \n' +
            '            \n' +
            '**1 **7 *96 \n' +
            '*** 1*9 *** \n' +
            '35* 4** 8** \n' +
            '            \n' +
            '**3 9** **2 \n' +
            '*** *42 5** \n' +
            '*6* *** **7 \n';
       it('should be able to create a new Sudoku from a correct string', () => {
           expect(Sudoku.createSudokuByString(sudokuString)).not.toBeNull();
       });
    });
});