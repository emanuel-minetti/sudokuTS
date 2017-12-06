import {DataObject} from "./DLX";

export interface IResultHandler {
    processResult: (root: DataObject, solution: DataObject[]) => void;
    getResult: () => any;
}

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
