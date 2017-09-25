import {SudokuGame, SudokuStateChange} from "./SudokuGame";

type TRuleFunction = (game: SudokuGame)=> SudokuStateChange[];
export class SolverRule {


    constructor(private name: string,
                private baseRating: number,
                private rule: TRuleFunction) { }
}

export class Solver {
    private rules: SolverRule[];

    constructor(private game: SudokuGame) {}

    addRules() {
        //TODO implement
    }

    solve(): boolean {
        //TODO implement
        return undefined === this.game.getSolvedState();
    }
}