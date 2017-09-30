import {SudokuGame, SudokuStateChange} from './SudokuGame';

import {Sudoku} from "./Sudoku";
import {BasicRules} from "./BasicRules";
import * as _ from "lodash";

/**
 * Type that a solver rule must follow.
 */
export type TRuleFunction = (sudoku: Sudoku)=> SudokuStateChange[];

/**
 * A class to represent a rule to be applied to a sudoku game.
 */
export class SolverRule {

    constructor(private name: string,
                private baseRating: number,
                private rule: TRuleFunction) {
    }

    getRule() {
        return this.rule;
    }

    getRating() {
        return this.baseRating;
    }

    getName() {
        return this.name;
    }
}

/**
 * This class represents a solver to a given game.
 */
export class Solver {
    private readonly game: SudokuGame;
    private rules: SolverRule[];

    constructor(game: SudokuGame) {
        this.game = game;
        this.rules = [];
    }

    addRules(rules: SolverRule[]) {
        this.rules = _.concat(this.rules, rules);
    }

    addStandardRules() {
        let basicRules = new BasicRules();
        this.rules = _.concat(this.rules, basicRules.rules)
    }

    /**
     * This method actually solves the associated game.
     *
     * It applies every rule registered with this solver.
     * In a loop it tries each rule from simplest to
     * hardest. If it finds a rule that applies it sets a
     * single move according this rule. It also sets the reason
     * and rating of the move. The rating is calculated from
     * the base rating of the rule divided by the number of
     * possibilities for the rule. After a rule is applied
     * the loop starts again. The loop ends when the game is
     * solved or if no rule could be applied.
     *
     * @returns {boolean} whether the game was solved
     */
    solve(): boolean {
        let allTried = false;
        let solved = false;
        let ruleApplied: boolean;
        while (!solved && !allTried) {
            ruleApplied = false;
            this.rules.forEach((rule) => {
                if (!ruleApplied) {
                    let moves = rule.getRule()(this.game.getCurrentState());
                    let numberOfMoves = moves.length;
                    if (numberOfMoves !== 0) {
                        let rating = rule.getRating() / numberOfMoves;
                        let move = moves[0];
                        move.rating = rating;
                        move.reason = rule.getName() + move.reason;
                        this.game.changeState(move);
                        solved = this.game.isSolved();
                        ruleApplied = true;
                    }
                }
            })
            if (!ruleApplied) {
                allTried = true;
            }
        }
        return this.game.isSolved();
    }
}