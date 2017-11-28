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
//TODO comment
//TODO implement
export class ColoringHelper {
    static color(sudoku: Sudoku, value: number): Coloring[] {
        let links: Square[][] = [];
        let units = sudoku.getUnits();
        units.forEach(unit => {
            let squares = unit.filter(square => square.containsCandidate(value));
            if (squares.length === 2) {
                links = _.unionWith(links, [squares], (link, newLink) => _.isEqual(link, newLink));
            }
        })
        let chains: Square[][][] = [];
        links.forEach(link => {
            let neighbouringChains = chains.filter(chain => chain.reduce(
                (neighbouring: boolean, neighbouringLink: Square[]): boolean => {
                    return (neighbouring || _.intersection(link, neighbouringLink).length !== 0);
                },
                false)
            );
            if (neighbouringChains.length === 0) {
                chains.push([link]);
            }
            else if (neighbouringChains.length === 1) {
                neighbouringChains[0].push(link);
            }
            else {
                chains = _.differenceWith(chains, neighbouringChains, (arrVal, othVal) => _.isEqual(arrVal, othVal));
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
        let colorings: Coloring[] = []
        chains = chains.filter(chain => (chain.length !== 1));
        chains.forEach(chain => {
            let coloring = new Coloring(sudoku);
            let coloredSquares: Square[][] = [];
            coloredSquares[Color.Blue] = [];
            coloredSquares[Color.Green] = [];
            let squaresToColor = _.flattenDeep(chain);
            squaresToColor = _.uniq(squaresToColor);
            coloredSquares[Color.Blue].push(squaresToColor[0]);
            squaresToColor.shift();
            //TODO color the rest!
            while (squaresToColor.length !== 0) {

            }

            colorings.push(coloring);
        });

        //TODO remove debugging!
        let chainsString = chains.reduce((chainsString: string, chain: Square[][]): string => {
            return chainsString + chain.reduce((chainString: string, link: Square[]): string => {
                return chainString + link.reduce((linkString: string, square: Square): string => {
                    return linkString + square.getName();
                }, '');
            }, '') + '\n';
        }, '');
        console.log('Chains:\n' + chainsString);
        return colorings;
    }
}
