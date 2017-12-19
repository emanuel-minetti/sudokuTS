import {SudokuGame} from "../../../lib/game/SudokuGame";
import {Backtracker} from "../../../lib/backtracker/Backtracker";

describe('A newly created empty Backtracker', () => {
    let game = new SudokuGame(`
    *** *** ***
    *** *** ***
    *** *** ***
    
    *** *** ***
    *** *** ***
    *** *** ***
    
    *** *** ***
    *** *** ***
    *** *** ***
    `);
    let backtracker = new Backtracker(game);

    it('should report correct column names for "a number in square"', () => {
        expect(backtracker.columnNames[5]).toEqual("Some number in square A6");
        expect(backtracker.columnNames[47]).toEqual("Some number in square F3");
        expect(backtracker.columnNames[80]).toEqual("Some number in square J9");
    });

    it('should report correct column names for "present in column"', () => {
        expect(backtracker.columnNames[81]).toEqual("1 must be present in column 1");
        expect(backtracker.columnNames[82]).toEqual("1 must be present in column 2");
        expect(backtracker.columnNames[191]).toEqual("5 must be present in column 3");
        expect(backtracker.columnNames[108]).toEqual("2 must be present in column 1");
    });

    it('should report correct column names for "present in row"', () => {
        expect(backtracker.columnNames[90]).toEqual("1 must be present in row A");
        expect(backtracker.columnNames[203]).toEqual("5 must be present in row F");
    });

    it('should report correct column names for "present in box"', () => {
        expect(backtracker.columnNames[99]).toEqual("1 must be present in box I");
        expect(backtracker.columnNames[210]).toEqual("5 must be present in box IV");
        expect(backtracker.columnNames[107]).toEqual("1 must be present in box IX");
        expect(backtracker.columnNames[323]).toEqual("9 must be present in box IX");
    });

    it('should report correct row length', () => {
        expect(backtracker.rows.length).toBe(729);
        expect(backtracker.rows[0].length).toBe(324);
    });

    it('should report correct row for "1 in A1"', () => {
        let oneInA1 = backtracker.columnNames.map(columnName => false);
        oneInA1[0] = true;
        oneInA1[81] = true;
        oneInA1[90] = true;
        oneInA1[99] = true;
        expect(backtracker.rows[0]).toEqual(oneInA1);
    });

    it('should report correct row for "5 in F3"', () => {
        let fiveInF5 = backtracker.columnNames.map(columnName => false);
        fiveInF5[47] = true;
        fiveInF5[191] = true;
        fiveInF5[203] = true;
        fiveInF5[210] = true;
        expect(backtracker.rows[371]).toEqual(fiveInF5);
    });
});

describe('A newly created Backtracker', () => {
    it('should report correct row for "6 in F3"', () => {
        let game = new SudokuGame(`
    *** *** ***
    *** *** ***
    *** *** ***
    
    *** *** ***
    *** *** ***
    **5 *** ***
    
    *** *** ***
    *** *** ***
    *** *** ***
    `);
        let backtracker = new Backtracker(game);
        let sixInF3 = backtracker.columnNames.map(columnName => false);
        expect(backtracker.rows[452]).toEqual(sixInF3);
    });

    it('should be able to solve an easy puzzle', () => {
        let game = new SudokuGame(`
    9** *** *6*
    **2 89* ***
    1** **5 2**

    **1 **7 *96
    *** 1*9 ***
    35* 4** 8**

    **3 9** **2
    *** *42 5**
    *6* *** **7
    `);
        let backtracker = new Backtracker(game);
        backtracker.solve();
        expect(game.isSolved()).toBe(true);
    });

    it('should be able to solve a diabolical puzzle', () => {
        let game = new SudokuGame(`
    *** 7*4 **5
    *2* *1* *7*
    *** *8* **2

    *9* **6 25*
    6** *7* **8
    *53 2** *1*

    4** *9* ***
    *3* *6* *9*
    2** 4*7 ***
    `);
        let backtracker = new Backtracker(game);
        backtracker.solve();
        expect(game.isSolved()).toBe(true);
    });

    it('should be able to find all solutions to a puzzle candidate', () => {
        let game = new SudokuGame(`
    *** 7*4 **5
    *2* *1* *7*
    *** *8* **2
    
    *9* **6 25*
    6** *7* **8
    *53 2** *1*

    4** *9* ***
    *3* *6* *9*
    *** 4*7 ***
    `);
        let backtracker = new Backtracker(game);
        backtracker.solve(true);
        expect(backtracker.solvedGames.length).toBe(18);
    });
});