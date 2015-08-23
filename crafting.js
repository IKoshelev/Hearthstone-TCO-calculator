var Crafter = (function () {
    function Crafter(collection, disenchantCosts, createCosts, preferGolden, craftFromTop) {
        var _this = this;
        if (preferGolden === void 0) { preferGolden = false; }
        if (craftFromTop === void 0) { craftFromTop = true; }
        this.collection = collection;
        this.disenchantCosts = disenchantCosts;
        this.createCosts = createCosts;
        this.preferGolden = preferGolden;
        this.craftFromTop = craftFromTop;
        this.dustCount = 0;
        this.disenchantSlot = function (slot) {
            var costs = _this.getDisenchantCostsForSlot(slot);
            var costNormal = costs[0];
            var costGolden = costs[1];
            while (slot.hasOverMax()) {
                if (_this.preferGolden) {
                    _this.slotTryDisenchantNormal(slot, costNormal);
                    _this.slotTryDisenchantGolden(slot, costGolden);
                }
                else {
                    _this.slotTryDisenchantGolden(slot, costGolden);
                    _this.slotTryDisenchantNormal(slot, costNormal);
                }
            }
        };
    }
    Crafter.prototype.disenchantExtra = function () {
        this.collection.slots.forEach(this.disenchantSlot);
    };
    Crafter.prototype.getDisenchantCostsForSlot = function (slot) {
        return this.disenchantCosts[slot.rarity];
    };
    Crafter.prototype.getCreateCostsForSlot = function (slot) {
        return this.createCosts[slot.rarity];
    };
    Crafter.prototype.slotTryDisenchantNormal = function (slot, cost) {
        while (slot.hasOverMax() && slot.normalCount > 0) {
            slot.normalCount -= 1;
            this.dustCount += cost;
        }
    };
    Crafter.prototype.slotTryDisenchantGolden = function (slot, cost) {
        while (slot.hasOverMax() && slot.goldenCount > 0) {
            slot.goldenCount -= 1;
            this.dustCount += cost;
        }
    };
    Crafter.prototype.refreshCurrentSlotNumber = function () {
        if (!this.currentSlotIndex) {
            this.initSlotIndex();
        }
        var slots = this.collection.slots;
        while (slots[this.currentSlotIndex] &&
            slots[this.currentSlotIndex].hasAtLeastMax()) {
            if (this.craftFromTop) {
                this.currentSlotIndex--;
            }
            else {
                this.currentSlotIndex++;
            }
        }
    };
    Crafter.prototype.hasSlotToCraft = function () {
        var slot = this.collection.slots[this.currentSlotIndex];
        return slot && !slot.hasAtLeastMax();
    };
    Crafter.prototype.initSlotIndex = function () {
        if (this.craftFromTop) {
            this.currentSlotIndex
                = this.collection.slots.length - 1;
        }
        else {
            this.currentSlotIndex = 1;
        }
    };
    Crafter.prototype.craftMissingCards = function () {
        this.refreshCurrentSlotNumber();
        if (!this.hasSlotToCraft()) {
            return;
        }
        var slot = this.collection.slots[this.currentSlotIndex];
        var couldCraft = this.tryCraftForSlot(slot);
        if (couldCraft) {
            this.craftMissingCards();
        }
    };
    Crafter.prototype.tryCraftForSlot = function (slot) {
        var costs = this.getCreateCostsForSlot(slot);
        var costNormal = costs[0];
        var costGolden = costs[1];
        if (this.preferGolden) {
            if (this.dustCount >= costGolden) {
                this.dustCount -= costGolden;
                slot.goldenCount += 1;
                return true;
            }
        }
        else {
            if (this.dustCount >= costNormal) {
                this.dustCount -= costNormal;
                slot.normalCount += 1;
                return true;
            }
        }
        return false;
    };
    return Crafter;
})();
exports.Crafter = Crafter;
//# sourceMappingURL=crafting.js.map