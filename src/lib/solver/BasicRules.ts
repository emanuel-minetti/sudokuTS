import * as _ from "lodash";
import {SolverRule, TRuleFunction} from "./SolverRule";
import {SudokuStateChange} from "../game/SudokuStateChange";
import {Sudoku} from "../game/Sudoku";
import {RulesHelper} from "./RulesHelper";

/**
 * A class grouping the simple sudoku rules.
 *
 * The rules were taken from the website 'http://www.sudokuwiki.org/sudoku.htm'
 * run by Andrew Stuart. The naming of the rules mostly follows the naming
 * on that site.
 */
export class BasicRules {

    /**
     * The 'naked pair rule' checks each unit whether there are two squares
     * that have only the same two candidates. If it finds such a pair, it
     * removes their candidate from all other squares that are in units shared
     * by this pair.
     *
     * @param {Sudoku} sudoku the state of the game
     * @returns {SudokuStateChange[]} an array of moves that could be
     * done according this rule
     */
    private static _npRuleFn: TRuleFunction = (sudoku) => {
        return RulesHelper.nakedTupleRule(sudoku, 2);
    }

    /**
     * The 'naked triple rule' checks each unit whether there are three squares
     * that have just three candidates in common. If it finds such a triple, it
     * removes the common candidates from all other squares that are in units shared
     * by this triple.
     *
     * @param {Sudoku} sudoku the state of the game
     * @returns {SudokuStateChange[]} an array of moves that could be
     * done according this rule
     */
    private static _ntRuleFn: TRuleFunction = (sudoku) => {
        return RulesHelper.nakedTupleRule(sudoku, 3);
    }

    /**
     * The 'naked quadruple rule' checks each unit whether there are four squares
     * that have just four candidates in common. If it finds such a quadruple, it
     * removes the common candidates from all other squares that are in units shared
     * by this triple.
     *
     * @param {Sudoku} sudoku the state of the game
     * @returns {SudokuStateChange[]} an array of moves that could be
     * done according this rule
     */
    private static _nqRuleFn: TRuleFunction = (sudoku) => {
        return RulesHelper.nakedTupleRule(sudoku, 4);
    }

    /**
     * The 'hidden pair rule' checks each unit whether there are two candidates
     * that have just two squares in common. If it finds such a pair, it
     * removes the common candidates from all other squares in this unit.
     *
     * @param {Sudoku} sudoku the state of the game
     * @returns {SudokuStateChange[]} an array of moves that could be
     * done according this rule
     */
    private static _hpRuleFn: TRuleFunction = (sudoku) => {
        return RulesHelper.hiddenTupleRule(sudoku, 2);
    }

    /**
     * The 'hidden triple rule' checks each unit whether there are three candidates
     * that have just three squares in common. If it finds such a triple, it
     * removes the common candidates from all other squares in this unit.
     *
     * @param {Sudoku} sudoku the state of the game
     * @returns {SudokuStateChange[]} an array of moves that could be
     * done according this rule
     */
    private static _htRuleFn: TRuleFunction = (sudoku) => {
        return RulesHelper.hiddenTupleRule(sudoku, 3);
    }

    /**
     * The 'hidden quadruple rule' checks each unit whether there are four candidates
     * that have just four squares in common. If it finds such a quadruple, it
     * removes the common candidates from all other squares in this unit.
     *
     * @param {Sudoku} sudoku the state of the game
     * @returns {SudokuStateChange[]} an array of moves that could be
     * done according this rule
     */
    private static _hqRuleFn: TRuleFunction = (sudoku) => {
        return RulesHelper.hiddenTupleRule(sudoku, 4);
    }

    //TODO comment and document!
    private static _ppRuleFn: TRuleFunction = (sudoku) => {
        let moves: SudokuStateChange[] = [];
        let boxes = sudoku.getBoxes();
        //check boxes
        boxes.forEach(box => {
           let remainingValues = RulesHelper.getRemainingValues(box);
           remainingValues.forEach(remainingValue => {
              let containingSquares = box.filter(square => {
                  let candidates = square.getCandidates();
                  if (candidates) {
                      return candidates.indexOf(remainingValue) !== -1
                  }
                  return false;
              });
              let csLength = containingSquares.length;
              if (csLength === 2 ||  csLength === 3) {
                  let commonUnits = sudoku.findCommonUnits(containingSquares);
                  if (commonUnits.length === 2) {
                      let otherUnit =
                          !_.isEqual(commonUnits[0], box) ?
                              commonUnits[0] : commonUnits[1];
                      otherUnit.forEach(square => {
                          if (containingSquares.indexOf(square) === -1) {
                              let candidates = square.getCandidates();
                              if (candidates &&
                                  candidates.indexOf(remainingValue) !== -1) {
                                  //add move
                                  let move = new SudokuStateChange(
                                      square.getIndex(), [remainingValue],
                                       'removed ' + remainingValue +
                                      ' from candidates of ' +
                                      square.getName());
                                  moves.push(move);
                              }
                          }
                      });
                  }
              }
           });
        });
        //check rows and columns
        //TODO implement!
        return moves;
    }

    rules: SolverRule[];

    constructor() {
        this.rules = [];

        let npRule = new SolverRule('Naked Pair Rule: ', 4, BasicRules._npRuleFn);
        this.rules.push(npRule);

        let hpRule = new SolverRule('Hidden Pair Rule: ', 5, BasicRules._hpRuleFn);
        this.rules.push(hpRule);

        let ntRule = new SolverRule('Naked Triple Rule: ', 6, BasicRules._ntRuleFn);
        this.rules.push(ntRule);

        let htRule = new SolverRule('Hidden Triple Rule: ', 7, BasicRules._htRuleFn);
        this.rules.push(htRule);

        let nqRule = new SolverRule('Naked Quadruple Rule: ', 8, BasicRules._nqRuleFn);
        this.rules.push(nqRule);

        let hqRule = new SolverRule('Hidden Quadruple Rule: ', 9, BasicRules._hqRuleFn);
        this.rules.push(hqRule);

        let ppRule = new SolverRule('Pointing Pairs Rule: ', 10, BasicRules._ppRuleFn);
        this.rules.push(ppRule);
    }
};
