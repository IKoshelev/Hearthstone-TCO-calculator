var cltn = require("./collection");
var crft = require("./crafting");
var drw = require("./drawer");
// ammount of craftable cards of each rarity
var collection = getCollection(210 + 49, 118 + 36, 64 + 27, 56 + 20);
var probbabilities = getProbabilities();
var drawer = new drw.PackOpener(collection, probbabilities);
var disenchantCosts = getDisenchantCosts();
var craftCosts = getCraftCosts();
var crafter = new crft.Crafter(collection, disenchantCosts, craftCosts, false); // true for golden
var packsOpened = 0;
while (!collection.isComplete()) {
    packsOpened += 1;
    drawer.openPack();
    crafter.disenchantExtra();
    crafter.craftMissingCards();
}
var log = "";
collection.slots.forEach(function (slot) {
    log += ("id" + slot.id + ",") +
        ("r" + slot.rarity + ",") +
        ("c" + slot.normalCount + ",") +
        ("g" + slot.goldenCount + ";\t");
});
console.log(log);
console.log("Total packs opened " + packsOpened);
function getProbabilities() {
    var probbabilities = new drw.PackProbability();
    //http://hearthstone.gamepedia.com/Card_pack_statistics
    probbabilities.addProbability(cltn.Rarity.common, false, 69.97);
    probbabilities.addProbability(cltn.Rarity.common, true, 1.47);
    probbabilities.addProbability(cltn.Rarity.rare, false, 21.4);
    probbabilities.addProbability(cltn.Rarity.rare, true, 1.38);
    probbabilities.addProbability(cltn.Rarity.epic, false, 4.29);
    probbabilities.addProbability(cltn.Rarity.epic, true, 0.31);
    probbabilities.addProbability(cltn.Rarity.legendary, false, 1.08);
    probbabilities.addProbability(cltn.Rarity.legendary, true, 0.11);
    return probbabilities;
}
function getCollection(commons, rares, epics, legendaries) {
    var collection = new cltn.Collection();
    collection.addSlots(commons, cltn.Rarity.common, 2);
    collection.addSlots(rares, cltn.Rarity.rare, 2);
    collection.addSlots(epics, cltn.Rarity.epic, 2);
    collection.addSlots(legendaries, cltn.Rarity.legendary, 1);
    return collection;
}
function getDisenchantCosts() {
    var disenchantCosts = {};
    disenchantCosts[cltn.Rarity.common] = {
        0: 5,
        1: 50
    };
    disenchantCosts[cltn.Rarity.rare] = {
        0: 20,
        1: 100
    };
    disenchantCosts[cltn.Rarity.epic] = {
        0: 100,
        1: 400
    };
    disenchantCosts[cltn.Rarity.legendary] = {
        0: 400,
        1: 1600
    };
    return disenchantCosts;
}
function getCraftCosts() {
    var craftCosts = {};
    craftCosts[cltn.Rarity.common] = {
        0: 40,
        1: 400
    };
    craftCosts[cltn.Rarity.rare] = {
        0: 100,
        1: 800
    };
    craftCosts[cltn.Rarity.epic] = {
        0: 400,
        1: 1600
    };
    craftCosts[cltn.Rarity.legendary] = {
        0: 1600,
        1: 3200
    };
    return craftCosts;
}
//# sourceMappingURL=app.js.map