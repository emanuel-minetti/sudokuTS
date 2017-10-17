import {SolverRule, TRuleFunction} from "./SolverRule";
import {SudokuStateChange} from "../game/SudokuStateChange";
import {Square} from "../game/Square";
import * as _ from "lodash";
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
        let moves: SudokuStateChange[] = [];
        let units = sudoku.getUnits();
        //for each unit
        units.forEach((unit) => {
            //find candidates for pair
            let pairCandidates: Square[] = RulesHelper.getUnsetSquares(unit);
            // for these candidates find all pairs
            let pairs = RulesHelper.getTupelsOfSquares(pairCandidates, 2);
            //for these pairs find all naked pairs
            pairs.forEach((pair) => {
                let union: number[] = [];
                pair.forEach((pairSquare) => {
                    union = _.union(union, pairSquare.getCandidates());
                });
                if (union.length === 2) {
                    //naked pair found
                    //for this naked pair find all common units
                    let commonUnits = RulesHelper.findCommonUnits(sudoku, pair);
                    //for each common unit
                    commonUnits.forEach((commonUnit) => {
                        //for each square in this unit
                        commonUnit.forEach((square) => {
                            //that is not part of the pair
                            if (_.indexOf(pair, square) === -1) {
                                //find the values to remove
                                let valuesToRemove = _.intersection(square.getCandidates(), union);
                                if (valuesToRemove.length !== 0) {
                                    let move = new SudokuStateChange(square.getIndex(), valuesToRemove,
                                        'removed ' + valuesToRemove + ' from candidates of ' + square.getName());
                                    moves.push(move);
                                }
                            }
                        });
                    });
                }
            });
        });
        return moves;
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
    private static _ntRuleFn : TRuleFunction = (sudoku => {
        let moves: SudokuStateChange[] = [];
        let units = sudoku.getUnits();
        //for each unit
         units.forEach((unit) => {
             //find candidates for triple
             let tripleCandidates: Square[] = RulesHelper.getUnsetSquares(unit);
             // for these candidates find all triples
             let triples = RulesHelper.getTupelsOfSquares(tripleCandidates, 3);
             //for these triples find all naked triples
             triples.forEach((triple) => {
                let union: number[] = [];
                triple.forEach((tripleSquare) => {
                   union = _.union(union, tripleSquare.getCandidates());
                });
                if (union.length === 3) {
                    //naked triple found
                    //for this naked triple find all common units
                    let commonUnits = RulesHelper.findCommonUnits(sudoku, triple);
                    //for each common unit
                    commonUnits.forEach((commonUnit) => {
                       //for each square in this unit
                       commonUnit.forEach((square) => {
                           //that is not part of the triple
                           if (_.indexOf(triple, square) === -1) {
                               //find the values to remove
                               let valuesToRemove = _.intersection(square.getCandidates(), union);
                               if (valuesToRemove.length !== 0) {
                                   let move = new SudokuStateChange(square.getIndex(), valuesToRemove,
                                       'removed ' + valuesToRemove + ' from candidates of ' + square.getName());
                                   moves.push(move);
                               }
                           }
                       });
                    });
                }
             });
         });
        return moves;
    });

    //TODO document!
    private static _hpRuleFn: TRuleFunction = (sudoku) => {
        let moves: SudokuStateChange[] = [];
        let units = sudoku.getUnits();
        let allPairs: number[][] = [];
        Sudoku.values.forEach((firstValue) => {
            Sudoku.values.forEach((secondValue) => {
                if (firstValue <= secondValue) {
                    allPairs.push([firstValue, secondValue]);
                }
            });
        });
        //for each unit
        units.forEach((unit) => {
            //for each pair of values
            allPairs.forEach((pair) => {
                //find all squares that have one of the pair in their candidates
                let containingSquares: Square[] = [];
                unit.forEach((square) => {
                    let candidates = square.getCandidates();
                    let intersection = _.intersection(candidates, pair);
                    if (candidates && intersection.length != 0) {
                        containingSquares.push(square);
                    }
                });
                if (containingSquares.length === 2) {
                    let intersection = _.intersection(
                        containingSquares[0].getCandidates(),
                        containingSquares[1].getCandidates(),
                        pair);
                    if (intersection.length === 2) {
                        //hidden pair found
                        //so remove the difference from each square
                        containingSquares.forEach((square) => {
                            let difference = _.difference(
                                square.getCandidates(), pair);
                            if (difference.length !== 0) {
                                let move = new SudokuStateChange(square.getIndex(),
                                    difference, 'removed ' +
                                    difference + ' from candidates of ' +
                                    square.getName());
                                moves.push(move);
                            }
                        });
                    }
                }
            });
        });
        return moves;
    }

    rules: SolverRule[];

    constructor() {
        this.rules = [];

        let npRule = new SolverRule('Naked Pair Rule: ', 4, BasicRules._npRuleFn);
        this.rules.push(npRule);

        let hpRule = new SolverRule('Hidden Pair Rule: ', 4, BasicRules._hpRuleFn);
        this.rules.push(hpRule);

        let ntRule = new SolverRule('Naked Triple Rule: ', 4, BasicRules._ntRuleFn);
        this.rules.push(ntRule);
    }
};
