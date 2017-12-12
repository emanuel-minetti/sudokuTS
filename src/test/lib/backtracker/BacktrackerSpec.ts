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
    it('should report correct column names', () => {
        expect(backtracker.columnNames[5]).toEqual("Some number in square A6");
        expect(backtracker.columnNames[80]).toEqual("Some number in square J9");
        expect(backtracker.columnNames[81]).toEqual("1 must be present in column 1");
        expect(backtracker.columnNames[82]).toEqual("1 must be present in column 2");
        expect(backtracker.columnNames[90]).toEqual("1 must be present in row A");
        expect(backtracker.columnNames[99]).toEqual("1 must be present in box I");
        expect(backtracker.columnNames[107]).toEqual("1 must be present in box IX");
        expect(backtracker.columnNames[108]).toEqual("2 must be present in column 1");
        expect(backtracker.columnNames[323]).toEqual("9 must be present in box IX");
    });

    //TODO add more tests
    it('should report correct rows', () => {
        expect(backtracker.rows.length).toBe(729);
        expect(backtracker.rows[0].length).toBe(324);
    });
});