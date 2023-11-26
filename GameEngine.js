// // STRCUTRE OF GAME
// {
//     "name": "Prison Break",
//     "author": "Abdul Vaiz",
//     "version": "1.0.0",
//     "start": "CellPrison",
//     "description": "You are in a prison cell. You want to escape from the prison.",
//     "config": {
//       "debug": true,
//       "allowedAction": [
//         "take",
//         "search",
//         "open",
//         "close",
//         "enter",
//         "unlock",
//         "sleep"
//       ]
//     },
//     "inventory": [],
//     "finishmessage": "You escaped the prison. Congratulations!",
//     "locations": [
//       {
//         "id": "CellPrison",
//         "name": "Prison Cell",
//         "description": "You are in a prison cell. There is a bed and a desk. There is a door.",
//         "items": ["bed", "desk", "door_cell"]
//       },
//       {
//         "id": "Corridor",
//         "name": "Corridor",
//         "description": "You are in a corridor. There is a door.",
//         "items": ["door_corr", "door_cell", "guard"]
//       }
//     ],
//     "item": [
//       {
//         "id": "bed",
//         "name": "bed",
//         "description": "A bed. It looks comfortable.",
//         "canTake": {
//           "take": false,
//           "message": "You can't take the bed."
//         },
//         "canSearch": {
//           "search": false,
//           "message": "You can't search the bed. but you can sleep on it (coming soon)."
//         },
//         "canSleep": {
//           "sleep": true,
//           "message": "You sleep on the bed."
//         },
//         "event": "wakeup_midnight"
//       },
//       {
//         "id": "desk",
//         "name": "desk",
//         "description": "A desk. It has a drawer.",
//         "canSearch": {
//           "search": {
//             "items": ["drawer"],
//             "message": "You search the desk. You find a drawer."
//           },
//           "message": "You search the desk. You find a drawer."
//         }
//       },
//       {
//         "id": "drawer",
//         "canSearch": {
//           "search": false,
//           "message": "You can't search the drawer. but you can open it. (command: open drawer)"
//         },
//         "name": "drawer",
//         "description": "A drawer. It is closed.",
//         "canOpen": {
//           "open": true,
//           "message": "You open the drawer. You find a key"
//         },
//         "canClose": {
//           "close": true,
//           "message": "You close the drawer."
//         },
//         "state": "closed",
//         "states": {
//           "open": {
//             "message": "The drawer is open. You find key.",
//             "items": ["keycell"]
//           },
//           "closed": {
//             "message": "The drawer is closed."
//           }
//         }
//       },
//       {
//         "id": "key",
//         "name": "key",
//         "canTake": {
//           "take": true,
//           "message": "You take the key."
//         }
//       },
//       {
//         "id": "keycell",
//         "name": "Key Cellprison",
//         "description": "A key. It is for cellprison door.",
//         "canTake": {
//           "take": true,
//           "message": "You take the key."
//         }
//       },
//       {
//         "id": "door_corr",
//         "name": "door_corr",
//         "description": "A door. It is locked.",
//         "canOpen": {
//           "open": false,
//           "message": "The door is locked."
//         },
//         "canEnter": {
//           "enter": false,
//           "message": "The door is locked."
//         },
//         "canUnlock": {
//           "unlock": true,
//           "message": "You unlock the door.",
//           "use": "key"
//         },
//         "state": "closed",
//         "states": {
//           "open": {
//             "message": "The door is open.",
//             "finish": true
//           }
//         }
//       },
//       {
//         "id": "door_cell",
//         "name": "door_cell",
//         "description": "A door. It is locked.",
//         "state": "locked",
//         "locationnext": "Corridor",
//         "locationbefore": "CellPrison",
//         "event": "angry_guard",
//         "canOpen": {
//           "open": false,
//           "message": "The door is locked"
//         },
//         "canUnlock": {
//           "unlock": true,
//           "message": "You unlock the door.",
//           "use": "keycell"
//         },
//         "canEnter": {
//           "enter": "Corridor",
//           "message": "You enter the door.",
//           "locationbefore": "CellPrison"
//         },
//         "states": {
//           "open": {
//             "message": "The door is open."
//           },
//           "closed": {
//             "message": "The door is closed."
//           }
//         }
//       },
//       {
//         "id": "guard",
//         "name": "guard",
//         "description": "A guard.",
//         "state": "normal",
//         "states": {
//           "angry": {
//             "message": "The guard is angry. He is ignoring you."
//           },
//           "normal": {
//             "message": "The guard is normal."
//           },
//           "sleep": {
//             "message": "The guard is sleeping."
//           }
//         },
//         "canSearch": {
//           "search": {
//             "items": ["key"],
//             "message": "You search the guard. You find a key."
//           },
//           "message": "You search the guard. You find a key."
//         }
//       }
//     ],
//     "event": [
//       {
//         "id": "angry_guard",
// "trigger": {
//   "verb": ["open", "unlock", "enter"],
//   "object": "door_cell"
// },
//         "happen": false,
//         "name": "angry_guard",
//         "description": "The guard is angry.",
//         "effects": [
//           {
//             "item": "guard",
//             "state": "angry",
//             "message": "Hey you prisoner! What are you doing?"
//           },
//           {
//             "item": "door_cell",
//             "state": "closed",
//             "message": "The guard closes the door.",
//             "actions": {
//               "canUnlock": {
//                 "allowed": false,
//                 "message": "The guard watching you."
//               },
//               "canOpen": {
//                 "allowed": false,
//                 "message": "The guard watching you."
//               },
//               "canEnter": {
//                 "allowed": false,
//                 "message": "The guard watching you."
//               }
//             }
//           }
//         ]
//       },
//       {
//         "id": "wakeup_midnight",
//         "trigger": {
//           "verb": "sleep",
//           "object": "bed"
//         },
//         "happen": false,
//         "name": "wakeup_midnight",
//         "description": "You wake up at midnight.",
//         "disableevent": "angry_guard",
//         "effects": [
//           {
//             "item": "guard",
//             "state": "sleep",
//             "message": "The guard is sleeping."
//           },
//           {
//             "item": "door_cell",
//             "state": "closed",
//             "message": "The door is open.",
//             "actions": {
//               "canOpen": {
//                 "open": false,
//                 "message": "The door is locked."
//               },
//               "canUnlock": {
//                 "unlock": true,
//                 "message": "You unlock the door.",
//                 "use": "keycell"
//               }
//             }
//           }
//         ]
//       }
//     ],
//     "ARGAVER": "1.0.0"
//   }

