import {DoublyLinkedList} from "./DoublyLinkedList";

export class DLX {
    root: DataObject;
    numberOfColumns: number;
    numberOfRows: number;
    useSHeuristic: boolean;

    columns: ColumnObject[];

    constructor( names: string[], rows: boolean[][], useSHeuristic = false) {
        //TODO validate input?
        this.numberOfColumns = names.length;
        this.numberOfRows = rows.length;
        this.useSHeuristic = useSHeuristic;
        this.root = new DataObject();

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

    private addNewRow(row: boolean[], rowIndex: number) {
        let rowList = new DoublyLinkedList<DataObject>();
        row.forEach((filled, columnIndex) => {
            if (filled) {
                let newDataObject = new DataObject();
                newDataObject.rowIndex = rowIndex + 1;
                newDataObject.up = this.columns[columnIndex].up;
                newDataObject.down = this.columns[columnIndex];
                newDataObject.column = this.columns[columnIndex];
                this.columns[columnIndex].up.down = newDataObject;
                this.columns[columnIndex].up = newDataObject;
                this.columns[columnIndex].size++;
                rowList.push(newDataObject);
            }
        });

        if (!rowList.isEmpty()) {
            let rowIterator = rowList[Symbol.iterator]();
            let firstInRow = rowIterator.next().value;
            while (rowIterator.hasNext()) {
                let thisDataObject = rowIterator.next().value;
                thisDataObject.left = firstInRow.left;
                thisDataObject.right = firstInRow;
                firstInRow.left.right = thisDataObject;
                firstInRow.left = thisDataObject;
            }
        }

    }

    public print(solution: DoublyLinkedList<DataObject>): string {
        let resultString: string[] = [];
        solution.toArray().forEach((row) => {
            let resultRow: string[] = [];
            let node = row;
            do {
                resultRow.push(node.column.name);
                node = node.right;
            } while (node != row)
            resultString.push(resultRow.join(' '));
        })
        return resultString.join('\n');
    }

    public chooseColumn(): ColumnObject {
        if (!this.useSHeuristic) {
            return this.root.right.column;
        } else {
            let smallestSize = Number.MAX_VALUE;
            let smallestColumn = this.root.right.column;
            let currentColumn = this.root.right.column;
            do {
                if (currentColumn.size < smallestSize) {
                    smallestColumn = currentColumn;
                    smallestSize = currentColumn.size;
                }
                currentColumn = currentColumn.right.column;
            } while (currentColumn.right != this.root)
            return smallestColumn;
        }

    }

    public cover(column: ColumnObject) {
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

    public uncover(column: ColumnObject) {
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

class DataObject {
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