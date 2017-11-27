import * as _ from "lodash";

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
        let links: Square[][] = [];
        let units = sudoku.getUnits();
        units.forEach(unit => {
            let squares = unit.filter(square => square.containsCandidate(value));
            if (squares.length === 2) {
                links = _.unionWith(links, [squares], (link, newLink) => _.isEqual(link, newLink));
            }
        })
        let linksString = links.reduce((string: string, link:Square[]): string => {
            return string + link.reduce((string: string, square:Square): string => {
                return string + square.getName();
            }, '') + '\n'
        }, '');
        console.log('Links: \n' + linksString);
        //TODO remove debugging!
        return new Coloring(sudoku.getSquares());
    }
}
