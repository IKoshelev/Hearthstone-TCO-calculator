/// <reference path="../typings/tsd.d.ts" />
var drw = require("../drawer");
var cltn = require("../collection");
describe("A drawer module ", function () {
    it("must have a PackProbability class", function () {
        var drawer = new drw.PackProbability();
        expect(drawer instanceof drw.PackProbability).toBe(true);
    });
    describe("PackProbability class ", function () {
        it("must obey probabilities given to it", function () {
            var packProb = new drw.PackProbability();
            packProb.addProbability(cltn.Rarity.common, false, 0.5);
            packProb.addProbability(cltn.Rarity.common, true, 0.25);
            packProb.addProbability(cltn.Rarity.rare, false, 0.25);
            var commons = 0, goldenCommons = 0, rares = 0;
            var iterations = 1000;
            while (iterations > 0) {
                var draw = packProb.drawCard();
                if (draw.rarity == cltn.Rarity.common) {
                    if (draw.golden == false) {
                        commons += 1;
                    }
                    else {
                        goldenCommons += 1;
                    }
                }
                else if (draw.rarity == cltn.Rarity.rare) {
                    rares += 1;
                }
                else {
                    throw new Error("Unknown card encountered");
                }
                iterations -= 1;
            }
            expect(400 < commons && commons < 600).toBe(true);
            expect(200 < goldenCommons && goldenCommons < 300).toBe(true);
            expect(200 < rares && rares < 300).toBe(true);
        });
    });
    it("must have a PackOpener class", function () {
        var drawer = new drw.PackOpener(new cltn.Collection(), new drw.PackProbability());
        expect(drawer instanceof drw.PackOpener).toBe(true);
    });
    describe("PackOpener class ", function () {
        it("can open a pack", function () {
            var rarity = cltn.Rarity.rare;
            var collection = new cltn.Collection();
            collection.addSlots(1, rarity, 2);
            var probability = new drw.PackProbability();
            probability.addProbability(rarity, false, 123);
            probability.addProbability(rarity, true, 123);
            var opener = new drw.PackOpener(collection, probability);
            opener.cardsPerPack = 1000;
            opener.openPack();
            opener.openPack();
            var singleSlot = collection.slots[1];
            expect(singleSlot.getTotal()).toBe(2000);
            expect(900 < singleSlot.normalCount && singleSlot.normalCount < 1100)
                .toBe(true);
            expect(900 < singleSlot.goldenCount && singleSlot.goldenCount < 1100)
                .toBe(true);
        });
    });
});
//# sourceMappingURL=drawer.spec.js.map