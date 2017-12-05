import {DLX} from "../../../lib/backtracker/DLX";

describe('A newly created DLX' , () => {
    it('should have a representation', () => {
        let dlx = new DLX(
            ['A', 'B', 'C'],
            [[false, true, false],
            [true, false, false],
            [true, false, true]]);
        console.log('hello');
        expect(true).toBe(true);
    });
})