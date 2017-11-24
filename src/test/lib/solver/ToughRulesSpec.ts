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

    it('should be able to solve a Y-Wing game with the Y-Wing Rule',
        () => {
            let y_wingString = `
9** *4* ***
*** 6** *31
*2* *** *9*

*** 7** *2*
**2 935 6**
*7* **2 ***

*6* *** *73
51* **9 ***
*** *8* **9
`;

            let game = new SudokuGame(y_wingString);
            let solver = new Solver(game);
            solver.addStandardRules();
            solver.solve();
            expect(game.isSolved()).toBe(true);
        });

    it('should be able to solve a game with the X-Wing Rule (eliminating columns)',
        () => {
            let x_wingString = `
*1* *37 ***
*** *** *1*
6** **8 *29

*7* *49 6**
1** *** **3
**9 35* *7*

39* 2** **8
*4* *** ***
*** 79* *6*
`;

            let game = new SudokuGame(x_wingString);
            let solver = new Solver(game);
            solver.addStandardRules();
            solver.solve();
            expect(game.isSolved()).toBe(true);
        });

    it('should be able to solve a game with the X-Wing Rule (eliminating rows)',
        () => {
            let x_wingString = `
**3 91* 7**
*** **3 4**
1** *4* **6

*6* 7** ***
**2 1*9 6**
*** **2 *1*

7** *8* **3
**8 2** ***
**5 *71 9**
`;

            let game = new SudokuGame(x_wingString);
            let solver = new Solver(game);
            solver.addStandardRules();
            solver.solve();
            expect(game.isSolved()).toBe(true);
        });

    it('should be able to solve a game with the Swordfish Rule',
        () => {
            let sfString = `
98* *1* *2*
**2 7** ***
*** **9 *1*

7** *4* 8**
6** 1*7 **2
**9 *3* **5

*4* 9** ***
*** **5 7**
*7* *2* *39
`;

            let game = new SudokuGame(sfString);
            let solver = new Solver(game);
            solver.addStandardRules();
            solver.solve();
            expect(game.isSolved()).toBe(true);
        });

    it('should be able to solve a game with the Swordfish Rule (eliminating rows)',
        () => {
            let sfString = `
9** *** ***
*37 *1* 42*
84* *** 6*3

*** *34 81*
*** *6* ***
*68 12* ***

1*2 *** *84
*85 *7* 36*
*** *** **1
`;

            let game = new SudokuGame(sfString);
            let solver = new Solver(game);
            solver.addStandardRules();
            solver.solve();
            expect(game.isSolved()).toBe(true);
        });

    it('should be able to solve a game with the Swordfish Rule (eliminating columns)',
        () => {
            let sfString = `
*2* *4* *69
**3 8*6 2**
*6* *2* ***

89* 5** *1*
*** *** ***
*3* **1 *26

*** *1* *7*
**9 6*4 3**
27* *5* *9*
`;

            let game = new SudokuGame(sfString);
            let solver = new Solver(game);
            solver.addStandardRules();
            solver.solve();
            expect(game.isSolved()).toBe(true);
        });

    it('should be able to solve a game with the XYZ-Wing Rule',
        () => {
            let xyzwString = `
*72 *** 68*
*** 7** ***
5** *16 ***

*** *28 1**
2** 371 **6
**4 56* ***

*** 13* **4
*** **7 ***
*15 *** 89*
`;

            let game = new SudokuGame(xyzwString);
            let solver = new Solver(game);
            solver.addStandardRules();
            solver.solve();
            expect(game.isSolved()).toBe(true);
        });
});