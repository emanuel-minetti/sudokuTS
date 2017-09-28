import {SudokuGame} from "../../lib/SudokuGame";
import {Sudoku} from "../../lib/Sudoku";

describe('A newly created SudokuGame', () => {
    let sudokuGame: SudokuGame;
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

    it('should be constructed via a sudoku string', () => {
        sudokuGame = new SudokuGame(sudokuString);
        expect(sudokuGame).toEqual(jasmine.any(SudokuGame));
    });

    it('should report its original state', () => {
        expect(sudokuGame.getOriginalState()).toEqual(Sudoku.createSudokuByString(sudokuString));
    });
    
    it('report a list of changes', () => {
        expect(sudokuGame.getChanges()).toEqual([]);
    });

    it('should report its current state', () => {
        let sudoku = Sudoku.createSudokuByString(sudokuString);
        sudokuGame.getCurrentState().getSquares().forEach((square, index) =>
            expect(square).toEqual(sudoku.getSquares()[index]));
    });

    it('should not report a solution', () => {
        expect(sudokuGame.getSolvedState()).toBeNull();
    });

    it('should not report a rating', () => {
        expect(sudokuGame.getRating()).toBeUndefined();
    });

    it('should not be able to change the state of a game illegally', () => {
        expect(sudokuGame.doChangeState(60, 8, 'last possibility', 0.1)).toBe(false);
    });

    it('should report a string containing the made changes', () => {
        expect(sudokuGame.getChangesString()).toEqual('');
    });

    it('should report its rating', () => {
        expect(sudokuGame.getRating()).toBeUndefined();
    });

    it('should be able to change the state of a game legally', () => {
        expect(sudokuGame.doChangeState(60, 6, 'last possibility rule in Unit IX', 0.1)).toBe(true);
    });

    it('should report a string containing the made changes', () => {
        expect(sudokuGame.getChangesString()).toEqual(
            'Changed Square G7 to value 6 because last possibility rule in Unit IX\n\tRating: 0.1\n');
    });

    it('should report its rating', () => {
        expect(sudokuGame.getRating()).toEqual(0.1);
    });

    it('should be able to change again the state of a game legally', () => {
        expect(sudokuGame.doChangeState(66, 6, 'last possibility rule in Unit H', 0.1)).toBe(true);
    });

    it('should report a string containing the made changes', () => {
        expect(sudokuGame.getChangesString()).toEqual(
            'Changed Square G7 to value 6 because last possibility rule in Unit IX\n\tRating: 0.1\n' +
            'Changed Square D8 to value 6 because last possibility rule in Unit H\n\tRating: 0.1\n');
    });

    it('should report its rating', () => {
        expect(sudokuGame.getRating()).toEqual(0.2);
    });
});

describe('A Game should report when it\'s solved', () => {
    let nearlySolvedSudokuString =
        '935 214 768 \n' +
        '672 893 154 \n' +
        '148 765 239 \n' +
        '            \n' +
        '421 587 396 \n' +
        '786 139 425 \n' +
        '359 426 871 \n' +
        '            \n' +
        '513 978 642 \n' +
        '897 642 513 \n' +
        '264 351 98* \n';

    let game = new SudokuGame(nearlySolvedSudokuString);

   it('should report not to be solved when there is one missing square', () => {
       //TODO implement
   }); 
   
   it('should report false to an illegal move', () => {
       //TODO implement
   });

   it('should report true to a legal last move', () => {
      //TODO implement
   });

   it('should report to be solved', () => {
       //TODO implement
   });

   it('should report a solved sudoku', () => {
       //TODO implement
   });
});