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
        //TODO review
        let containingSquares = sudoku.getSquares().filter(square => square.containsCandidate(value));
        let squaresToColor = containingSquares.slice();
        let chains: Square[][] = [];
        containingSquares.forEach(containingSquare => {
            if ((squaresToColor.indexOf(containingSquare) !== -1)) {
                let neighbours = _.intersection(sudoku.getPeersOfSquare(containingSquare), containingSquares);
                if (neighbours.length >= 2) {
                    let chainsWithNeighbours = chains.filter(chain => (_.intersection(chain, neighbours).length > 0));
                    if (chainsWithNeighbours.length === 0) {
                        chains.push([containingSquare]);
                        _.pull(squaresToColor, containingSquare);
                    }
                    else if (chainsWithNeighbours.length === 1) {
                        chainsWithNeighbours[0].push(containingSquare);
                        _.pull(squaresToColor, containingSquare);
                    }
                    else {
                        let newChain: Square[] = [containingSquare];
                        chainsWithNeighbours.forEach(chainWithNeighbours => {
                            _.concat(newChain, chainWithNeighbours);
                            _.pull(chains, chainWithNeighbours);
                        });
                        chains.push(newChain);
                        _.pull(squaresToColor, containingSquare);
                    }
                }
                else if (neighbours.length = 1) {
                    let chainWithNeighbor = chains.filter(chain => (chain.indexOf(neighbours[0]) !== -1));
                    if (chainWithNeighbor.length === 1) {
                        chainWithNeighbor.push(containingSquare);
                    }
                    else {
                        chains.push([containingSquare]);
                    }
                    _.pull(squaresToColor, containingSquare);
                }
                else {
                    _.pull(squaresToColor, containingSquare);
                }
            }
        });
        //TODO add debugging output!

        return new Coloring(sudoku.getSquares());
    }
}
