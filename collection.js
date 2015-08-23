(function (Rarity) {
    Rarity[Rarity["common"] = 0] = "common";
    Rarity[Rarity["rare"] = 1] = "rare";
    Rarity[Rarity["epic"] = 2] = "epic";
    Rarity[Rarity["legendary"] = 3] = "legendary";
})(exports.Rarity || (exports.Rarity = {}));
var Rarity = exports.Rarity;
var Slot = (function () {
    function Slot() {
        this.normalCount = 0;
        this.goldenCount = 0;
    }
    Slot.prototype.getTotal = function () {
        return this.normalCount + this.goldenCount;
    };
    Slot.prototype.hasAtLeastMax = function () {
        return this.getTotal() >= this.maxInDeck;
    };
    Slot.prototype.hasAtLeastMaxGolden = function () {
        return this.goldenCount >= this.maxInDeck;
    };
    Slot.prototype.hasOverMax = function () {
        return this.getTotal() > this.maxInDeck;
    };
    return Slot;
})();
exports.Slot = Slot;
var Collection = (function () {
    function Collection() {
        this.slots = new Array();
        this.currentSlotId = 1;
    }
    Collection.prototype.addSlots = function (amount, rarity, maxInDec) {
        while (amount > 0) {
            var slot = new Slot();
            slot.rarity = rarity;
            slot.maxInDeck = maxInDec;
            slot.id = this.currentSlotId;
            this.slots[this.currentSlotId] = slot;
            this.currentSlotId += 1;
            amount -= 1;
        }
    };
    Collection.prototype.isComplete = function () {
        return this.slots.every(function (x) { return x.hasAtLeastMax(); });
    };
    Collection.prototype.isCompleteGolden = function () {
        return this.slots.every(function (x) { return x.hasAtLeastMaxGolden(); });
    };
    return Collection;
})();
exports.Collection = Collection;
