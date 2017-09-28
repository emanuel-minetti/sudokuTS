import {SudokuGame} from "../../lib/SudokuGame";
import {Solver, SolverRule} from "../../lib/Solver";
import {BasicRules} from "../../lib/BasicRules";

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
        let rules: SolverRule[];
        let rule: SolverRule;

        it('could be constructed with a sudoku game given', () => {
            solver = new Solver(game);
            expect(solver).toEqual(jasmine.any(Solver));
        });

        it('should be possible to create a new rule', () => {
            rule = new SolverRule('last candidate rule ', 0.5, BasicRules.lcRuleFn);
            expect(rule).toEqual(jasmine.any(SolverRule));
        });

        it('should be able to add one rule', () => {
            solver.addRules([rule]);
        });

        it('shouldn\'t be able to solve the sample game with the one sample rule', () => {
            expect(solver.solve()).toBe(false);
        });

        it('should be able to add an array of rules', () => {
            rules = [];
            rule = new SolverRule('last square left rule ', 1, BasicRules.lslRuleFn);
            rules.push(rule);
            rule = new SolverRule('last square free rule ', 1, BasicRules.lsfRuleFn);
            rules.push(rule);
            solver.addRules(rules);
        });
        
        it('should be able to solve the test game with this rules', () => {
            expect(solver.solve()).toBe(true);
        });
    });