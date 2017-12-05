import {DoublyLinkedList} from "./DoublyLinkedList";


export class DLX {
    representation: Representation;

    constructor( names: string[], rows: boolean[][]) {
        this.representation = new Representation(names, rows);
    }
}

class Representation {
    root: DataObject;
    numberOfColumns: number;
    numberOfRows: number;

    columns: ColumnObject[];

    constructor( names: string[], rows: boolean[][]) {
        //TODO validate input?
        this.numberOfColumns = names.length;
        this.numberOfRows = rows.length;
        this.root = new DataObject();

        //create columns
        this.columns = names.map((name, index) => new ColumnObject(name, index));

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

    public cover(column: ColumnObject) {
        column.right.left = column.left;
        column.left.right = column.right;
        let currentRow = column.down;
        while (currentRow != column) {
            let currentColumn = currentRow.right;
            while (currentColumn.column != column) {
                currentColumn.down.up = currentColumn.up;
                currentColumn.up.down = currentColumn.down;
                currentColumn.column.size--;
            }
        }
    }

    private addNewRow(row: boolean[], rowIndex: number) {
        let rowList = new DoublyLinkedList<DataObject>();
        row.forEach((filled, columnIndex) => {
            rowList.clear();
            if (filled) {
                let newDataObject = new DataObject();
                newDataObject.rowIndex = rowIndex;
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