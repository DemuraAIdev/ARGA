const readline = require("readline");
const log = require("./lib/Color");
const fs = require("fs");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const PlayerManager = require("./player");

class GameEngine {
  constructor() {
    this.player = new PlayerManager();
    this.game = null;
    this.location = null;
  }
  async loadGame(filename) {
    console.log("Build Using ARGA GAME ENGINE")
    log("Loading game...", "fgGreen");
    await fs.readFile(filename, "utf8", (err, data) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      try {
        this.game = JSON.parse(data);
        log(`Game ${this.game.name} Loaded`);
      } catch (e) {
        console.error(e);
        process.exit(1);
      }
      this.location = this.game.location[this.game.start];
      this.player.location = this.game.start;
      let inventoryGame = this.game.inventory;
      for (let item of inventoryGame) {
        this.player.addItem(item);
        log(`You have ${item}`, "fgGreen");
      }

      this.look();
    });

    this.gameLoop();
  }

  handleInput(input) {
    // Split the input into a command and arguments
    const [command, ...args] = input.toLowerCase().split(" ");
    // Handle the command
    switch (command) {
      case "look":
        this.look();
        break;
      case "take":
        this.take(args[0]);
        break;
      case "drop":
        this.drop(args[0]);
        break;
      case "open":
        this.open(args[0]);
        break;
      case "search":
        this.search(args[0]);
        break;
      case "close":
        this.close(args[0]);
        break;
      case "inventory":
        this.inventory();
        break;
      case "unlock":
        this.unlock(args[0], args[1]);
        break;
      case "enter":
        this.enter(args[0]);
        break;
      case "help":
        this.help();
        break;
      case "quit":
        this.quit();
        break;
      case "save":
        this.save();
        break;
      case "load":
        this.load(args[0]);
        break;
      default:
        log("Unknown command", "fgRed");
    }
  }

  gameLoop() {
    rl.question("> ", (input) => {
      this.handleInput(input);
      this.gameLoop();
    });
  }

  look() {
    log(this.location.name, "fgGreen");
    log(this.location.description, "fgYellow");
    if (this.location.items && this.location.items.length > 0) {
      log("You see:", "fgGreen");
      for (let item of this.location.items) {
        const state = this.game.item[item].state ? ` (${this.game.item[item].state})` : ""  ;
        log("- " + this.game.item[item].name + state, "fgYellow");
      }
    }
    // debug
    // log(this.location);
  }
  take(itemName) {
    const item = this.game.item[itemName];

    if (!item || !this.location.items.includes(itemName)) {
      log(`There is no ${itemName} here.`, "fgRed");
      return;
    }

    if (item.canTake && item.canTake.take) {
      this.location.items = this.location.items.filter((i) => i !== itemName);
      this.player.addItem(itemName);
      delete this.game.location[itemName];
      log(item.canTake.message, "fgGreen");
      this.inventory();
    } else {
      log(
        item.canTake ? item.canTake.message : `You can't take ${itemName}`,
        "fgRed"
      );
    }
  }

  drop(itemName) {
    if (this.player.hasItem(itemName)) {
      this.player.removeItem(itemName);
      this.location.items.push(itemName);
      log(`You dropped ${itemName}`, "fgGreen");
    } else {
      log(`You don't have ${itemName}`, "fgRed");
    }
  }

  inventory() {
    log("You have:", "fgGreen");
    if (this.player.getInventory().length > 0) {
      for (let item of this.player.getInventory()) {
        log("- " + this.game.item[item].name, "fgYellow");
      }
    } else {
      log("Nothing.", "fgRed");
    }
  }

  open(itemName) {
    const item = this.game.item[itemName];

    if (!item) {
      log(`There is no ${itemName} here.`, "fgRed", "bgYellow");
      return;
    }

    if (!item.canOpen || !item.canOpen.open) {
      log(
        item.canOpen ? item.canOpen.message : "You can't open that.",
        "fgRed",
        "bgYellow"
      );

      if (item.canUnlock && item.canUnlock.unlock) {
        return new Promise((resolve) => {
          rl.question("Do you want to unlock it? (yes/no) ", (answer) => {
            if (answer === "yes") {
              this.unlock(itemName);
              this.gameLoop();
              resolve();
            }
            this.gameLoop();
            resolve();
          });
        });
      }
      return;
    }

    if (item.state === "open") {
      if (item.canEnter && item.canEnter.enter) {
        return this.enter(itemName);
      }
      log("It's already open.", "fgRed", "bgYellow");
      return;
    }

    item.state = "open";
    log(item.canOpen.message, "fgGreen");

    if (
      item.states.open &&
      item.states.open.items &&
      item.states.open.items.length > 0
    ) {
      this.location.items = this.location.items.filter(
        (i) => !item.states.open.items.includes(i)
      );
      log(item.states.open.message, "fgGreen");

      for (let items of item.states.open.items) {
        log("- " + this.game.item[items].name, "fgYellow");
        this.location.items.push(items);
      }
      this.look();
    } else {
      this.enter(itemName);
    }
  }

  search(itemName) {
    const item = this.game.item[itemName];

    if (!item) {
      log(`There is no ${itemName} here.`, "fgRed", "bgYellow");
      return;
    }

    if (!item.canSearch) {
      log(`You can't search ${itemName}`, "fgRed", "bgYellow");
      return;
    }

    const { canSearch } = item;

    if (canSearch.search) {
      log(canSearch.message, canSearch.search.items ? "fgGreen" : "fgRed");

      if (canSearch.search.items && canSearch.search.items.length > 0) {
        this.location.items = this.location.items.filter(
          (i) => !canSearch.search.items.includes(i)
        );

        for (const searchedItem of canSearch.search.items) {
          const searchedItemName = this.game.item[searchedItem].name;
          log(`- ${searchedItemName}`, "fgYellow");
          this.location.items.push(searchedItem);
        }

        this.look();
      }
    } else {
      log(canSearch.message, "fgRed");
    }
  }

  close(itemName) {
    let item = this.game.item[itemName];
    if (item) {
      if (item.canClose && item.canClose.close) {
        item.state = "closed";
        log(item.canClose.message, "fgGreen");
        if (item.states.open.items && item.states.open.items.length > 0) {
          this.location.items = this.location.items.filter(
            (i) => !item.states.open.items.includes(i)
          );
          log(item.states.closed.message, "fgGreen");
        }
      } else {
        log(`You can't close ${itemName}`, "fgRed", "bgYellow");
      }
    } else {
      log(`There is no ${itemName} here.`, "fgRed", "bgYellow");
    }
  }

  async unlock(itemName, tool) {
    const item = this.game.item[itemName];

    if (!item) {
      log(`There is no ${itemName} here.`, "fgRed");
      return;
    }

    const { canUnlock } = item;

    if (!tool) {
      if (this.player.hasItem(item.canUnlock.use)) {
        log(`You unlock ${itemName} with ${item.canUnlock.use}`, "fgGreen");
        item.state = "open";
        item.canOpen.open = true;
        log(canUnlock.message, "fgGreen");
        return;
      } else {
        log(`You don't have item to unlockit.`, "fgRed");
        return;
      }
    }

    if (!canUnlock || !canUnlock.unlock || !canUnlock.use) {
      log(`You can't unlock ${itemName}`, "fgRed");
      return;
    }

    if (!this.player.inventory.includes(tool)) {
      log(`You don't have ${tool} in your inventory.`, "fgRed");
      return;
    }

    if (!canUnlock.use.includes(tool)) {
      log(`You can't unlock ${itemName} with ${tool}`, "fgRed");
      return;
    }

    item.state = "open";
    item.canOpen.open = true;
    log(canUnlock.message, "fgGreen");
  }

  enter(itemName) {
    const item = this.game.item[itemName];

    if (!item) {
      log(`There is no ${itemName} here.`, "fgRed");
      return;
    }

    if (item.state === "closed") {
      log(`You can't enter ${itemName} because it's closed.`, "fgRed");
      return;
    }

    if (!item.canEnter) {
      log(`You can't enter ${itemName}.`, "fgRed");
      return;
    }

    if (item.canEnter.enter) {
      if (item.states.open.finish) {
        log(this.game.finishmessage, "fgGreen");
        this.quit();
      }
      const targetLocation =
        item.canEnter.enter === this.player.location
          ? item.locationbefore
          : item.canEnter.enter;
      this.location = this.game.location[targetLocation];
      this.player.location = targetLocation;
      this.look();
    } else {
      log(item.canEnter.message || `You can't enter ${itemName}.`, "fgRed");
    }
  }

