import * as _ from "lodash";

import {SudokuGame} from "../game/SudokuGame";
import {RulesHelper} from "../solver/RulesHelper";
import {Sudoku} from "../game/Sudoku";
import {Backtracker} from "../backtracker/Backtracker";
import {ColumnChooser} from "../backtracker/DLXHelpers";

enum Symmetry {
    central = "central",
    diagonal = "diagonal",
    noSymmetry = "noSymmetry"
}

export class Generator {

    /**
     * Returns a single random unsolved uniquely solvable rated {@code SudokuGame} which has a rating
     * as near as possible to the middle of 'minRating' and 'maxRating'. If after 'maxTries' no sudoku
     * with a rating between 'minRating' and 'maxRating' is found {@code null} is returned. If an optional
     * parameter 'symmetry' is given the given symmetry is observed.
     *
     * @param {number} minRating the minimum rating of the returned sudoku
     * @param {number} maxRating the maximum rating of the returned sudoku
     * @param {number} maxTries the maximum number of tries to find a sudoku
     * @param {Symmetry} symmetry the symmetry to observe
     * @returns {SudokuGame | null} the generated sudoku if any
     */
    static generate = (minRating: number,
                       maxRating: number,
                       maxTries: number,
                       symmetry: Symmetry = Symmetry.central) => {
        let solvedGames: SudokuGame[];
        solvedGames = Generator.getSolvedGames(maxTries);
        //TODO remove debugging
        solvedGames.forEach((game, index) => {
            console.log("Game: " + index);
            console.log(game.toString());
        });
        let uniquelySolvableGames: SudokuGame[] = [];
        solvedGames.forEach(game => {
            uniquelySolvableGames = _.concat(uniquelySolvableGames,
                Generator.getUniquelySolvableGames(game, maxTries, symmetry));
        });
        //TODO remove fake return
        return new SudokuGame(new Sudoku());
    }

    /**
     * Gets a given number of random solved games.
     *
     * @param {number} numberOfGames how many solved games to return
     * @returns {SudokuGame[]} the solved games
     */
    private static getSolvedGames(numberOfGames: number) {
        //declare some variables
        let solvedGames: SudokuGame[] = [];
        let solvedGame: SudokuGame;
        let sudoku: Sudoku;
        let backtracker: Backtracker;
        let columnsToValues: number[];
        let rowToColumns: number[];
        let rowIndex: number;
        let index: number;

        //get all permutations of length 9
        const tuples = RulesHelper.getTuples(9, 9);
        const tuplesLength = tuples.length;

        //get a random int between 0 included and max excluded
        function getRandomInt(max: number) {
            return Math.floor(Math.random() * max);
        }

        //for each game
        _.range(numberOfGames).map(() => {
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

    //TODO document and comment
    private static getUniquelySolvableGames(game: SudokuGame, maxTries: number, symmetry: Symmetry) {
        let uniquelySolvableGames: SudokuGame[] = [];
        let findSymmetryPartner;
        switch (symmetry) {
            case Symmetry.central:
                findSymmetryPartner = this.findCentralSymmetryPartner;
                break;
            case Symmetry.diagonal:
                findSymmetryPartner = this.findDiagonalSymmetryPartner;
                break;
            case Symmetry.noSymmetry:
                findSymmetryPartner = this.findNoSymmetryPartner;
                break;
        }
        let gameString = game.getCurrentState().toSimpleString();
        let gameStringArray = gameString.split('');
        //TODO implement loop for max tries
        return uniquelySolvableGames;
    }

    private static getRandomIndex() {
        return Math.floor(Math.random() * 81);
    }

    private static findCentralSymmetryPartner(index: number) {
        return 80 - index;
    }

    private static findDiagonalSymmetryPartner(index: number) {
        let row = Math.floor(index / 9);
        let column = index % 9;
        return column * 9 + row;
    }

    private static findNoSymmetryPartner(index: number) {
        return this.getRandomIndex();
    }
}
