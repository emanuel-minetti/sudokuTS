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
}

export class Solver {
    private rules: SolverRule[];

    constructor(private game: SudokuGame) {}

    addRules() {
        let basicRules = new BasicRules();
        this.rules = _.union(this.rules, basicRules.rules)
    }

    solve(): boolean {
        //TODO implement
        return undefined !== this.game.getSolvedState();
    }
}