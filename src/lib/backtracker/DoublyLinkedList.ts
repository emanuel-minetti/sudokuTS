export class DoublyLinkedList<T>  implements Iterable<T> {
    get length(): number {
        return this._length;
    }
    private head: Node<T> | null;
    private tail: Node<T> | null;
    private _length: number;

    constructor() {
        this.head = null;
        this.tail = null;
        this._length = 0;
    }

    /**
     * Returns whether the List is empty.
     *
     * @returns {boolean} true if empty
     */
    isEmpty = () => this._length === 0;

    getLength = () => this._length;

    clear = () => {
        this.head = null;
        this.tail = null;
        this._length = 0;
    }

    //TODO test!
    [Symbol.iterator]() {
        let current = this.head;
        return {
            next: function() {
                if (current !== null) {
                    let value = current.data;
                    let hasNext = current.hasNext();
                    let isNull = current === null;
                    current = current.next;
                    return {
                        value: value,
                        done: hasNext
                    }
                }
                else {
                    return {done: true};
                }
            }.bind(this),
            hasNext: function () {
                if (current !== null) {
                    return current.hasNext();
                }
                return false;
            }.bind(this)
        }
    }

    toArray = (): T[] => {
        var array: T[] = [];
        var currentHead = this.head;
        if (currentHead !== null) {
            array.push(currentHead.data);
            while (currentHead!.hasNext()) {
                array.push(currentHead!.next!.data)
                currentHead = currentHead!.next;
            }
        }
        return array;
    }

    push = (data: T) => {
        const newNode = new Node(data);

        if (this.isEmpty()) {
            this.head = newNode;
            this.tail = newNode;
            this._length++;
        }
        else {
            //TODO test `isCircular`
            this.tail!.next = newNode;
            newNode.prev = this.tail!;
            this.tail = newNode;
            this._length++;
        }
    }
}

class Node<T> {
    data: T;
    prev: Node<T>;
    next: Node<T>;

    constructor(data: T) {
        this.data = data;
        this.next = this;
        this.prev = this;
    }

    hasNext(): boolean {
        return this.next !== this;
    }
}