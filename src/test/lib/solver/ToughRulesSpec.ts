import {SudokuGame} from "../../../lib/game/SudokuGame";
import {Solver} from "../../../lib/solver/Solver";

describe('A Solver with ToughRules', () => {
    it('should be able to solve a game with the Y-Wing Rule',
        () => {
            let blrPlusString = `
*16 **7 8*3
*** 8** ***
*7* **1 *6*

*48 *** 3**
6** *** **2
**9 *** 65*

*6* 9** *2*
*** **2 ***
9*4 6** 51*
`;

            let game = new SudokuGame(blrPlusString);
            let solver = new Solver(game);
            solver.addStandardRules();
            solver.solve();
            expect(game.isSolved()).toBe(true);
        });

    it('should be able to solve a moderate game with the Y-Wing Rule',
        () => {
            let moderateString = `
4** *1* ***
*** 3*9 *4*
*7* **5 **9

*** *6* *21
**4 *7* 6**
19* *5* ***

9** 4** *7*
*3* 6*8 ***
*** *3* **6
`;

            let game = new SudokuGame(moderateString);
            let solver = new Solver(game);
            solver.addStandardRules();
            solver.solve();
            expect(game.isSolved()).toBe(true);
        });
});