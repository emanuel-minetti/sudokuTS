///<reference path="BasicRules.ts"/>
import {SudokuGame, SudokuStateChange} from "./SudokuGame";
import {Sudoku} from "./Sudoku";
import {BasicRules} from "./BasicRules";
import * as _ from "lodash";

type TRuleFunction = (sudoku: Sudoku)=> SudokuStateChange[];
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
}

export class Solver {
    private rules: SolverRule[];

    constructor(private game: SudokuGame) {
        this.addRules();
    }

    addRules() {
        let basicRules = new BasicRules();
        this.rules = _.union(this.rules, basicRules.rules)
    }

    solve(): boolean {
        //TODO implement a better loop
        let solved = false;
        let allTried = false;
        while (!solved && !allTried) {
            this.rules.forEach((rule) => {
                let moves = rule.getRule()(this.game.getCurrentState());
                let numberOfMoves = moves.length;
                if (numberOfMoves !== 0) {
                    let rating = rule.getRating() / numberOfMoves;
                    let move = moves[0];
                    this.game.changeState(move);
                    solved = this.game.isSolved();
                }
                else {
                    allTried = true;
                }
            })
        }
        return undefined !== this.game.getSolvedState();
    }
}