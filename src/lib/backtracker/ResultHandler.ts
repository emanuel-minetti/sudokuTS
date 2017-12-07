import {DataObject} from "./DLX";

/**
 * Must be implemented by any result handler given to {@link DLX}.
 */
export interface IResultHandler {

    /**
     * Implements the "print" function of the Knuth's paper.
     *
     * To be called by {@link DLX}
     *
     * @param {DataObject} root the root of {@link DLX}
     * @param {DataObject[]} solution the solution of the {@link DLX} given to.
     */
    processResult: (root: DataObject, solution: DataObject[]) => void;

    /**
     * Returns the result in an expected manner.
     *
     * @returns {any} the expected form of the solution.
     */
    getResult: () => any;
}

/**
 * The result handler as in Knuth's paper.
 */
export class SimpleResultHandler implements IResultHandler {
    private resultString: string;

    processResult = (root: DataObject, solution: DataObject[]) => {
        let resultStringArray: string[] = [];
        solution.forEach((row) => {
            let resultRow: string[] = [];
            let node = row;
            do {
                resultRow.push(node.column.name);
                node = node.right;
            } while (node != row)
            resultStringArray.push(resultRow.join(' '));
        })
        this.resultString = resultStringArray.join('\n');
    }

    getResult = () => this.resultString;
}
