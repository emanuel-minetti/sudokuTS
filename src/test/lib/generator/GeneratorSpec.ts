import {Generator, Symmetry} from "../../../lib/generator/Generator";

describe('A Generator', () => {
    it('should return a puzzle with central symmetry', function () {
        let puzzle = Generator.generate(0, 200, 1, Symmetry.central);
        expect(puzzle).not.toBeNull();
    });
});