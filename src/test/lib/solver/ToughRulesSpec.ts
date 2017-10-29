import {SudokuGame} from "../../../lib/game/SudokuGame";
import {Solver} from "../../../lib/solver/Solver";

describe('A Solver with BasicRules', () => {
    it('should be able to solve a game with the Y-Wing Rule',
        () => {
            let blrPlusSting = `
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

            let game = new SudokuGame(blrPlusSting);
            let solver = new Solver(game);
            solver.addStandardRules();
            solver.solve();
            expect(game.isSolved()).toBe(true);
        });
});