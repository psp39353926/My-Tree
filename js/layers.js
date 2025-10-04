addLayer("p", {
    name: "particles", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    row: 0,
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#00000ff",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "particles", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    doReset(resettingLayer) {
        let keep = [];
        if (layers[resettingLayer].row > this.row) {
            layerDataReset("p", [])
            player[this.layer].upgrades = keep
        }
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('p', 13)) mult = mult.times(upgradeEffect('p', 13))
        if (hasUpgrade('p', 23)) mult = mult.times(upgradeEffect('p', 23))
        mult = 1
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for particles", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    resetDescription: "Make particles",
    upgrades: {
        11: {
            title: "Particle Boost",
            description: "Begin generating Points.",
            cost: new Decimal(1),
        },
        21: {
            title: "Particle Boost 2",
            description: "Doubles Points gain.",
            cost: new Decimal(2),
        },
        12: {
            title: "Automatic Particle boosts",
            description: "Increase Point gain based on particles.",
            cost: new Decimal(3),
            effect() {
                let pointvalue = new Decimal(0);
                {pointvalue = player[this.layer].points}
                return pointvalue.add(1).pow(0.5)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        22: {
            title: "Exponent upgrade 1",
            description: "exponenty upgrades.",
            cost: new Decimal(5),
            effect() {
                return player.points.add(1).pow(0.12)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        13: {
            title: "Exponent upgrade 2",
            description: "exponenty² upgrades.",
            cost: new Decimal(15),
            effect() {
                return player.points.add(1).pow(0.6)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        23: {
            title: "Exponential growth",
            description: "Particles boost itself.",
            cost: new Decimal(25),
            effect() {
                return player[this.layer].points.add(1).pow(0.1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
    },
})