save() {
    rl.question("Enter a name for the save: ", (saveName) => {
        const savePath = `save/${saveName}.json`;
        fs.writeFile(savePath, JSON.stringify(this), (err) => {
            if (err) {
                console.error(err);
                return;
            }
            log(`Game saved as ${savePath}!`, "fgGreen");
        });
    });
}

load(saveName) {
    const savePath = `save/${saveName}.json`;
    fs.readFile(savePath, "utf8", (err, data) => {
        if (err) {
            console.error(err);
            log("Save not found.", "fgRed");
            return;
        }
        try {
            const save = JSON.parse(data);
            this.player.location = save.player.location;
            this.player.inventory = save.player.inventory;
            this.game = save.game;
            this.location = save.location;
            log("Game loaded!", "fgGreen");
            this.look();
        } catch (e) {
            console.error(e);
        }
    });
}

  help() {
    log("Welcome to the game.", "fgGreen");
    log("You can use the following commands:", "fgGreen");
    log("- look: Look at the location.", "fgGreen");
    log("- search [item]: Search an item.", "fgGreen");
    log("- take [item]: Take an item.", "fgGreen");
    log("- drop [item]: Drop an item.", "fgGreen");
    log("- inventory: Show the inventory.");
    log("- enter [door/smth]: Enter an object.", "fgGreen");
    log("- open [item]: Open an item.", "fgGreen");
    log("- unlock [item] [tool]: Unlock an item.", "fgGreen");
    log("- close [item]: Close an item.", "fgGreen");
    log("- quit: Quit the game.", "fgGreen");
    log("- help: Show this help message.", "fgGreen");
  }

  quit() {
    log("Goodbye!", "fgGreen");
    process.exit(0);
  }
}

// handle error
process.on("uncaughtException", (err) => {
  console.error("There was an uncaught error", err);
});

module.exports = GameEngine;
