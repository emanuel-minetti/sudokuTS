import * as _ from "lodash";

import {SudokuGame} from "../game/SudokuGame";
import {RulesHelper} from "../solver/RulesHelper";
import {Sudoku} from "../game/Sudoku";
import {Backtracker} from "../backtracker/Backtracker";
import {ColumnChooser} from "../backtracker/DLXHelpers";


export class Generator {
    static generate = (minRating: number, maxRating: number, maxTries: number) => {
        let solvedGames: SudokuGame[];
        solvedGames = Generator.getSolvedGames(maxTries);
        //TODO remove debugging
        solvedGames.forEach((game, index) => {
            console.log("Game: " + index);
            console.log(game.toString());
        });
    }

    private static getSolvedGames(maxTries: number) {
        let solvedGames: SudokuGame[] = [];
        let solvedGame: SudokuGame;
        let sudoku: Sudoku;
        let backtracker: Backtracker;
        let tuples = RulesHelper.getTuples(9, 9);
        let tuplesLength = tuples.length;
        let columnsToValues: number[];
        let rowToColumns: number[];
        let rowIndex: number;
        let index: number;
        function getRandomInt(max: number) {
            return Math.floor(Math.random() * max);
        }

        //for each game
        _.range(maxTries).map(() => {
            sudoku = new Sudoku();
            //initialize game randomly
            columnsToValues = tuples[getRandomInt(tuplesLength)];
            rowToColumns = tuples[getRandomInt(tuplesLength)];
            columnsToValues.forEach((value, columnIndex) => {
                index = columnIndex + 9 * rowToColumns[columnIndex];
                sudoku.setValue(index, value + 1);
            });
            solvedGame = new SudokuGame(sudoku);
            //solve game randomly
            backtracker = new Backtracker(solvedGame);
            backtracker.solve(false, ColumnChooser.chooseColumnRandom);
            solvedGames.push(solvedGame);
        });
        return solvedGames;
    }
}