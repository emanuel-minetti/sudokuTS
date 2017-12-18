/**
 * The "data object" of the Knuth paper.
 * @see DLX
 */
export class DataObject {
    left: DataObject;
    right: DataObject;
    up: DataObject;
    down: DataObject;
    column: ColumnObject;
    rowIndex: number;

    constructor() {
        this.left = this;
        this.right = this;
        this.up = this;
        this.down = this;
        this.rowIndex = 0;
    }
}

/**
 * The "column object" of the Knuth paper.
 * @see DLX
 */
export class ColumnObject extends DataObject {
    size: number;
    name: string;
    columnIndex: number;

    constructor(name: string, index: number) {
        super();
        this.size = 0;
        this.name = name;
        this.columnIndex = index;
        this.column = this;
    }
}

/**
 * Must be implemented by a column choosing strategy.
 */
export type TChooseColumnFn = (root: DataObject) => ColumnObject;

export class ColumnChooser {
    /**
     * An implementation of the shortest column choosing strategy.
     *
     * @type {(root) => ColumnObject}
     */
    public static chooseColumnSmallest: TChooseColumnFn = (root => {
        let smallestColumn = root.right.column;
        let smallestSize = smallestColumn.size;
        let currentColumn = root.right.column;
        while (currentColumn.right != root) {
            if (currentColumn.size < smallestSize) {
                smallestColumn = currentColumn;
                smallestSize = currentColumn.size;
            }
            currentColumn = currentColumn.right.column;
        }
        return smallestColumn;
    });

    /**
     * An implementation of the simple column choosing strategy.
     *
     * @type {(root) => ColumnObject}
     */
    public static chooseColumnRight: TChooseColumnFn = (root => {
        return root.right.column;
    });
}

//TODO adjust documentation
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
    processResult: (
        //root: DataObject,
        solution: DataObject[]) => void;

    getCount: () => number;

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
    private resultString: string = '';
    private count: number = 0;

    processResult = (solution: DataObject[]) => {
        this.count++;
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
        this.resultString += resultStringArray.join('\n') + '\n\n';
    }

    getResult = () => this.resultString;

    getCount= () => this.count;
}
