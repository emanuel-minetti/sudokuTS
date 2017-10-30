import {SudokuGame} from "../../../lib/game/SudokuGame";
import {Solver} from "../../../lib/solver/Solver";
import {MostBasicRules} from "../../../lib/solver/MostBasicRules";
import {BasicRules} from "../../../lib/solver/BasicRules";

describe('A Solver with BasicRules', () => {

    it('should be able to solve a game with the naked triple rule', () => {
        let nakedTripleString = `
*** *** ***
**1 9** 5**
56* 31* *9*

1** 6** *28
**4 *** 7**
27* **4 **3

*4* *68 *35
**2 **5 9**
*** *** ***`;

        let game = new SudokuGame(nakedTripleString);
        let solver = new Solver(game);
        solver.addStandardRules();
        solver.solve();
        expect(game.isSolved()).toBe(true);
    });

    it('should be able to solve a game with the hidden triple rule', () => {
        let hiddenTripleString = `
3** *** ***
97* *1* ***
6** 583 ***

2** *** 9**
5** 621 **3
**8 *** **5

*** 435 **2
*** *9* *56
*** *** **1
`;

        let game = new SudokuGame(hiddenTripleString);
        let solver = new Solver(game);
        solver.addStandardRules();
        solver.solve();
        expect(game.isSolved()).toBe(true);
    });

    it('should be able to solve a game with the pointing pairs rule',
        () => {
            let pointingPairsString = `
9** *5* ***
2** 63* **5
**6 **2 ***

**3 1** *7*
*** *2* 9**
*8* **5 ***

*** 8** 1**
5** *1* **4
*** *6* **8
`;

            let game = new SudokuGame(pointingPairsString);
            let solver = new Solver(game);
            solver.addStandardRules();
            solver.solve();
            expect(game.isSolved()).toBe(true);
        });

    it('should be able to get 43 moves on a game with the box/line rule',
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
            let mostBasicRules = new MostBasicRules();
            let basicRules = new BasicRules();
            solver.addRules(mostBasicRules.rules);
            solver.addRules(basicRules.rules);
            solver.solve();
            expect(game.getChanges().length).toBe(43);
        });
})