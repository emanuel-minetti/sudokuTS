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

    it ('should report its index', () => {
        expect(square.getIndex()).toBe(26);
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

    it('should report correct unit names and indices', () => {
        expect(square.getRowName()).toEqual('3');
        expect(square.getRowIndex()).toEqual(2);
        expect(square.getColumnName()).toEqual('I');
        expect(square.getColumnIndex()).toEqual(8);
        expect(square.getBoxIndex()).toEqual(2);
    });
});

describe('The sudoku class', () => {
    let sudoku: Sudoku;
    let sudokuString =
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

    let falseSudokuString =
        '9** *** *6* \n' +
        '**2 89* *** \n' +
        '1** **5 2** \n' +
        '            \n' +
        '**1 **7 *96 \n' +
        '*** 1*9 *** \n' +
        '35* 4** 8** \n' +
        '            \n' +
        '**3 9** **2 \n' +
        '*** *42 5** \n';

    it('should be able to create a new Sudoku from a correct string', () => {
        sudoku = Sudoku.createSudokuByString(sudokuString);
        expect(sudoku).toEqual(jasmine.any(Sudoku));
    });

    it('should report correct values for set values', () => {
        expect(sudoku.getSquares()[0].getName()).toEqual('A1');
        expect(sudoku.getSquares()[0].getValue()).toEqual(9);
    });

    it('should throw an error if a incorrect string is given', () => {
       expect(() => Sudoku.createSudokuByString(falseSudokuString)).toThrowError('Wrong length of input!');
    });

});

describe('A sudoku', () => {
    let sudokuString =
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
    let sudoku = Sudoku.createSudokuByString(sudokuString);
    let square1 = sudoku.getSquares()[0];

    it('should not set an already set Value', () => {
        expect(() => sudoku.setValue(0, 1)).toThrowError('Square already filled!');
    })

    it('should not set a value that is not a candidate', () => {
        expect(() => sudoku.setValue(9, 2)).toThrowError();
        expect(() => sudoku.setValue(2, 2)).toThrowError();
    })

    it ('should report a correct row', () => {
        expect(sudoku.getRows()[1].map((square) => square.getValue())).
        toEqual([null, null, 2, 8, 9, null, null, null, null]);
    });

    it ('should report a correct unit', () => {
        //unit[22] is unit V
        expect(sudoku.getUnits()[22].map((square) => square.getValue())).
        toEqual([null, null, 7, 1, null, 9, 4, null, null]);
    });
})