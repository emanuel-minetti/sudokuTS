import {Generator, Symmetry} from "../../../lib/generator/Generator";

describe('A Generator', () => {
    it('should return a puzzle with central symmetry', function () {
        let puzzles = Generator.generate(0, 100, 1, Symmetry.central);
        expect(puzzles.length).toBeGreaterThanOrEqual(1);
        expect(puzzles[0].isSolved()).toBe(false);
    });
});