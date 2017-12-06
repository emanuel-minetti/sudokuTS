import {IResultHandler} from "./ResultHandler";

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

class ColumnObject extends DataObject{
    size: number;
    name: string;
    index: number;

    constructor(name: string, index: number) {
        super();
        this.size = 0;
        this.name = name;
        this.index = index;
        this.column = this;
    }
}

type TChooseColumnFn = (root: DataObject) => ColumnObject;

//TODO document
export class DLX {

    // Static Methods

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

    public static chooseColumnRight: TChooseColumnFn = (root => {
        return root.right.column;
    });

    // Public Methods

    constructor( names: string[],
                 rows: boolean[][],
                 chooseColumnFn: TChooseColumnFn,
                 resultHandler: IResultHandler) {
        //TODO validate input
        //initialize attributes
        this.numberOfColumns = names.length;
        this.numberOfRows = rows.length;
        this.root = new DataObject();
        this.currentSolution = [];
        this.chooseColumn = chooseColumnFn;
        this.resultHandler = resultHandler;

        //create columns
        this.columns = names.map((name, index) => new ColumnObject(name, index + 1));

        //doubly link columns
        this.columns.forEach(column => {
            column.right = this.root;
            column.left = this.root.left;
            this.root.left.right = column;
            this.root.left = column;
        });

        //add rows
        rows.forEach((row, rowIndex) => {
            this.addNewRow(row, rowIndex);
        });
    }

    public solve() {
        this.search(0);
    }

    // Private Attributes

    private chooseColumn: TChooseColumnFn;
    private resultHandler: IResultHandler;
    private numberOfColumns: number;
    private numberOfRows: number;
    private root: DataObject;
    private currentSolution: DataObject[];
    private columns: ColumnObject[];

    // Private Methods

    private addNewRow(row: boolean[], rowIndex: number) {
        let rowDataArray: DataObject[] = [];
        //for each row
        row.forEach((filled, columnIndex) => {
            //create a data object for each entry, ...
            if (filled) {
                let newDataObject = new DataObject();
                newDataObject.rowIndex = rowIndex + 1;
                //... link it to its column ...
                newDataObject.up = this.columns[columnIndex].up;
                newDataObject.down = this.columns[columnIndex];
                newDataObject.column = this.columns[columnIndex];
                this.columns[columnIndex].up.down = newDataObject;
                this.columns[columnIndex].up = newDataObject;
                this.columns[columnIndex].size++;
                //... and store it
                rowDataArray.push(newDataObject);
            }
        });

        if (rowDataArray.length !== 0) {
            //for each stored row
            let firstInRow = rowDataArray[0];
            //for each data object in it
            rowDataArray.forEach(node => {
                if (node !== firstInRow) {
                    //link it in its row
                    node.left = firstInRow.left;
                    node.right = firstInRow;
                    firstInRow.left.right = node;
                    firstInRow.left = node;
                }
            });
        }
    }

    private search(depth: number) {
        if (this.root.right == this.root) {
            this.resultHandler.processResult(this.root, this.currentSolution);
            return;
        }
        else {
            let columnToCover = this.chooseColumn(this.root);
            this.cover(columnToCover);
            let rowToSearch = columnToCover.down;
            while (rowToSearch != columnToCover) {
                this.currentSolution[depth] = rowToSearch;
                let innerColumnToCover = rowToSearch.right;
                while (innerColumnToCover != rowToSearch) {
                    this.cover(innerColumnToCover.column);
                    innerColumnToCover = innerColumnToCover.right;
                }
                this.search(depth + 1);
                rowToSearch = this.currentSolution[depth];
                columnToCover = rowToSearch.column;
                innerColumnToCover = rowToSearch.left;
                while (innerColumnToCover != rowToSearch) {
                    this.uncover(innerColumnToCover.column);
                    innerColumnToCover = innerColumnToCover.left;
                }
                rowToSearch = rowToSearch.down;
            }
            this.uncover(columnToCover);
            return;
        }
    }

    private cover(column: ColumnObject) {
        column.right.left = column.left;
        column.left.right = column.right;
        let currentRow = column.down;
        while (currentRow != column) {
            let currentColumn = currentRow.right;
            while (currentColumn != currentRow) {
                currentColumn.down.up = currentColumn.up;
                currentColumn.up.down = currentColumn.down;
                currentColumn.column.size--;
                currentColumn = currentColumn.right;
            }
            currentRow = currentRow.down;
        }
    }

    private uncover(column: ColumnObject) {
        let currentRow = column.up;
        while (currentRow != column) {
            let currentColumn = currentRow.left;
            while (currentColumn != currentRow) {
                currentColumn.column.size++;
                currentColumn.down.up = currentColumn;
                currentColumn.up.down = currentColumn;
                currentColumn = currentColumn.left;
            }
            currentRow = currentRow.up;
        }
        column.right.left = column;
        column.left.right = column;
    }
}