const fs = require("fs");
const readline = require("readline");
const PlayerManager = require("./PlayerManager");
const log = require("./lib/Console");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

class GameEngine {
  constructor() {
    this.game = null;
    this.log = log;
    this.player = new PlayerManager(this);
    this.location = null;
    this.config = null;
  }

  /**
   * Loads a game from the specified path.
   * @param {string} path - The path to the game file.
   * @returns {Promise<void>} - A promise that resolves when the game is loaded.
   */
  async loadGame(path) {
    console.clear();
    log(
      `
    ___    ____  _________ 
    /   |  / __ \/ ____/   |
   / /| | / /_/ / / __/ /| |
  / ___ |/ _, _/ /_/ / ___ |
 /_/  |_/_/ |_|\____/_/  |_|
 ARGA GAME ENGINE
        `,
      "fgCyan"
    );
    try {
      // parse to the variable data
      const data = fs.readFileSync(path, "utf8");
      // parse to the variable game
      this.game = JSON.parse(data);
      // set the location
      this.location = this.game.locations.find(
        (location) => location.id === this.game.start
      );
      this.player.location = this.location.id;

      // set inventory push inventory game to inventory player
      this.player.inventory = this.game.inventory;
      // set config
      this.config = this.game.config;

      // Display the welcome message
      log(`Welcome to ${this.game.name}! By ${this.game.author}`, "fgCyan");
      log(this.game.description, "fgCyan");
      log(
        "Type 'help' for a list of commands, Type look for items in your location",
        "fgCyan"
      );

      this.look();
    } catch (error) {
      console.error("Error loading game:", error);
    }

    // Wait for the game to load before running the game loop
    await this.gameLoop();
  }

