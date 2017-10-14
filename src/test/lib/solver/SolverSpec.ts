import {SudokuGame} from "../../../lib/game/SudokuGame";
import {Solver} from "../../../lib/solver/Solver";
import {MostBasicRules} from "../../../lib/solver/MostBasicRules";
import {SolverRule} from "../../../lib/solver/SolverRule";

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

        it('should be possible to create a new rule', () => {
            let rule = new SolverRule('last square free ', 0.5, MostBasicRules.lsfRuleFn);
            expect(rule).toEqual(jasmine.any(SolverRule));
        });

        it('should be able to add one rule', () => {
            let rule = new SolverRule('last square free ', 0.5, MostBasicRules.lsfRuleFn);
            solver.addRules([rule]);
        });

        it('shouldn\'t be able to solve the sample game with the one sample rule', () => {
            expect(solver.solve()).toBe(false);
        });

        it( 'should be able to add an array of rules', () => {
            let rules: SolverRule[] = [];
            rules.push(new SolverRule('last square left rule ', 1, MostBasicRules.lslRuleFn));
            rules.push(new SolverRule('last candidate ', 1, MostBasicRules.lcRuleFn))
            solver.addRules(rules);
        });

        it('should be able to solve the test game with this rules', () => {
            expect(solver.solve()).toBe(true);
        });

        it('should be able to a set of standard rules', () => {
            solver = new Solver(game);
            solver.addStandardRules();
            expect(solver.solve()).toBe(true);
        });
    });