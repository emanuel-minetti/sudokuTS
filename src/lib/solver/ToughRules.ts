import * as _ from "lodash";

import {SudokuStateChange} from "../game/SudokuStateChange";
import {SolverRule, TRuleFunction} from "./SolverRule";
import {RulesHelper} from "./RulesHelper";
import {Sudoku} from "../game/Sudoku";
import {Square} from "../game/Square";
import {AbstractToughRules} from "./AbstractToughRules";

/**
 * A class grouping the tough sudoku rules.
 *
 * The rules were taken from the website 'http://www.sudokuwiki.org/sudoku.htm'
 * run by Andrew Stuart. The naming of the rules mostly follows the naming
 * on that site.
 */
export class ToughRules {

    /**
     * The Y-Wing rule checks all squares that have two remaining candidates.
     * From these squares it takes the union of all remaining candidates.
     * From this union it takes all triples of values. For every remaining
     * candidate and every value triple it checks for possible wings. Possible
     * wings are pairs of squares whose candidates give the full triple and
     * that have one candidate in common with the square candidate. For each such
     * pair of wings it removes the common candidate from each common peer
     * whose candidates contain it.
     *
     * @param {Sudoku} sudoku the state of the game
     * @returns {SudokuStateChange[]} an array of moves that could be done according this rule
     * @private
     */
    private static _ywRuleFn: TRuleFunction = (sudoku) => {
        let moves: SudokuStateChange[] = [];
        //find all squares with two candidates, the candidate squares
        let candidateSquares = sudoku.getSquares().filter(square => {
            let candidates = square.getCandidates();
            return (candidates && candidates.length === 2);
        });
        //collect all values in these squares
        let candidateValues = candidateSquares.reduce((prev: number[], curr: Square): number[] =>
            _.union(prev, curr.getCandidates()), []);
        //get all triplets of these values
        let valueTriplets = RulesHelper.getTuplesOfValues(candidateValues, 3);
        if (candidateSquares.length >= 3) {
            //for each triplet and candidate square
            valueTriplets.forEach(valueTriplet => {
                candidateSquares.forEach(candidateSquare => {
                    let firstIntersection = candidateSquare.getCandidateIntersection(valueTriplet);
                    //if this candidate square has two values from the triplet
                    if (firstIntersection.length === 2) {
                        let peers = sudoku.getPeersOfSquare(candidateSquare);
                        //find the wings for this candidate square
                        let wings = peers.filter(peer => {
                            let peerCandidates = peer.getCandidates();
                            return (peerCandidates && peerCandidates.length === 2 &&
                                _.intersection(peerCandidates, valueTriplet).length === 2 &&
                                _.intersection(peerCandidates, firstIntersection).length === 1);
                        });
                        if (wings.length >= 2) {
                            //get all pairs of wings
                            let wingPairs = RulesHelper.getTupelesOfSquares(wings, 2);
                            let secondIntersection: number[];
                            //for each pair
                            wingPairs.forEach(wingPair => {
                                secondIntersection = wingPair[0].getCandidateIntersection(wingPair[1].getCandidates()!);
                                //if the wings have one common candidate
                                if (secondIntersection.length === 1) {
                                    //an Y-Wing is found!
                                    //So get all common peers
                                    let commonPeers = _.intersection(sudoku.getPeersOfSquare(wingPair[0]),
                                        sudoku.getPeersOfSquare(wingPair[1]));
                                    //filter out the candidate square, the already set squares and the squares that
                                    //haven't the one common candidate as own candidate
                                    commonPeers = commonPeers.filter(commonPeer =>
                                        (commonPeer !== candidateSquare &&
                                            commonPeer.containsCandidate(secondIntersection[0])));
                                    //for each such common peer
                                    commonPeers.forEach(commonPeer => {
                                        //remove the common value
                                        let move = new SudokuStateChange(commonPeer.getIndex(), secondIntersection,
                                            candidateSquare.getName() + ' points to wings ' + wingPair[0].getName() +
                                            '/' + wingPair[1].getName() + ', so removed ' + secondIntersection[0] +
                                            ' from candidates of ' + commonPeer.getName());
                                        moves.push(move);
                                    });
                                }
                            });
                        }
                    }
                });
            });
        }
        return moves;
    }

    /**
     * The X-Wing rule searches firstly rows then columns for defining 'X'-es.
     * @see AbstractBasicRules.abstractCrossExclude
     *
     * @param {Sudoku} sudoku sudoku the state of the game
     * @returns {SudokuStateChange[]} an array of moves that could be done according this rule
     * @private
     */
    private static _xwRuleFn: TRuleFunction = (sudoku) => {
        let moves: SudokuStateChange[];
        let rows = sudoku.getRows();
        let columns = sudoku.getColumns();
        moves = AbstractToughRules.abstractCrossExclude(columns, rows, 2);
        moves = _.concat(moves, AbstractToughRules.abstractCrossExclude(rows, columns, 2));
        return moves;
    }

    /**
     * The Swordfish rule searches firstly rows then columns for defining '3*3' squares.
     * @see AbstractBasicRules.abstractCrossExclude
     *
     * @param {Sudoku} sudoku sudoku the state of the game
     * @returns {SudokuStateChange[]} an array of moves that could be done according this rule
     * @private
     */
    private static _sfRuleFn: TRuleFunction = (sudoku) => {
        let moves: SudokuStateChange[];
        let rows = sudoku.getRows();
        let columns = sudoku.getColumns();
        moves = AbstractToughRules.abstractCrossExclude(columns, rows, 3);
        moves = _.concat(moves, AbstractToughRules.abstractCrossExclude(rows, columns, 3));
        return moves;
    }

    rules: SolverRule[];

    constructor() {
        this.rules = [];

        let xwRule = new SolverRule('X-Wing Rule: ', 13, ToughRules._xwRuleFn);
        this.rules.push(xwRule);

        let ywRule = new SolverRule('Y-Wing Rule: ', 15, ToughRules._ywRuleFn);
        this.rules.push(ywRule);

        let sfRule = new SolverRule('Swordfish Rule: ', 16, ToughRules._sfRuleFn);
        this.rules.push(sfRule);
    }
}