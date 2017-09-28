import {SudokuGame} from "../../lib/SudokuGame";
import {Solver} from "../../lib/Solver";

describe('A newly created Solver', () => {
        let sudokuString =
        '9** *** *6* \n' +
        '**2 89* *** \n' +
        '1** **5 2** \n' +
        '            \n' +
        '**1 **7 *96 \n' +
        '*** 1*9 *** \n' +
        '35* 4** 8** \n' +
        '            \n' +
        '**3 9** **2 \n' +
        '*** *42 5** \n' +
        '*6* *** **7 \n';
        let game = new SudokuGame(sudokuString);
        let solver: Solver;

        it('could be constructed with a sudoku game given', () => {
            solver = new Solver(game);
            expect(solver).toEqual(jasmine.any(Solver));
        });
    });