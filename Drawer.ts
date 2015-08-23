import cltn = require("collection");

export interface CardProbability {
    rarity: cltn.Rarity;
    golden: boolean;
    chance: number;
} 

export class PackProbability {

    private probabilites = new Array<CardProbability>();
    private sumOfAllChances = 0;
    private makeSureSumOfAllChancesExists() {
        if (this.sumOfAllChances != 0) {
            return;
        }

        this.sumOfAllChances =
        this
            .probabilites
            .map((prob) => prob.chance)
            .reduce(
                (prev, curr) => prev + curr,
                0);
    }

    public addProbability(
        rarity: cltn.Rarity,
        golden: boolean,
        chance: number
        ) {
        this.probabilites.push({
            rarity,
            golden,
            chance
        });

        this.sumOfAllChances = 0;
    }

    public drawCard() {
        this.makeSureSumOfAllChancesExists();

        var rnd = Math.random() * this.sumOfAllChances;

        for (
            var count1 = 0;
            count1 < this.probabilites.length;
            count1++) {

            var prob = this.probabilites[count1];
            rnd -= prob.chance;
            if (rnd <= 0) {
                return prob;
            }   
        }
    }

}

export class PackOpener {

    private setsByRarity: { [id: number]: Array<cltn.Slot>; } = {};

    public cardsPerPack = 5;

    public openPack() {
        var cardsToDraw = this.cardsPerPack;
        while (cardsToDraw--) {
            this.drawCard();
        }
    }

    private drawCard() {
        var card = this.probability.drawCard();
        var correspondingSet = this.setsByRarity[card.rarity];
        var slot = this.chooseRandomSlot(correspondingSet);
        if (card.golden) {
            slot.goldenCount += 1;
        } else {
            slot.normalCount += 1;
        }

    }

    private chooseRandomSlot(slotSet: Array<cltn.Slot>) {
        var rnd = Math.random();
        var slotNumber = Math.floor(rnd * slotSet.length);
        return slotSet[slotNumber];

    }

    constructor(
        private collection: cltn.Collection,
        private probability: PackProbability
        ) {

        collection.slots.forEach((slot) => {
            this.setsByRarity[slot.rarity] = this.setsByRarity[slot.rarity] || [];

            this.setsByRarity[slot.rarity].push(slot);
        });
    }
}