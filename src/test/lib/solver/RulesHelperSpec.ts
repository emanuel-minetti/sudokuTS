import {Sudoku} from "../../../lib/game/Sudoku";
import {RulesHelper} from "../../../lib/solver/RulesHelper";
import * as _ from "lodash";

describe('A Rules Helper', () => {
    let sudoku = new Sudoku();
    let indices = [13, 14, 25, 27, 40];
    let squares = indices.map((index) => sudoku.getSquares()[index]);

    it('should give all singles from an array of squares', () => {
        expect(
            _.flatten(RulesHelper.getTupelesOfSquares(squares, 1)).map(
                (square) => square.getIndex())
        ).toEqual(indices);
    });

    it('should give all pairs from an array of squares', () => {
        let pairs = [[13, 14], [13, 25], [13, 27], [13, 40],
            [14, 25], [14, 27], [14, 40], [25, 27], [25, 40], [27, 40]];
        expect(RulesHelper.getTupelesOfSquares(squares, 2).map(
            (pair) => pair.map((square) => square.getIndex()))
        ).toEqual(pairs);
    });

    it('should give all triples from an array of squares', () => {
        let triples = [[13, 14, 25], [13, 14, 27], [13, 14, 40], [13, 25, 27], [13, 25, 40],
            [13, 27, 40], [14, 25, 27], [14, 25, 40], [14, 27, 40], [25, 27, 40]];
        expect(RulesHelper.getTupelesOfSquares(squares, 3).map(
            (triple) => triple.map((square) => square.getIndex()))
        ).toEqual(triples);
    });

    it('should give all quadruples from an array of squares', () => {
        let quadruples = [[13, 14, 25, 27], [13, 14, 25, 40], [13, 14, 27, 40], [13, 25, 27, 40],
            [14, 25, 27, 40]];
        expect(RulesHelper.getTupelesOfSquares(squares, 4).map(
            (quadruple) => quadruple.map((square) => square.getIndex()))
        ).toEqual(quadruples);
    });
})