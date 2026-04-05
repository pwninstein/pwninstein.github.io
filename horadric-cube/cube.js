class Item {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

var items = [
    new Item("r01", "El Rune"),
    new Item("r02", "Eld Rune"),
    new Item("r03", "Tir Rune"),
    new Item("r04", "Nef Rune"),
    new Item("r05", "Eth Rune"),
    new Item("r06", "Ith Rune"),
    new Item("r07", "Tal Rune"),
    new Item("r08", "Ral Rune"),
    new Item("r09", "Ort Rune"),
    new Item("r10", "Thul Rune"),
    new Item("r11", "Amn Rune"),
    new Item("r12", "Sol Rune"),
    new Item("r13", "Shael Rune"),
    new Item("r14", "Dol Rune"),
    new Item("r15", "Hel Rune"),
    new Item("r16", "Io Rune"),
    new Item("r17", "Lum Rune"),
    new Item("r18", "Ko Rune"),
    new Item("r19", "Fal Rune"),
    new Item("r20", "Lem Rune"),
    new Item("r21", "Pul Rune"),
    new Item("r22", "Um Rune"),
    new Item("r23", "Mal Rune"),
    new Item("r24", "Ist Rune"),
    new Item("r25", "Gul Rune"),
    new Item("r26", "Vex Rune"),
    new Item("r27", "Ohm Rune"),
    new Item("r28", "Lo Rune"),
    new Item("r29", "Sur Rune"),
    new Item("r30", "Ber Rune"),
    new Item("r31", "Jah Rune"),
    new Item("r32", "Cham Rune"),
    new Item("r33", "Zod Rune"),
    new Item("gcv", "Chipped Amethyst"),
    new Item("gfv", "Flawed Amethyst"),
    new Item("gsv", "Amethyst"),
    new Item("gzv", "Flawless Amethyst"),
    new Item("gpv", "Perfect Amethyst"),
    new Item("gcb", "Chipped Sapphire"),
    new Item("gfb", "Flawed Sapphire"),
    new Item("gsb", "Sapphire"),
    new Item("glb", "Flawless Sapphire"),
    new Item("gpb", "Perfect Sapphire"),
    new Item("gcg", "Chipped Emerald"),
    new Item("gfg", "Flawed Emerald"),
    new Item("gsg", "Emerald"),
    new Item("glg", "Flawless Emerald"),
    new Item("gpg", "Perfect Emerald"),
    new Item("gcr", "Chipped Ruby"),
    new Item("gfr", "Flawed Ruby"),
    new Item("gsr", "Ruby"),
    new Item("glr", "Flawless Ruby"),
    new Item("gpr", "Perfect Ruby"),
    new Item("gcw", "Chipped Diamond"),
    new Item("gfw", "Flawed Diamond"),
    new Item("gsw", "Diamond"),
    new Item("glw", "Flawless Diamond"),
    new Item("gpw", "Perfect Diamond"),
    new Item("gcy", "Chipped Topaz"),
    new Item("gfy", "Flawed Topaz"),
    new Item("gsy", "Topaz"),
    new Item("gly", "Flawless Topaz"),
    new Item("gpy", "Perfect Topaz"),
];

class Rule {
    /** @param {Array<string> inputs} @param {string} output */
    constructor(inputs, output) {
        this.inputs = inputs.sort((a, b) => a.localeCompare(b));
        this.output = output;
    }
}

var rules = [
    new Rule(["r01", "r01", "r01"], "r02"),
    new Rule(["r02", "r02", "r02"], "r03"),
    new Rule(["r03", "r03", "r03"], "r04"),
    new Rule(["r04", "r04", "r04"], "r05"),
    new Rule(["r05", "r05", "r05"], "r06"),
    new Rule(["r06", "r06", "r06"], "r07"),
    new Rule(["r07", "r07", "r07"], "r08"),
    new Rule(["r08", "r08", "r08"], "r09"),
    new Rule(["r09", "r09", "r09"], "r10"),
    new Rule(["r10", "r10", "r10", "gcy"], "r11"),
    new Rule(["r11", "r11", "r11", "gcv"], "r12"),
    new Rule(["r12", "r12", "r12", "gcb"], "r13"),
    new Rule(["r13", "r13", "r13", "gcr"], "r14"),
    new Rule(["r14", "r14", "r14", "gcg"], "r15"),
    new Rule(["r15", "r15", "r15", "gcw"], "r16"),
    new Rule(["r16", "r16", "r16", "gfy"], "r17"),
    new Rule(["r17", "r17", "r17", "gfv"], "r18"),
    new Rule(["r18", "r18", "r18", "gfb"], "r19"),
    new Rule(["r19", "r19", "r19", "gfr"], "r20"),
    new Rule(["r20", "r20", "r20", "gfg"], "r21"),
    new Rule(["r21", "r21", "gfw"], "r22"),
    new Rule(["r22", "r22", "gsy"], "r23"),
    new Rule(["r23", "r23", "gsv"], "r24"),
    new Rule(["r24", "r24", "gsb"], "r25"),
    new Rule(["r25", "r25", "gsr"], "r26"),
    new Rule(["r26", "r26", "gsg"], "r27"),
    new Rule(["r27", "r27", "gsw"], "r28"),
    new Rule(["r28", "r28", "gly"], "r29"),
    new Rule(["r29", "r29", "gzv"], "r30"),
    new Rule(["r30", "r30", "glb"], "r31"),
    new Rule(["r31", "r31", "glr"], "r32"),
    new Rule(["r32", "r32", "glg"], "r33"),
    new Rule(["gcv", "gcv", "gcv"], "gfv"),
    new Rule(["gfv", "gfv", "gfv"], "gsv"),
    new Rule(["gsv", "gsv", "gsv"], "gzv"),
    new Rule(["gzv", "gzv", "gzv"], "gpv"),
    new Rule(["gcb", "gcb", "gcb"], "gfb"),
    new Rule(["gfb", "gfb", "gfb"], "gsb"),
    new Rule(["gsb", "gsb", "gsb"], "glb"),
    new Rule(["glb", "glb", "glb"], "gpb"),
    new Rule(["gcg", "gcg", "gcg"], "gfg"),
    new Rule(["gfg", "gfg", "gfg"], "gsg"),
    new Rule(["gsg", "gsg", "gsg"], "glg"),
    new Rule(["glg", "glg", "glg"], "gpg"),
    new Rule(["gcr", "gcr", "gcr"], "gfr"),
    new Rule(["gfr", "gfr", "gfr"], "gsr"),
    new Rule(["gsr", "gsr", "gsr"], "glr"),
    new Rule(["glr", "glr", "glr"], "gpr"),
    new Rule(["gcw", "gcw", "gcw"], "gfw"),
    new Rule(["gfw", "gfw", "gfw"], "gsw"),
    new Rule(["gsw", "gsw", "gsw"], "glw"),
    new Rule(["glw", "glw", "glw"], "gpw"),
    new Rule(["gcy", "gcy", "gcy"], "gfy"),
    new Rule(["gfy", "gfy", "gfy"], "gsy"),
    new Rule(["gsy", "gsy", "gsy"], "gly"),
    new Rule(["gly", "gly", "gly"], "gpy"),
];

/** @type {HTMLDivElement} */
var toolbox = document.getElementById("toolbox");
/** @type {HTMLDivElement} */
var horadricCube = document.getElementById("horadricCube");
/** @type {HTMLDivElement} */
var inventory = document.getElementById("inventory");
/** @type {HTMLUListElement} */
var ruleList = document.getElementById("ruleList");
/** @type {Map<string, Item>} */
var itemLookup = new Map();

function clearContents(container) {
    for (var e of container.querySelectorAll(".item")) {
        e.classList.remove("item");
        delete e.dataset.itemId;
    }
}

function tryMoveItem(element, targetContainer, removeOld = false) {
    if (!element.classList.contains("item")) return;

    var freeSlot = targetContainer.querySelector("div:not(.item)");
    if (freeSlot == null) return;

    freeSlot.classList.add("item");
    freeSlot.dataset.itemId = element.dataset.itemId;

    if (removeOld) {
        element.classList.remove("item");
        delete element.dataset.itemId;
    }
}

/** @param {Array<string>} a @param {Array<string>} b */
function arrayEquals(a, b) {
    if (a.length != b.length) return false;

    for (var i in a) {
        if (a[i] != b[i]) return false;
    }

    return true;
}

function transmute() {
    /** @type {NodeListOf<Element>} */
    var matchingNodes = horadricCube.querySelectorAll(".item");
    if (matchingNodes.length == 0) return;

    const itemElements = [...matchingNodes.values()];

    /** @type {Array<string>} */
    const itemIds = itemElements.map((i) => i.dataset.itemId).sort((a, b) => a.localeCompare(b));

    for (var rule of rules) {
        if (!arrayEquals(rule.inputs, itemIds)) continue;

        itemElements.forEach((el) => {
            el.classList.remove("item");
            delete el.dataset.itemId;
        });

        const freeSlot = horadricCube.querySelector("div:not(.item)");
        freeSlot.classList.add("item");
        freeSlot.dataset.itemId = rule.output;

        break;
    }
}

toolbox.onclick = (e) => {
    tryMoveItem(e.target, inventory);
};

inventory.onclick = (e) => {
    tryMoveItem(e.target, horadricCube, true);
};

horadricCube.onclick = (e) => {
    tryMoveItem(e.target, inventory, true);
};

for (var item of items) {
    var e = document.createElement("div");
    e.classList.add("slot", "item");
    e.dataset.itemId = item.id;
    e.title = item.name;
    toolbox.appendChild(e);
    itemLookup.set(item.id, item);
}

for (var i = 0; i < 12; i++) {
    var e = document.createElement("div");
    e.classList.add("slot");
    horadricCube.appendChild(e);
}

for (var i = 0; i < 40; i++) {
    var e = document.createElement("div");
    e.classList.add("slot");
    inventory.appendChild(e);
}

for (var rule of rules) {
    var e = document.createElement("li");
    var inputsText = rule.inputs.map((i) => itemLookup.get(i).name).join(' + ');
    var outputText = itemLookup.get(rule.output).name;
    e.innerText = `${inputsText} = ${outputText}`;
    ruleList.appendChild(e);
}
