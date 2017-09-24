import {Sudoku} from '../../lib/Sudoku';
import {Square} from "../../lib/Square";
import * as _ from 'lodash';

describe('A Square of an empty Sudoku ', function () {
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
});