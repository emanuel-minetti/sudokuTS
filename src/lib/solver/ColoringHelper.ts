import {Sudoku} from "../game/Sudoku";
import {Square} from "../game/Square";

enum Color {
    Green,
    Blue,
    Uncolored
}

//TODO document
export class Coloring {
    static colors = [
        Color.Green, Color.Blue, Color.Uncolored
    ];
    coloredSquares: Square[][];
    private readonly squares: Square[];

    constructor(squares: Square[]) {
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
        let containingSquares = sudoku.getSquares().filter(square => square.containsCandidate(value));
        let squaresToColor = containingSquares.slice();
        while (squaresToColor.length !== 0) {
            //TODO Start here!
        }

        return new Coloring(sudoku.getSquares());
    }
}
