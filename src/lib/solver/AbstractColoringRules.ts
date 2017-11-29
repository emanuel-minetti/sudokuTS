import {Sudoku} from "../game/Sudoku";
import {SudokuStateChange} from "../game/SudokuStateChange";
import {ColoringHelper, Color, Coloring} from "./ColoringHelper";

export class AbstractColoringRules {

    //TODO document
    //TODO comment
    static twoColorsSeen(sudoku: Sudoku) {
        let moves: SudokuStateChange[] = [];
        Sudoku.values.forEach(value => {
            let colorings = ColoringHelper.color(sudoku, value);
            colorings.forEach(coloring => {
                sudoku.getSquares().forEach(square => {
                    if (coloring.getSquares(Color.Uncolored).indexOf(square) !== -1 &&
                        square.containsCandidate(value)) {
                        let coloredPeers = sudoku.getPeersOfSquare(square).filter(peer =>
                            coloring.getSquares(Color.Uncolored).indexOf(peer) === -1);
                        if (coloredPeers.length > 1) {
                            let firstColor = Coloring.colors.filter(color =>
                                coloring.getSquares(color).indexOf(coloredPeers[0]) !== -1)[0];
                            if (coloredPeers.reduce((hasOtherColor, peer) =>
                                    (hasOtherColor || (coloring.getSquares(firstColor).indexOf(peer) === -1)), false)) {
                                //square that sees two colors found
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
}