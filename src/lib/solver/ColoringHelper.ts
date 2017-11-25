import {Sudoku} from "../game/Sudoku";
import {Square} from "../game/Square";

//TODO document
export enum Color {
    Blue,
    Green
}

//TODO document
export class Coloring {
    value: number;
    coloredSquares: Square[][];
    private readonly squares: Square[];

    constructor(value: number, squares: Square[]) {
        this.value = value;
        this.squares = squares;
    }

    getSquares(color: Color): Square[] {
        return this.coloredSquares[color];
    }
}

//TODO document
//TODO comment
//TODO implement
export class ColoringHelper {
    static color(sudoku: Sudoku, value: number): Coloring {

        return new Coloring(value, sudoku.getSquares());
    }
}