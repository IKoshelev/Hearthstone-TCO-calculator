import cltn = require("collection");


export interface CraftingCost {
    [id: number]: { [id: number]: number };
}


export class Crafter {

    public dustCount = 0;

    public disenchantExtra() {
        this.collection.slots.forEach(this.disenchantSlot);

    }

    private getDisenchantCostsForSlot(slot: cltn.Slot) {
        return this.disenchantCosts[slot.rarity];
    }

    private getCreateCostsForSlot(slot: cltn.Slot) {
        return this.createCosts[slot.rarity];
    }

    private disenchantSlot = (slot: cltn.Slot) => {
        
        var costs = this.getDisenchantCostsForSlot(slot);
        var costNormal = costs[0];
        var costGolden = costs[1];

        while (slot.hasOverMax()) {
            if (this.preferGolden) {
                this.slotTryDisenchantNormal(slot, costNormal);
                this.slotTryDisenchantGolden(slot, costGolden);
            } else {
                this.slotTryDisenchantGolden(slot, costGolden);
                this.slotTryDisenchantNormal(slot, costNormal);
            }  
        }
    }

    private slotTryDisenchantNormal(
        slot: cltn.Slot,
        cost: number) {

        while (slot.hasOverMax() && slot.normalCount > 0) {
            slot.normalCount -= 1;
            this.dustCount += cost;
        }
    }

    private slotTryDisenchantGolden(
        slot: cltn.Slot,
        cost: number) {

        while (slot.hasOverMax() && slot.goldenCount > 0) {
            slot.goldenCount -= 1;
            this.dustCount += cost;
        }
    }

    private currentSlotIndex: number;
    private refreshCurrentSlotNumber() {
        if (!this.currentSlotIndex) {
            this.initSlotIndex();
        }

        var slots = this.collection.slots;
        while (
            slots[this.currentSlotIndex] &&
            slots[this.currentSlotIndex].hasAtLeastMax()) {
            if (this.craftFromTop) {
                this.currentSlotIndex--;
            } else {
                this.currentSlotIndex++;
            }
        }
    }
    public hasSlotToCraft() {
        var slot = this.collection.slots[this.currentSlotIndex];

        return slot && !slot.hasAtLeastMax();
    }

    private initSlotIndex() {
        if (this.craftFromTop) {
            this.currentSlotIndex
            = this.collection.slots.length - 1;
        } else {
            this.currentSlotIndex = 1;
        }
    }

    public craftMissingCards() {
        this.refreshCurrentSlotNumber();
        if (!this.hasSlotToCraft()) {
            return;
        }
        var slot = this.collection.slots[this.currentSlotIndex];
        var couldCraft = this.tryCraftForSlot(slot);
        if (couldCraft) {
            this.craftMissingCards();
        }
    }

    private tryCraftForSlot(slot: cltn.Slot) {
        var costs = this.getCreateCostsForSlot(slot);
        var costNormal = costs[0];
        var costGolden = costs[1];

        if (this.preferGolden){
            if (this.dustCount >= costGolden) {
                this.dustCount -= costGolden;
                slot.goldenCount += 1;
                return true;
            }
        } else {
            if (this.dustCount >= costNormal) {
                this.dustCount -= costNormal;
                slot.normalCount += 1;
                return true;
            }
        }

        return false;
    }

    constructor(
        private collection: cltn.Collection,
        private disenchantCosts: CraftingCost,
        private createCosts: CraftingCost,
        private preferGolden: boolean = false,
        private craftFromTop: boolean = true
        ) {

    }

}