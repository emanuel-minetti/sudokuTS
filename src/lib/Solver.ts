///<reference path="BasicRules.ts"/>
import {SudokuGame, SudokuStateChange} from "./SudokuGame";
import {Sudoku} from "./Sudoku";
import {BasicRules} from "./BasicRules";
import * as _ from "lodash";

export type TRuleFunction = (sudoku: Sudoku)=> SudokuStateChange[];
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

export class Solver {
    private game: SudokuGame;
    private rules: SolverRule[];

    constructor(game: SudokuGame) {
        this.game = game;
        this.rules = [];
    }

    addRules(rules: SolverRule[]) {
        _.concat(this.rules, rules);
    }

    addStandardRules() {
        let basicRules = new BasicRules();
        this.rules = _.concat(this.rules, basicRules.rules)
    }

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