  look() {
    log(this.location.name, "fgGreen");
    log(this.location.description, "fgGreen");
    if (this.location.items.length > 0) {
      log("You see:", "fgGreen");
      for (let item of this.location.items) {
        const state = this.game.item.find((itemGame) => itemGame.id === item)
          .state
          ? `(${this.game.item.find((itemGame) => itemGame.id === item).state})`
          : "";
        log(`- ${item} ${state}`, "fgYellow");
      }
    }
  }

  // handleInput
  handleInput(input) {
    const [command, ...args] = input.toLowerCase().split(" ");
    const allowedActions = this.config.allowedActions;

    if (!allowedActions.includes(command)) {
      const item = this.findItemById(command);
      return item
        ? log(item.description, "fgGreen")
        : log("You can't do that.", "fgRed");
    }

    const event = this.game.event.find((event) => {
      const triggerVerb = event.trigger.verb;
      return (
        triggerVerb &&
        (Array.isArray(triggerVerb)
          ? triggerVerb.includes(command)
          : triggerVerb === command) &&
        event.trigger.object === args[0]
      );
    });

    if (event && !event.happen) {
      for (let effect of event.effects) {
        const itemIndex = this.game.item.findIndex(
          (item) => item.id === effect.item
        );
        const item = this.game.item[itemIndex];
        if (item) {
          if (effect.state) item.state = effect.state;
          if (effect.message) log(effect.message, "fgGreen");
          if (effect.actions) Object.assign(item, effect.actions);
        }
      }
      event.happen = true;
      if (event.disableevent)
        this.findEventById(event.disableevent).happen = true;
    }

    switch (command) {
      case "look":
        this.look();
        break;
      case "open":
        this.open(args[0]);
        break;
      case "take":
        this.take(args[0]);
        break;
      case "inventory":
        this.inventory();
        break;
      case "drop":
        this.drop(args[0]);
        break;
      case "search":
        this.search(args[0]);
        break;
      case "unlock":
        this.unlock(args[0], args[1]);
        break;
      case "close":
        this.close(args[0]);
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
      case "sleep":
        this.sleep(args[0]);
        break;
      case "eval":
        this.config.debug
          ? this.eval(args.join(" "))
          : log("Debug mode is disabled.", "fgRed");
        break;
      case "save":
        this.save();
        break;
      case "load":
        this.loadSave();
        break;
      default:
        log("You can't do that.", "fgRed");
        break;
    }
  }

  // game loop
  gameLoop() {
    rl.question(`${this.location.name}> `, (input) => {
      this.handleInput(input);
      this.gameLoop();
    });
  }

  open(item) {
    const itemIndexGame = this.findItemById(item);

    if (!this.itemExistInLocation(item)) {
      log(`You can't find the ${item}`, "fgRed");
      return;
    }

    if (!itemIndexGame.canOpen || !itemIndexGame.canOpen.open) {
      log(`You can't open the ${item}`, "fgRed");
      return;
    }

    if (itemIndexGame.state === "open") {
      log(`The ${item} is already open.`, "fgRed");
      if (itemIndexGame.canEnter) {
        this.enter(item);
      }
      return;
    }

    log(itemIndexGame.canOpen.message || `You open the ${item}`, "fgGreen");

    if (itemIndexGame.states.open.items) {
      log("You find :", "fgYellow");
      this.arraytoList(itemIndexGame.states.open.items);
      this.addItemsToLocation(itemIndexGame.states.open.items);
    }

    itemIndexGame.state = "open";

    if (itemIndexGame.states.open.finish) {
      log(this.game.finishmessage, "fgGreen");
      process.exit();
    }

    if (itemIndexGame.canEnter) {
      this.enter(item);
    }
  }

