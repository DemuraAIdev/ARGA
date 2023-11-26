class PlayerManager {
    constructor(gameengine) {
        this.name = "";
        this.inventory = [];
        this.location = null;
        this.gameEngine = gameengine;
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
    getInventoryTable() {
        // console.table
        if (this.inventory.length === 0) {
            this.gameEngine.log("You have nothing in your inventory.", "fgRed");
            return;
        }
        let table = [];
        this.inventory.forEach((item) => {
            const items = this.gameEngine.findItemById(item);
            table.push({
                name: items.name,
                description: items.description,
            });
        });
        console.table(table);
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

    itemIndex(item) {
        return this.inventory.indexOf(item);
    }
}

module.exports = PlayerManager;