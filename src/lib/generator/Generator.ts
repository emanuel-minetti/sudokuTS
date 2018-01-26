import * as _ from "lodash";

import {SudokuGame} from "../game/SudokuGame";
import {RulesHelper} from "../solver/RulesHelper";
import {Sudoku} from "../game/Sudoku";
import {Backtracker} from "../backtracker/Backtracker";
import {ColumnChooser} from "../backtracker/DLXHelpers";

/**
 * Returns the index of a symmetry partner for the given index.
 *
 * @param {number} index
 * @returns {number}
 */
export type SymmetryFunction = (index: number) =>  number;

/**
 * A class exporting {@code SymmetryFunction}s to be used by the {@code Generator}.
 */
export class Symmetry  {

    /**
     * The central symmetry. {@see SymmetryFunction}
     */
    static central: SymmetryFunction = (index: number) =>  {
        return 80 - index;
    }

    /**
     * The diagonal symmetry along the main diagonal of a mtrix. {@see SymmetryFunction}
     */
    static diagonal = (index: number) => {
        let row = Math.floor(index / 9);
        let column = index % 9;
        return column * 9 + row;
    }

    /**
     * No symmetry. {@see SymmetryFunction}
     */
    static noSymmetry = (index: number) => {
        return Generator.getRandomIndex();
    }
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
                       symmetry: SymmetryFunction = Symmetry.central) => {
        let solvedGames: SudokuGame[];
        solvedGames = Generator.getSolvedGames(maxTries);
        let uniquelySolvableGames: SudokuGame[] = [];
        solvedGames.forEach(game => {
            uniquelySolvableGames = _.concat(uniquelySolvableGames,
                Generator.getUniquelySolvableGames(game, maxTries, symmetry));
        });

        //TODO rate and chose game
        return uniquelySolvableGames;
    }

    /**
     * Gets a random index of a sudoku's square.
     *
     * @returns {number} the index
     */
    static getRandomIndex() {
        return Math.floor(Math.random() * 81);
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

    /**
     * Returns an array of {@SudokuGame}s that are uniquely solvable given a solved game.
     *
     * It uses 'maxTries' tries to find puzzles from a given solved game. If a symmetry is given
     * it is obseverd.
     *
     * @param {SudokuGame} game the solved game to start with
     * @param {number} maxTries the minimum Number of game to be returned
     * @param {SymmetryFunction} symmetry optional, the symmetry to observe
     * @returns {SudokuGame[]} the puzzles
     */
    private static getUniquelySolvableGames(game: SudokuGame, maxTries: number, symmetry: SymmetryFunction) {
        let uniquelySolvableGames: SudokuGame[] = [];
        let oldGame, newGame, otherNewGame: SudokuGame;
        let indices: number[];
        let newGameSolvable, otherNewGameSolvable: boolean;

        //for each try
        _.range(maxTries).forEach(() => {
            //remove pairs of indices as long the sudoku is uniquely solvable
            newGame = game;
            do {
                oldGame = newGame;
                indices = this.getRandomIndices(symmetry);
                newGame = this.removeIndicesFromGame(oldGame, indices);
            } while (this.isUniquelySolvable(newGame));

            //try to add one of indices already removed
            newGame = this.removeIndicesFromGame(oldGame, [indices[0]]);
            otherNewGame = this.removeIndicesFromGame(oldGame, [indices[1]]);
            newGameSolvable = this.isUniquelySolvable(newGame);
            otherNewGameSolvable = this.isUniquelySolvable(otherNewGame);

            //add found puzzles to result
            if (newGameSolvable) {
                uniquelySolvableGames.push(newGame);
            }
            if (otherNewGameSolvable) {
                uniquelySolvableGames.push(otherNewGame);
            }
            if (!(newGameSolvable || otherNewGameSolvable)) {
                uniquelySolvableGames.push(oldGame);
            }
        });

        return uniquelySolvableGames;
    }

    /**
     * Gets two indices with the given symmetry.
     *
     * @param {Symmetry} symmetry the given symmetry
     * @returns {number[]} the two indices
     */
    private static getRandomIndices(symmetry: SymmetryFunction) {
        let indexToRemove = this.getRandomIndex();
        let partnerToRemove = symmetry(indexToRemove);
        return [indexToRemove, partnerToRemove];
    }

    /**
     * Returns a new {@code SudokuGame} with removed set squares at given indices.
     *
     * @param {SudokuGame} game the (unmodified) game to remove indices from
     * @param {number[]} indices the indices to remove
     * @returns {SudokuGame} the new game
     */
    private static removeIndicesFromGame(game: SudokuGame, indices: number[]) {
        let oldString = game.getCurrentState().toSimpleString();
        let oldStringArray = oldString.split('');
        let newStringArray = oldStringArray.slice();
        indices.forEach(index => {
            newStringArray[index] = '*';
        });
        let newString = newStringArray.join('');
        return new SudokuGame(newString);
    }

    /**
     * @deprecated
     * @param {SudokuGame} game
     * @returns {boolean}
     */
    private static isUniquelySolvable(game: SudokuGame) {
        let gameCopy = new SudokuGame(game.getCurrentState().toSimpleString())
        let backtracker = new Backtracker(gameCopy);
        backtracker.solve();
        return backtracker.solvedGames.length === 1;
    }
}
