var PackProbability = (function () {
    function PackProbability() {
        this.probabilites = new Array();
        this.sumOfAllChances = 0;
    }
    PackProbability.prototype.makeSureSumOfAllChancesExists = function () {
        if (this.sumOfAllChances != 0) {
            return;
        }
        this.sumOfAllChances =
            this
                .probabilites
                .map(function (prob) { return prob.chance; })
                .reduce(function (prev, curr) { return prev + curr; }, 0);
    };
    PackProbability.prototype.addProbability = function (rarity, golden, chance) {
        this.probabilites.push({
            rarity: rarity,
            golden: golden,
            chance: chance
        });
        this.sumOfAllChances = 0;
    };
    PackProbability.prototype.drawCard = function () {
        this.makeSureSumOfAllChancesExists();
        var rnd = Math.random() * this.sumOfAllChances;
        for (var count1 = 0; count1 < this.probabilites.length; count1++) {
            var prob = this.probabilites[count1];
            rnd -= prob.chance;
            if (rnd <= 0) {
                return prob;
            }
        }
    };
    return PackProbability;
})();
exports.PackProbability = PackProbability;
var PackOpener = (function () {
    function PackOpener(collection, probability) {
        var _this = this;
        this.collection = collection;
        this.probability = probability;
        this.setsByRarity = {};
        this.cardsPerPack = 5;
        collection.slots.forEach(function (slot) {
            _this.setsByRarity[slot.rarity] = _this.setsByRarity[slot.rarity] || [];
            _this.setsByRarity[slot.rarity].push(slot);
        });
    }
    PackOpener.prototype.openPack = function () {
        var cardsToDraw = this.cardsPerPack;
        while (cardsToDraw--) {
            this.drawCard();
        }
    };
    PackOpener.prototype.drawCard = function () {
        var card = this.probability.drawCard();
        var correspondingSet = this.setsByRarity[card.rarity];
        var slot = this.chooseRandomSlot(correspondingSet);
        if (card.golden) {
            slot.goldenCount += 1;
        }
        else {
            slot.normalCount += 1;
        }
    };
    PackOpener.prototype.chooseRandomSlot = function (slotSet) {
        var rnd = Math.random();
        var slotNumber = Math.floor(rnd * slotSet.length);
        return slotSet[slotNumber];
    };
    return PackOpener;
})();
exports.PackOpener = PackOpener;
//# sourceMappingURL=Drawer.js.map