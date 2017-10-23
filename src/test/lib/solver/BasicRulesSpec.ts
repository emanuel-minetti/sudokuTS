import {SudokuGame} from "../../../lib/game/SudokuGame";
import {Solver} from "../../../lib/solver/Solver";

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
})