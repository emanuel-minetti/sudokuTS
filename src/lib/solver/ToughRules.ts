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

    //TODO document and comment
    private static _ywRuleFn: TRuleFunction = (sudoku) => {
        let moves: SudokuStateChange[] = [];
        let candidateSquares = sudoku.getSquares().filter(square => {
            let candidates = square.getCandidates();
            return (candidates && candidates.length === 2);
        });
        let candidateValues = candidateSquares.reduce((prev, curr) => _.union(prev, curr.getCandidates()), []);
        let valueTriplets = RulesHelper.getTuplesOfValues(candidateValues, 3);
        if (candidateSquares.length >= 3) {
            valueTriplets.forEach(valueTriplet => {
                candidateSquares.forEach(candidateSquare => {
                    let candidates = candidateSquare.getCandidates();
                    let firstIntersection = _.intersection(candidates, valueTriplet);
                    if (firstIntersection.length === 2) {
                        let peers = sudoku.getPeers(candidateSquare);
                        let wings = peers.filter(peer => {
                            let peerCandidates = peer.getCandidates();
                            return (peerCandidates && peerCandidates.length === 2 &&
                                _.intersection(peerCandidates, valueTriplet).length === 2 &&
                                _.intersection(peerCandidates, firstIntersection).length === 1);
                        });
                        if (wings.length >= 2) {
                            let secondIntersection = _.intersection(wings[0].getCandidates(), wings[1].getCandidates());
                            if (secondIntersection.length === 1) {
                                //Y-Wing found!
                                let commonPeers = _.intersection(sudoku.getPeers(wings[0]), sudoku.getPeers(wings[1]));
                                commonPeers = commonPeers.filter(commonPeer => {
                                    let candidates = commonPeer.getCandidates();
                                    return (commonPeer !== candidateSquare && candidates &&
                                        candidates.indexOf(secondIntersection[0]) !== -1);
                                });
                                commonPeers.forEach(commonPeer => {
                                    let move = new SudokuStateChange(commonPeer.getIndex(), secondIntersection,
                                        candidateSquare.getName() + ' points to wings ' + wings[0].getName() + '/' +
                                        wings[1].getName() + ', so removed ' + secondIntersection[0] +
                                        ' from candidates of ' + commonPeer.getName());
                                    moves.push(move);
                                });
                            };
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