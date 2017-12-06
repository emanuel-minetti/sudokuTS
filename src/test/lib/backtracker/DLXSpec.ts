import {DLX} from "../../../lib/backtracker/DLX";
import {SimpleResultHandler} from "../../../lib/backtracker/ResultHandler";

//TODO Implement real tests
describe('A newly created DLX' , () => {
    it('should have a representation', () => {
        let dlx = new DLX(
            ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
            [
                [false, false, true, false, true, true, false],
                [true, false, false, true, false, false, true],
                [false, true, true, false, false, true, false],
                [true, false, false, true, false, false, false],
                [false, true, false, false, false, false, true],
                [false, false, false, true, true, false, true]
            ],
            DLX.chooseColumnRight,
            new SimpleResultHandler()
        );
        expect(true).toBe(true);
    });
})