  take(items) {
    if (this.itemExistInLocation(items)) {
      const item = this.findItemById(items);
      if (item.canTake.take) {
        this.player.addItem(item.id);
        this.location.items.splice(this.location.items.indexOf(item.id), 1);
        log(item.canTake.message || `You take the ${item.name}`, "fgGreen");
      } else {
        log(item.canTake.message || `You can't take the ${item.name}`, "fgRed");
      }
    } else {
      log("You can't find the " + items, "fgRed");
    }
  }

  inventory() {
    const inventory = this.player.getInventoryTable();
    return inventory;
  }

  drop(item) {
    const itemhas = this.player.hasItem(item);
    if (itemhas) {
      const itemIndex = this.player.itemIndex(item);
      const itemDrop = this.player.inventory.splice(itemIndex, 1);
      this.location.items.push(itemDrop[0]);
      log("You drop the " + item, "fgGreen");
    } else {
      log("You don't have the " + item, "fgRed");
    }
  }
  search(item) {
    const itemIndexGame = this.findItemById(item);

    if (!this.itemExistInLocation(item)) {
      log(`You can't find the ${item}`, "fgRed");
      return;
    }

    if (!itemIndexGame.canSearch) {
      log(`You can't search the ${item}`, "fgRed");
      return;
    }

    if (!itemIndexGame.canSearch.search) {
      log(
        itemIndexGame.canSearch.message || `You can't search the ${item}`,
        "fgRed"
      );
      return;
    }

    if (itemIndexGame.canSearch.search.items) {
      this.addItemsToLocation(itemIndexGame.canSearch.search.items);
      log(
        itemIndexGame.canSearch.search.message || `You search the ${item}`,
        "fgGreen"
      );
      log(`You find :`, "fgYellow");
      return this.arraytoList(itemIndexGame.canSearch.search.items);
    }

    log(
      itemIndexGame.canSearch.search.message || `You search the ${item}`,
      "fgGreen"
    );
    itemIndexGame.canSearch.search = false;
    itemIndexGame.canSearch.message = `You already searched the ${item}`;
  }

  sleep(item) {
    const itemIndexGame = this.findItemById(item);
    if (this.itemExistInLocation(item)) {
      if (itemIndexGame.canSleep) {
        if (itemIndexGame.canSleep.sleep) {
          log(
            itemIndexGame.canSleep.message || `You sleep on the ${item}`,
            "fgGreen"
          );
        } else {
          log(
            itemIndexGame.canSleep.message || `You can't sleep on the ${item}`,
            "fgRed"
          );
        }
      } else {
        log("You can't sleep on the " + item, "fgRed");
      }
    } else {
      log("You can't find the " + item, "fgRed");
    }
  }

  unlock(item, tool) {
    const itemIndexGame = this.findItemById(item);

    if (!this.itemExistInLocation(item)) {
      return log(`You can't find the ${item}`, "fgRed");
    }

    const canUnlock = itemIndexGame.canUnlock;

    if (!canUnlock || !canUnlock.unlock) {
      return log(canUnlock?.message || `You can't unlock the ${item}`, "fgRed");
    }

    const requiredTool = canUnlock.use;
    const hasRequiredTool = this.player.hasItem(requiredTool);

    if (requiredTool && tool !== requiredTool && !hasRequiredTool) {
      return log(`You can't unlock the ${item}.`, "fgRed");
    }

    if (!hasRequiredTool) {
      return log(`You can't unlock`, "fgRed");
    }

    log(canUnlock.message || `You unlock the ${item} with ${tool}`, "fgGreen");

    if (itemIndexGame.states.open.items) {
      this.addItemsToLocation(itemIndexGame.states.open.items);
    }
    if (itemIndexGame.canOpen) {
      itemIndexGame.canOpen.open = true;
      itemIndexGame.state = "open";
    }
  }

