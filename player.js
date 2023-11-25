class PlayerManager {
    constructor() {
        this.name = "";
        this.inventory = [];
        this.location = null;
    }

    setName(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    getInventory() {
        return this.inventory;
    }

    addItem(item) {
        this.inventory.push(item);
    }

    removeItem(item) {
        this.inventory = this.inventory.filter((i) => i !== item);
    }

    hasItem(item) {
        return this.inventory.includes(item);
    }
}

module.exports = PlayerManager;