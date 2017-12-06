import {DLX} from "../../../lib/backtracker/DLX";

//TODO Implement real tests
describe('A newly created DLX' , () => {
    it('should have a representation', () => {
        let dlx = new DLX(
            ['A', 'B', 'C'],
            [[false, true, false],
            [true, false, false],
            [true, false, true]]);
        expect(true).toBe(true);
    });
})