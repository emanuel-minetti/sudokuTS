import {DoublyLinkedList} from "../../../lib/backtracker/DoublyLinkedList";

describe('A newly created Doubly Linked List' , () => {
    it('should report to be empty',  () => {
        var intList = new DoublyLinkedList<number>();
        var stringList = new DoublyLinkedList<string>();
        expect(intList.isEmpty()).toBe(true);
        expect(stringList.isEmpty()).toBe(true);
    });

    var intList = new DoublyLinkedList<number>();
    var stringList = new DoublyLinkedList<string>();

    it('should return an empty array',  () => {
        expect(intList.toArray()).toEqual([]);
        expect(stringList.toArray()).toEqual([]);
    });

    it('should be able to push a value and return it as an array',  () => {
        intList.push(1);
        stringList.push('A')
        expect(intList.toArray()).toEqual([1]);
        expect(stringList.toArray()).toEqual(['A']);
    });

    it('should be able to push a second value and return an correct array',  () => {
        intList.push(2);
        stringList.push('b')
        expect(intList.toArray()).toEqual([1, 2]);
        expect(stringList.toArray()).toEqual(['A', 'b']);
    });

});