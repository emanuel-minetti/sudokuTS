import {SudokuGame} from '../game/SudokuGame';

import {Sudoku} from "../game/Sudoku";
import {BasicRules} from "./BasicRules";
import * as _ from "lodash";
import {SudokuStateChange} from "../game/SudokuStateChange";

/**
 * Type that a solver rule must follow.
 */
export type TRuleFunction = (sudoku: Sudoku) => SudokuStateChange[];

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
                        moves.forEach((move) => {
                            move.setRating(rating);
                            move.setReason(rule.getName() + move.getReason());
                            if (this.game.changeState(move)) {
                                solved = this.game.isSolved();
                                ruleApplied = true;
                            }
                        })
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