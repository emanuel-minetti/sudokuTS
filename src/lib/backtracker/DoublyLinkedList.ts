export class DoublyLinkedList<T>  {
    private head: Node<T> | null;
    private tail: Node<T> | null;
    private length: number;
    private isCircular: boolean;

    constructor(isCircular = false) {
        this.isCircular = isCircular;
        this.head = null;
        this.tail = null;
        this.length = 0;
    }

    isEmpty(): boolean {
        return this.length === 0;
    }

    toArray(): T[] {
        var array: T[] = [];
        var currentHead: Node<T> | null = this.head;
        if (currentHead !== null) {
            do {
                array.push(currentHead.data);
                currentHead = currentHead.next;
            }
            while (currentHead.hasNext())
        }
        return array;
    }

    push(data: T): void {
        const newNode = new Node(data);
        if (this.isEmpty()) {
            this.head = newNode;
            this.tail = newNode;
            this.length++;
        }
        else {
            //TODO test `isCircular`
            this.tail!.next = newNode;
            newNode.prev = this.tail!;
            this.tail = newNode;
            this.length++;
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