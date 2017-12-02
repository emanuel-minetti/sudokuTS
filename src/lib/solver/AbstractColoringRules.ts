import * as _ from "lodash";

import {Sudoku} from "../game/Sudoku";
import {SudokuStateChange} from "../game/SudokuStateChange";
import {ColoringHelper, Color, Coloring} from "./ColoringHelper";

/**
 * A class with abstract coloring rules to help building tough solver rules.
 */
export class AbstractColoringRules {

    /**
     * The Two Colors Seen rule is part of the Simple Coloring rule.
     *
     * For each value it finds all colorings. For each coloring and each square that is uncolored
     * and contains the value it tests whether that square has two differently colored peers.
     * If so the value can be removed from the candidates of the square.
     *
     * @param {Sudoku} sudoku the sudoku to solve
     * @returns {SudokuStateChange[]} the resulting moves
     */
    static twoColorsSeen(sudoku: Sudoku) {
        let moves: SudokuStateChange[] = [];
        //for each value
        Sudoku.values.forEach(value => {
            //find all colorings
            let colorings = ColoringHelper.color(sudoku, value);
            //for each coloring and each square ...
            colorings.forEach(coloring => {
                sudoku.getSquares().forEach(square => {
                    //... that is uncolored and contains the value as a candidate ...
                    if (coloring.getSquares(Color.Uncolored).indexOf(square) !== -1 &&
                        square.containsCandidate(value)) {
                        //... get the colored peers of this square
                        let coloredPeers = sudoku.getPeersOfSquare(square).filter(peer =>
                            coloring.getSquares(Color.Uncolored).indexOf(peer) === -1);
                        //if there are more than one peers ...
                        if (coloredPeers.length > 1) {
                            //... get the color of the first colored peer
                            let firstColor = Coloring.colors.filter(color =>
                                coloring.getSquares(color).indexOf(coloredPeers[0]) !== -1)[0];
                            //if the square has a peer colored with a different color ...
                            if (coloredPeers.reduce((hasOtherColor, peer) =>
                                    (hasOtherColor || (coloring.getSquares(firstColor).indexOf(peer) === -1)), false)) {
                                //... a square that sees two colors is found, so remove the value from its candidates
                                let move = new SudokuStateChange(square.getIndex(), [value],
                                    square.getName() + ' can see ' + value + ' at two different colored squares');
                                moves.push(move);
                            }
                        }
                    }
                });
            });
        });
        return moves;
    }

    //TODO comment
    //TODO document
    static twiceInUnit(sudoku: Sudoku) {
        let moves: SudokuStateChange[] = [];
        Sudoku.values.forEach(value => {
            let colorings = ColoringHelper.color(sudoku, value);
            colorings.forEach(coloring => {
                sudoku.getUnits().forEach((unit, unitIndex) => {
                    Coloring.colors.forEach(color => {
                        let equalColoredSquaresInUnit = _.intersection(coloring.getSquares(color), unit);
                        if (equalColoredSquaresInUnit.length >= 2) {
                            //twice in unit found
                            let unitName = Sudoku.unitNames[unitIndex];
                            let squaresToRemoveValue = coloring.getSquares(color);
                            squaresToRemoveValue.forEach(square => {
                                let move = new SudokuStateChange(square.getIndex(), [value],
                                    value + ' found twice in Unit ' + unitName + ' found: Removed ' + value +
                                    ' from ' + square.getName());
                                moves.push(move);
                            });
                        }
                    });
                });
            });
        });
        return moves;
    }
}