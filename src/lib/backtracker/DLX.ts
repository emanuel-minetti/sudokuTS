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

    //TODO implement!
    private addNewRow(row: boolean[], rowIndex: number) {

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