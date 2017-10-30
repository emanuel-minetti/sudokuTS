import * as _ from "lodash";

import {SudokuStateChange} from "../game/SudokuStateChange";
import {SolverRule, TRuleFunction} from "./SolverRule";
import {RulesHelper} from "./RulesHelper";

/**
 * A class grouping the tough sudoku rules.
 *
 * The rules were taken from the website 'http://www.sudokuwiki.org/sudoku.htm'
 * run by Andrew Stuart. The naming of the rules mostly follows the naming
 * on that site.
 */
export class ToughRules {

    //TODO document
    private static _ywRuleFn: TRuleFunction = (sudoku) => {
        let moves: SudokuStateChange[] = [];
        //find all squares with two candidates, the candidate squares
        let candidateSquares = sudoku.getSquares().filter(square => {
            let candidates = square.getCandidates();
            return (candidates && candidates.length === 2);
        });
        //collect all values in these squares
        let candidateValues = candidateSquares.reduce((prev, curr) => _.union(prev, curr.getCandidates()), []);
        //get all triplets of these values
        let valueTriplets = RulesHelper.getTuplesOfValues(candidateValues, 3);
        if (candidateSquares.length >= 3) {
            //for each triplet and candidate square
            valueTriplets.forEach(valueTriplet => {
                candidateSquares.forEach(candidateSquare => {
                    let candidates = candidateSquare.getCandidates();
                    let firstIntersection = _.intersection(candidates, valueTriplet);
                    //if this candidate square has two values from the triplet
                    if (firstIntersection.length === 2) {
                        let peers = sudoku.getPeers(candidateSquare);
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
                                secondIntersection = _.intersection(wingPair[0].getCandidates(),
                                    wingPair[1].getCandidates());
                                //if the wings have one common candidate
                                if (secondIntersection.length === 1) {
                                    //an Y-Wing is found!
                                    //So get all common peers
                                    let commonPeers = _.intersection(sudoku.getPeers(wingPair[0]),
                                        sudoku.getPeers(wingPair[1]));
                                    //filter out the candidate square, the already set squares and the squares that
                                    //haven't the one common candidate as own candidate
                                    commonPeers = commonPeers.filter(commonPeer => {
                                        let candidates = commonPeer.getCandidates();
                                        return (commonPeer !== candidateSquare && candidates &&
                                            candidates.indexOf(secondIntersection[0]) !== -1);
                                    });
                                    //for each such common peer
                                    commonPeers.forEach(commonPeer => {
                                        //remove the common value
                                        let move = new SudokuStateChange(commonPeer.getIndex(), secondIntersection,
                                            candidateSquare.getName() + ' points to wings ' + wingPair[0].getName() +
                                            '/' + wingPair[1].getName() + ', so removed ' + secondIntersection[0] +
                                            ' from candidates of ' + commonPeer.getName());
                                        moves.push(move);
                                    });
                                };
                            });
                        };
                    };
                });
            });
        };
        return moves;
    }

    rules: SolverRule[];

    constructor() {
        this.rules = [];

        let ywRule = new SolverRule('Y-Wing Rule: ', 15, ToughRules._ywRuleFn);
        this.rules.push(ywRule);
    }
}