import * as _ from "lodash";

import {Sudoku} from "../game/Sudoku";
import {Square} from "../game/Square";

export enum Color {
    Blue,
    Green,
    Uncolored
}

//TODO document
export class Coloring {
    private coloredSquares: Square[][];
    private readonly squares: Square[];
    static colors: Color[] = [Color.Blue, Color.Green];

    constructor(sudoku: Sudoku) {
        this.squares = sudoku.getSquares();
        this.coloredSquares = [];
        this.coloredSquares[Color.Uncolored] = this.squares;
        this.coloredSquares[Color.Blue] = [];
        this.coloredSquares[Color.Green] = [];
    }

    colorSquares(squares: Square[], color:Color) {
        if (squares.reduce((res, square) =>
                (res || this.coloredSquares[Color.Uncolored].indexOf(square) === -1) ,false)) {
            throw new Error('Square already colored');
        }
        this.coloredSquares[color] = _.concat(this.coloredSquares[color], squares);
        this.coloredSquares[Color.Uncolored] = _.difference(this.coloredSquares[Color.Uncolored], squares);
    }

    getSquares(color: Color): Square[] {
        return this.coloredSquares[color];
    }
}

//TODO document
export class ColoringHelper {
    static color(sudoku: Sudoku, value: number): Coloring[] {
        //find all links
        let links: Square[][] = [];
        let units = sudoku.getUnits();
        units.forEach(unit => {
            let squares = unit.filter(square => square.containsCandidate(value));
            if (squares.length === 2) {
                links = _.unionWith(links, [squares], (link, newLink) => _.isEqual(link, newLink));
            }
        })
        //find all chains formed by these links
        let chains: Square[][][] = [];
        links.forEach(link => {
            //find chains that intersect with this link
            let neighbouringChains = chains.filter(chain => chain.reduce(
                (neighbouring: boolean, neighbouringLink: Square[]): boolean => {
                    return (neighbouring || _.intersection(link, neighbouringLink).length !== 0);
                },
                false)
            );
            //if this link hasn't intersections, add a new chain
            if (neighbouringChains.length === 0) {
                chains.push([link]);
            }
            //if it has one intersection, add this link to the intersecting chain
            else if (neighbouringChains.length === 1) {
                neighbouringChains[0].push(link);
            }
            //it has more connections ...
            else {
                //... so find all intersecting chains ...
                chains = _.differenceWith(chains, neighbouringChains, (arrVal, othVal) => _.isEqual(arrVal, othVal));
                //... and form a new chain
                let newChain: Square[][] = [];
                neighbouringChains.forEach(neighbouringChain => {
                        let neighbouringChainWithoutLink = neighbouringChain.filter(linkInChain =>
                            !_.isEqual(linkInChain, link));
                        newChain = _.concat(newChain, neighbouringChainWithoutLink);
                    }
                );
                chains.push(newChain);
            }
        });
        //find all colorings produced by these chains, that are longer than a single link
        let colorings: Coloring[] = [];
        chains = chains.filter(chain => (chain.length !== 1));
        chains.forEach(chain => {
            let coloring = new Coloring(sudoku);
            let coloredSquares: Square[][] = [];
            coloredSquares[Color.Blue] = [];
            coloredSquares[Color.Green] = [];
            let squaresToColor = _.flattenDeep(chain);
            squaresToColor = _.uniq(squaresToColor);
            //color the first square
            coloredSquares[Color.Blue].push(squaresToColor[0]);
            squaresToColor.shift();
            coloredSquares[Color.Uncolored] = squaresToColor;
            //color the rest!
            while (squaresToColor.length !== 0) {
                let squareColored = false;
                let squareToColor = squaresToColor[0];
                let neighbours = links.filter(link => (link.indexOf(squareToColor) !== -1)).map(link =>
                    link[0] === squareToColor ? link[1] : link [0]
                );
                let coloredNeighbours = Coloring.colors.map(color => neighbours.filter(neighbour =>
                    coloredSquares[color].indexOf(neighbour) !== -1)
                );
                //TODO test whether there are more than one different colors among the neighbours
                Coloring.colors.forEach(color => {
                    if (coloredNeighbours[color].length > 0) {
                        //color the square to color
                        let otherColor = color == Color.Green ? Color.Blue : Color.Green;
                        coloredSquares[otherColor].push(squareToColor);
                        squaresToColor = squaresToColor.filter(remains => remains !== squareToColor);
                        squareColored = true
                        //color uncolored neighbours
                        let uncoloredNeighbours = neighbours.filter(neighbour =>
                            coloredNeighbours[color].indexOf(neighbour) === -1);
                        uncoloredNeighbours.forEach(uncoloredNeighbour => {
                            coloredSquares[color].push(uncoloredNeighbour);
                            squaresToColor = squaresToColor.filter(remains => remains !== uncoloredNeighbour);
                        });
                    }
                });
                if (!squareColored) {
                    //revolve squares to color
                    let first = squaresToColor.shift()!;
                    squaresToColor.push(first);
                }
            }
            Coloring.colors.forEach(color => {
                coloring.colorSquares(coloredSquares[color], color);
            });
            colorings.push(coloring);
        });
        return colorings;
    }
}
