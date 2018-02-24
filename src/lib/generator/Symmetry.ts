import {Generator} from "./Generator";

/**
 * Returns the index of a symmetry partner for the given index.
 *
 * @param {number} index
 * @returns {number}
 */

export type SymmetryFunction = (index: number) => number;

/**
 * A class exporting {@code SymmetryFunction}s to be used by the {@code Generator}.
 */
export class Symmetry {

    /**
     * The central symmetry. {@see SymmetryFunction}
     */
    static central: SymmetryFunction = (index: number) => {
        return 80 - index;
    }

    /**
     * The diagonal symmetry along the main diagonal of a matrix. {@see SymmetryFunction}
     */
    static diagonal = (index: number) => {
        let row = Math.floor(index / 9);
        let column = index % 9;
        return column * 9 + row;
    }

    /**
     * No symmetry. {@see SymmetryFunction}
     */
    static noSymmetry = (index: number) => {
        return Generator.getRandomIndex();
    }
}
