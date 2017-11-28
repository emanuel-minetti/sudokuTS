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
                //TODO compose a better `newChain`
                neighbouringChains.forEach(neighbouringChain => {
                        let neighbouringChainWithoutLink = neighbouringChain.filter(linkInChain =>
                            !_.isEqual(linkInChain, link));
                        newChain = _.concat(newChain, neighbouringChainWithoutLink);
                    }
                );
                chains.push(newChain);
            }
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
        return new Coloring(sudoku.getSquares());
    }
}
