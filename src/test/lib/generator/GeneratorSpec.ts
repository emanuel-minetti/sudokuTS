import {Generator, Symmetry} from "../../../lib/generator/Generator";

describe('A Generator', () => {
    it('should return a puzzle with central symmetry', function () {
        let puzzle = Generator.generate(0, 200, 1, Symmetry.central);
        expect(puzzle).not.toBeNull();
    });
    it('should return a puzzle with diagonal symmetry', function () {
        let puzzle = Generator.generate(0, 200, 1, Symmetry.diagonal);
        expect(puzzle).not.toBeNull();
    });
    it('should return a puzzle with no symmetry', function () {
        let puzzle = Generator.generate(0, 200, 1, Symmetry.noSymmetry);
        expect(puzzle).not.toBeNull();
    });
    it('should return null with too high a rating', function () {
        let puzzle = Generator.generate(200, 201, 2, Symmetry.central);
        expect(puzzle).toBeNull();
    });
});