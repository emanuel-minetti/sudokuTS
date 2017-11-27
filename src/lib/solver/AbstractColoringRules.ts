import {Sudoku} from "../game/Sudoku";
import {SudokuStateChange} from "../game/SudokuStateChange";
import {ColoringHelper} from "./ColoringHelper";

export class AbstractColoringRules {

    //TODO document
    //TODO comment
    //TODO implement
    static twoColorsSeen(sudoku: Sudoku) {
        let coloring = ColoringHelper.color(sudoku, 7);
        let moves: SudokuStateChange[] = [];

        return moves;
    }
}