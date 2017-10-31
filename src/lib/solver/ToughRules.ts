import * as _ from "lodash";

import {SudokuStateChange} from "../game/SudokuStateChange";
import {SolverRule, TRuleFunction} from "./SolverRule";
import {RulesHelper} from "./RulesHelper";
import {Sudoku} from "../game/Sudoku";
import {Square} from "../game/Square";

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
        let candidateValues = candidateSquares.reduce((prev, curr) => _.union(prev, curr.getCandidates()), []);
        //get all triplets of these values
        let valueTriplets = RulesHelper.getTuplesOfValues(candidateValues, 3);
        if (candidateSquares.length >= 3) {
            //for each triplet and candidate square
            valueTriplets.forEach(valueTriplet => {
                candidateSquares.forEach(candidateSquare => {
                    let candidatesOfCandidateSquare = candidateSquare.getCandidates();
                    let firstIntersection = _.intersection(candidatesOfCandidateSquare, valueTriplet);
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
                                        let commonPeerCandidates = commonPeer.getCandidates();
                                        return (commonPeer !== candidateSquare && commonPeerCandidates &&
                                            commonPeerCandidates.indexOf(secondIntersection[0]) !== -1);
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
                                }
                            });
                        }
                    }
                });
            });
        }
        return moves;
    }

    //TODO comment and document!
    private static _xwRuleFn: TRuleFunction = (sudoku) => {
        let moves: SudokuStateChange[] = [];
        let definingUnits = sudoku.getRows();
        let eliminationUnits = sudoku.getColumns();
        let definingUnitCandidates: Square[][];
        let values = Sudoku.values;
        values.forEach(value => {
            definingUnits.forEach((firstDefiningUnit, firstUnitIndex) => {
                let firstContainingSquares = firstDefiningUnit.filter(square => {
                    let squareCandidates = square.getCandidates();
                    return (squareCandidates && squareCandidates.indexOf(value) !== -1)
                });
                if (firstContainingSquares.length === 2) {
                    definingUnits.forEach((secondDefiningUnit, secondUnitIndex) => {
                        if (secondUnitIndex > firstUnitIndex) {
                            let secondContainingSquares = secondDefiningUnit.filter(square => {
                                let squareCandidates = square.getCandidates();
                                return (squareCandidates && squareCandidates.indexOf(value) !== -1)
                            });
                            if (secondContainingSquares.length === 2) {
                                //TODO review if statement
                                if (sudoku.getPeers(firstContainingSquares[0]).indexOf(secondContainingSquares[0])
                                    !== -1 &&
                                    sudoku.getPeers(firstContainingSquares[1]).indexOf(secondContainingSquares[1])
                                    !== -1) {
                                    //X-Wing found
                                    let unitsToEliminate = eliminationUnits.filter(squaresToEliminate => {
                                        return (squaresToEliminate.indexOf(firstContainingSquares[0]) !== -1 ||
                                        squaresToEliminate.indexOf(firstContainingSquares[1]) !== -1)
                                    });
                                    unitsToEliminate.forEach(unitToEliminate => {
                                        unitToEliminate.forEach(squareToRemoveValue => {
                                            if (firstContainingSquares.indexOf(squareToRemoveValue) === -1 &&
                                                secondContainingSquares.indexOf(squareToRemoveValue) === -1) {
                                                let squareToRemoveValeCandidates = squareToRemoveValue.getCandidates();
                                                if (squareToRemoveValeCandidates &&
                                                    squareToRemoveValeCandidates.indexOf(value) !== -1) {
                                                    let move = new SudokuStateChange(squareToRemoveValue.getIndex(),
                                                        [value],
                                                        value + ' in ' + firstContainingSquares[0].getName() + '/' +
                                                        firstContainingSquares[1].getName() + ' and ' +
                                                        secondContainingSquares[0].getName() + '/' +
                                                        secondContainingSquares[1].getName() +
                                                        ', so removed ' + value + ' from ' +
                                                        squareToRemoveValue.getName());
                                                    moves.push(move);
                                                }
                                            }
                                        });
                                    });
                                }
                            }
                        }
                    });
                }
            });
        });
        return moves;
    }

    rules: SolverRule[];

    constructor() {
        this.rules = [];

        let xwRule = new SolverRule('X-Wing Rule: ', 15, ToughRules._xwRuleFn);
        this.rules.push(xwRule);

        let ywRule = new SolverRule('Y-Wing Rule: ', 15, ToughRules._ywRuleFn);
        this.rules.push(ywRule);
    }
}