  close(item) {
    const itemIndexGame = this.findItemById(item);
    if (this.itemExistInLocation(item)) {
      if (itemIndexGame.canClose) {
        if (itemIndexGame.canClose.close) {
          log(
            itemIndexGame.canClose.message || `You close the ${item}`,
            "fgGreen"
          );
          this.location.items.splice(itemIndexGame, 1);
          if (itemIndexGame.states.closed.items) {
            this.addItemsToLocation(itemIndexGame.states.closed.items);
          }
          itemIndexGame.state = "closed";
        } else {
          log(
            itemIndexGame.canClose.message || `You can't close the ${item}`,
            "fgRed"
          );
        }
      } else {
        log("You can't close the " + item, "fgRed");
      }
    } else {
      log("You can't find the " + item, "fgRed");
    }
  }

  enter(item) {
    const itemIndexGame = this.findItemById(item);

    // Check if the item exists in the current location
    if (!this.itemExistInLocation(item)) {
      log(`You can't find the ${item}`, "fgRed");
      return;
    }

    // Check if the item can be entered
    if (!itemIndexGame.canEnter || !itemIndexGame.canEnter.enter) {
      log(`You can't enter the ${item}`, "fgRed");
      return;
    }

    // Check if the item is open
    if (itemIndexGame.state !== "open") {
      log(`The ${item} is not open. You can't enter.`, "fgRed");
      return;
    }

    // Check if the item has a location before entering
    if (itemIndexGame.canEnter.locationbefore !== this.player.location) {
      this.movePlayer(itemIndexGame.canEnter.locationbefore);
      return;
    }

    // Enter the specified location
    this.location = this.game.locations.find(
      (location) => location.id === itemIndexGame.canEnter.enter
    );
    this.player.location = this.location.id;

    // Display a message or default message
    log(itemIndexGame.canEnter.message || `You enter the ${item}`, "fgGreen");
  }
  debug() {
    log(JSON.stringify(this), "fgGreen");
  }

  eval(code) {
    try {
      const result = eval(code);
      log(JSON.stringify(result), "fgGreen");
    } catch (error) {
      log(error, "fgRed");
    }
  }

  async save() {
    const game = this.game;
    const player = this.player;
    const location = this.location;

    const replacer = (key, value) => {
      if (key === "gameEngine") return undefined;
      return value;
    };

    const data = JSON.stringify({ game, player, location }, replacer);

    rl.question("Enter the name for the save file: ", async (name) => {
      await fs.writeFileSync(`save/${name}.json`, data);
      return this.gameLoop();
    });
  }

  async loadSave() {
    rl.question("Enter the name of the save file: ", async (save) => {
      const data = fs.readFileSync(`save/${save}.json`, "utf8");
      const { game, player, location } = JSON.parse(data);

      this.game = game;
      this.player.location = player.location;
      this.player.inventory = player.inventory;

      this.location = location;

      log("Game loaded.", "fgGreen");
      return this.gameLoop();
    });
  }

  help() {
    const allowedAction = this.config.allowedActions;
    log("Commands:", "fgGreen");
    for (let action of allowedAction) {
      log(`- ${action}`, "fgYellow");
    }
  }

  quit() {
    log("Thanks for playing!", "fgGreen");
    process.exit();
  }

  // list like
  // - item1
  // - item2
  // - item3
  arraytoList(arrayss) {
    for (let array of arrayss) {
      log(`- ${array}`, "fgYellow");
    }
  }

  movePlayer(location) {
    const locaton = this.findLocationById(location);
    this.location = locaton;
    this.player.location = locaton.id;
  }

  findItemById(id) {
    return this.game.item.find((item) => item.id === id);
  }
  findLocationById(id) {
    return this.game.locations.find((location) => location.id === id);
  }
  itemExistInLocation(item) {
    return this.location.items.indexOf(item) !== -1;
  }

  itemExistInGame(item) {
    return this.game.item.indexOf(item) !== -1;
  }

  addItemsToLocation(items) {
    for (let item of items) {
      this.location.items.push(item);
    }
  }
  findEventById(id) {
    return this.game.event.find((event) => event.id === id);
  }
}

module.exports = GameEngine;
