/// <reference path="../typings/tsd.d.ts" />

import cltn = require("../collection");
import crft = require("../crafting");

function get2x2Collection() {
    var collection = new cltn.Collection();
    collection.addSlots(2, cltn.Rarity.common, 2);
    collection.addSlots(2, cltn.Rarity.rare, 2);
    return collection;
}

function get2x2Costs() {
    var costs: crft.CraftingCost = {};
    costs[cltn.Rarity.common] = {
        0: 1,
        1: 100
    };
    costs[cltn.Rarity.rare] = {
        0: 10,
        1: 1000
    };
    return costs;
}


describe("A crafter module", function () {

    describe("Crafter class", function () {

        function getCollection() {
            var rarity = cltn.Rarity.rare;
            var collection = new cltn.Collection();
            collection.addSlots(1, rarity, 2);
            var slot = collection.slots[1];
            slot.goldenCount = 1;
            slot.normalCount = 3;

            return collection;
        }

        function getCosts() {
            var costs: crft.CraftingCost = {};

            costs[cltn.Rarity.rare] = {
                0: 1,
                1: 100
            };

            return costs;
        }

        it("can disenchant extra cards for dust", function () {

            var collection = getCollection();
            var costs = getCosts();
            var slot = collection.slots[1];

            var crafter = new crft.Crafter(
                collection,
                costs,
                null);

            crafter.disenchantExtra();

            expect(crafter.dustCount).toBe(101);
            expect(slot.hasOverMax()).toBe(false);
            expect(slot.goldenCount).toBe(0);
            expect(slot.normalCount).toBe(2); 

        });

        it("can keep golden cards during disenchant", function () {

            var collection = getCollection();
            var costs = getCosts();
            var slot = collection.slots[1];

            var crafter = new crft.Crafter(
                collection,
                costs,
                null,
                true);

            crafter.disenchantExtra();

            expect(crafter.dustCount).toBe(2);
            expect(slot.hasOverMax()).toBe(false);
            expect(slot.goldenCount).toBe(1);
            expect(slot.normalCount).toBe(1); 
        });

        it("will disenchant all extra cards", function () {

            var collection = getCollection();
            var slot = collection.slots[1];
            slot.goldenCount = 3;
            slot.normalCount = 3;


            var costs = getCosts();

            var crafter = new crft.Crafter(
                collection,
                costs,
                null,
                true);

            crafter.disenchantExtra();

            expect(crafter.dustCount).toBe(103);
            expect(slot.hasOverMax()).toBe(false);
            expect(slot.goldenCount).toBe(2);
            expect(slot.normalCount).toBe(0); 
        });

        it("will do nothing when not enough dust", function () {

            var collection = get2x2Collection();
            var costs = get2x2Costs();

            var crafter = new crft.Crafter(
                collection,
                null,
                costs);
            crafter.dustCount = 5;

            crafter.craftMissingCards();
            var slot1 = collection.slots[1];
            var slot2 = collection.slots[2];
            var slot3 = collection.slots[3];
            var slot4 = collection.slots[4];

            expect(crafter.dustCount).toBe(5);
            expect(slot1.getTotal()).toBe(0);
            expect(slot2.getTotal()).toBe(0);
            expect(slot3.getTotal()).toBe(0);
            expect(slot4.getTotal()).toBe(0);


        });

        it("will craft missing cards", function () {

            var collection = get2x2Collection();
            var costs = get2x2Costs();

            var crafter = new crft.Crafter(
                collection,
                null,
                costs);

            crafter.dustCount = 41;

            crafter.craftMissingCards();
            var slot1 = collection.slots[1];
            var slot2 = collection.slots[2];
            var slot3 = collection.slots[3];
            var slot4 = collection.slots[4];

            expect(crafter.dustCount).toBe(0);
            expect(slot1.getTotal()).toBe(0);
            expect(slot2.getTotal()).toBe(1);
            expect(slot2.normalCount).toBe(1);
            expect(slot3.hasAtLeastMax()).toBe(true);
            expect(slot3.hasAtLeastMax()).toBe(true);
            expect(slot3.normalCount).toBe(2);
            expect(slot4.hasAtLeastMax()).toBe(true);
            expect(slot4.hasAtLeastMax()).toBe(true);
            expect(slot4.normalCount).toBe(2);
            
        });

        it("will craft missing gold cards", function () {

            var collection = get2x2Collection();
            var costs = get2x2Costs();

            var crafter = new crft.Crafter(
                collection,
                null,
                costs,
                true);
            crafter.dustCount = 1010;

            crafter.craftMissingCards();
            var slot1 = collection.slots[1];
            var slot2 = collection.slots[2];
            var slot3 = collection.slots[3];
            var slot4 = collection.slots[4];

            expect(crafter.dustCount).toBe(10);
            expect(slot1.getTotal()).toBe(0);
            expect(slot2.getTotal()).toBe(0);
            expect(slot3.getTotal()).toBe(0);
            expect(slot4.getTotal()).toBe(1);
            expect(slot4.goldenCount).toBe(1);
            expect(slot4.normalCount).toBe(0);

        });

        it("will stop when finished", function () {

            var collection = get2x2Collection();
            var costs = get2x2Costs();

            var crafter = new crft.Crafter(
                collection,
                null,
                costs);

            crafter.dustCount = 200;

            crafter.craftMissingCards();
            var slot1 = collection.slots[1];
            var slot2 = collection.slots[2];
            var slot3 = collection.slots[3];
            var slot4 = collection.slots[4];

            expect(crafter.dustCount).toBe(156);
            expect(slot1.hasAtLeastMax()).toBe(true);
            expect(slot1.normalCount).toBe(2);
            expect(slot2.hasAtLeastMax()).toBe(true);
            expect(slot2.normalCount).toBe(2);
            expect(slot3.hasAtLeastMax()).toBe(true);
            expect(slot3.normalCount).toBe(2);
            expect(slot4.hasAtLeastMax()).toBe(true);
            expect(slot4.normalCount).toBe(2);

        });

        it("can craft from bottom", function () {

            var collection = get2x2Collection();
            var costs = get2x2Costs();

            var crafter = new crft.Crafter(
                collection,
                null,
                costs,
                false,
                false);

            crafter.dustCount = 3;

            crafter.craftMissingCards();
            var slot1 = collection.slots[1];
            var slot2 = collection.slots[2];
            var slot3 = collection.slots[3];
            var slot4 = collection.slots[4];

            expect(crafter.dustCount).toBe(0);
            expect(slot1.hasAtLeastMax()).toBe(true);
            expect(slot1.normalCount).toBe(2);
            expect(slot2.getTotal()).toBe(1);
            expect(slot2.normalCount).toBe(1);
            expect(slot3.getTotal()).toBe(0);
            expect(slot4.getTotal()).toBe(0);
        });
    });

});