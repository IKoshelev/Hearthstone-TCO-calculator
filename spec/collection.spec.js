/// <reference path="../typings/tsd.d.ts" />
var cltn = require("../collection");
function getTypicalCollection() {
    var collection = new cltn.Collection();
    collection.addSlots(4, cltn.Rarity.common, 2);
    collection.addSlots(3, cltn.Rarity.rare, 2);
    collection.addSlots(2, cltn.Rarity.epic, 2);
    collection.addSlots(1, cltn.Rarity.legendary, 1);
    return collection;
}
describe("A collection module", function () {
    it("must have a Rarity enum", function () {
        expect(cltn.Rarity.common).toBeDefined();
        expect(cltn.Rarity.rare).toBeDefined();
        expect(cltn.Rarity.epic).toBeDefined();
        expect(cltn.Rarity.legendary).toBeDefined();
    });
    it("must have a Slot class", function () {
        var slot = new cltn.Slot();
        expect(slot instanceof cltn.Slot).toBe(true);
    });
    describe("Slots class", function () {
        it("must have state", function () {
            var slot = new cltn.Slot();
            slot.normalCount = 1;
            slot.goldenCount = 1;
            slot.maxInDeck = 1;
            expect(slot.normalCount).toBe(1);
            expect(slot.goldenCount).toBe(1);
            expect(slot.getTotal()).toBe(2);
            expect(slot.hasOverMax()).toBe(true);
        });
    });
    it("must have a Collection class", function () {
        var collection = new cltn.Collection();
        expect(collection instanceof cltn.Collection)
            .toBe(true);
    });
    describe("Collection class", function () {
        it("must have slots Array", function () {
            var collection = new cltn.Collection();
            expect(collection instanceof cltn.Collection)
                .toBe(true);
            expect(Array.isArray(collection.slots)).toBe(true);
        });
        it("must populate slots array starting with 1 " +
            "with consequiteve ids", function () {
            var collection = getTypicalCollection();
            expect(collection.slots.length)
                .toBe(11);
            expect(collection.slots[0])
                .toBeUndefined();
            var legendary = collection.slots[10];
            expect(legendary.id).toBe(10);
            expect(legendary.rarity).toBe(cltn.Rarity.legendary);
            expect(legendary.getTotal()).toBe(0);
            expect(legendary.maxInDeck).toBe(1);
        });
        it("must have methods to check completeness", function () {
            var collection = new cltn.Collection();
            collection.addSlots(1, cltn.Rarity.common, 2);
            collection.addSlots(2, cltn.Rarity.rare, 2);
            expect(collection.isComplete()).toBe(false);
            collection.slots.forEach(function (slot) {
                slot.normalCount = 1;
                slot.goldenCount = 1;
            });
            expect(collection.isComplete()).toBe(true);
            expect(collection.isCompleteGolden()).toBe(false);
            collection.slots.forEach(function (slot) {
                slot.normalCount = 0;
                slot.goldenCount = 2;
            });
            expect(collection.isComplete()).toBe(true);
            expect(collection.isCompleteGolden()).toBe(true);
        });
    });
});
