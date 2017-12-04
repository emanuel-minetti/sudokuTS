import {DoublyLinkedList} from "./DoublyLinkedList";


export class DLC {
    
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
            column.header.right = this.root;
            column.header.left = this.root.left;
            this.root.left.right = column.header;
            this.root.left = column.header;
        });

        //add rows
        rows.forEach((row, rowIndex) => {
            this.addNewRow(row, rowIndex);
        });
    }

    private addNewRow(row: boolean[], rowIndex: number) {
        let rowList = new DoublyLinkedList<DataObject>();
        row.forEach((filled, columnIndex) => {
            rowList.clear();
            if (filled) {
                let newDataObject = new DataObject();
                newDataObject.up = this.columns[columnIndex].header.up;
                newDataObject.down = this.columns[columnIndex].header;
                newDataObject.column = this.columns[columnIndex].header;
                this.columns[columnIndex].header.up.down = newDataObject;
                this.columns[columnIndex].header.up = newDataObject;
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
    column: DataObject;
    rowIndex: number;

    constructor() {
        this.left = this;
        this.right = this;
        this.up = this;
        this.down = this;
        this.column = this;
        this.rowIndex = 0;
    }
}

class ColumnObject {
    header: DataObject;
    size: number;
    name: string;
    index: number;


    constructor(name: string, index: number) {
        this.header = new DataObject();
        this.size = 0;
        this.name = name;
        this.index = index;
    }
}