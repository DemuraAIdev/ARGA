// // STRCUTRE OF GAME
// {
//   "name": "Prison Break",
//   "author": "Abdul Vaiz",
//   "version": "1.0.0",
//   "start": "CellPrison",
//   "description": "You find yourself confined in a dreary prison cell with only a bed, a desk, and a locked door. Your mission: Escape from this seemingly impenetrable prison.",
//   "config": {
//     "debug": true,
//     "allowedActions": [
//       "take",
//       "search",
//       "open",
//       "close",
//       "enter",
//       "unlock",
//       "sleep",
//       "help",
//       "save",
//       "load",
//       "quit",
//       "look",
//       "inventory",
//       "drop",
//       "talk"
//     ]
//   },
//   "inventory": [],
//   "finishmessage": "Congratulations! You've successfully escaped the prison.",
//   "gameovermessage": "Game Over",
//   "locations": [
//     {
//       "id": "CellPrison",
//       "name": "Prison Cell",
//       "description": "Your surroundings are bleak—a bed, a desk, and a closed door that taunts you. Your journey to freedom begins here.",
//       "items": ["bed", "desk", "door_cell"]
//     },
//     {
//       "id": "Corridor",
//       "name": "Corridor",
//       "description": "You step into a dimly lit corridor. A single door stands between you and freedom.",
//       "items": ["door_corr", "door_cell", "guard"]
//     }
//   ],
//   "item": [
//     {
//       "id": "bed",
//       "name": "bed",
//       "description": "A simple bed that appears surprisingly comfortable. A potential refuge in your quest for freedom.",
//       "canTake": {
//         "take": false,
//         "message": "Attempting to take the bed is futile; it's firmly fixed to the ground."
//       },
//       "canSearch": {
//         "search": false,
//         "message": "Searching the bed yields nothing of interest, but you contemplate using it for a stealthy nap (coming soon)."
//       },
//       "canSleep": {
//         "sleep": true,
//         "message": "You decide to take a moment to rest on the bed."
//       },
//       "event": "wakeup_midnight"
//     },
//     {
//       "id": "desk",
//       "name": "desk",
//       "description": "A plain desk with a closed drawer. It might hold the key to your escape.",
//       "canSearch": {
//         "search": {
//           "items": ["drawer"],
//           "message": "You search the desk and discover a closed drawer."
//         },
//         "message": "You search the desk, revealing a closed drawer."
//       }
//     },
//     {
//       "id": "drawer",
//       "canSearch": {
//         "search": {
//           "items": ["keycell"],
//           "message": "Your search reveals a key hidden in the drawer."
//         },
//         "message": "You can't search the drawer, but you can open it (command: open drawer)."
//       },
//       "name": "drawer",
//       "description": "A closed drawer that piques your curiosity.",
//       "canOpen": {
//         "open": true,
//         "message": "You open the drawer, revealing a key."
//       },
//       "canClose": {
//         "close": true,
//         "message": "You close the drawer."
//       },
//       "state": "closed",
//       "states": {
//         "open": {
//           "message": "The drawer is open, and you find a key inside."
//         },
//         "closed": {
//           "message": "The drawer is closed."
//         }
//       }
//     },
//     {
//       "id": "key",
//       "name": "key",
//       "description": "A key crucial for unlocking the corridor door and securing your escape.",
//       "canTake": {
//         "take": true,
//         "message": "You take the key, recognizing its potential significance."
//       }
//     },
//     {
//       "id": "keycell",
//       "name": "Key Cellprison",
//       "description": "A key specifically designed to unlock the door to your prison cell.",
//       "canTake": {
//         "take": true,
//         "message": "You take the key, sensing its importance in your quest for freedom."
//       }
//     },
//     {
//       "id": "door_corr",
//       "name": "door_corr",
//       "description": "A locked door blocking your path in the corridor.",
//       "canOpen": {
//         "open": false,
//         "message": "The door is securely locked."
//       },
//       "canEnter": {
//         "enter": false,
//         "message": "You can't enter; the door is locked."
//       },
//       "canUnlock": {
//         "unlock": true,
//         "message": "Using the key, you successfully unlock the door.",
//         "use": "key"
//       },
//       "state": "closed",
//       "states": {
//         "open": {
//           "message": "The door swings open, marking your path to freedom.",
//           "finish": true
//         }
//       }
//     },
//     {
//       "id": "door_cell",
//       "name": "door_cell",
//       "description": "The entrance to your prison cell, firmly locked.",
//       "state": "locked",
//       "locationnext": "Corridor",
//       "locationbefore": "CellPrison",
//       "event": "angry_guard",
//       "canOpen": {
//         "open": false,
//         "message": "The door is locked."
//       },
//       "canUnlock": {
//         "unlock": true,
//         "message": "With the keycell in hand, you unlock the door.",
//         "use": "keycell"
//       },
//       "canEnter": {
//         "enter": "Corridor",
//         "message": "You successfully enter the corridor, leaving your cell behind.",
//         "locationbefore": "CellPrison"
//       },
//       "states": {
//         "open": {
//           "message": "The door is open."
//         },
//         "closed": {
//           "message": "The door is closed."
//         }
//       }
//     },
//     {
//       "id": "guard",
//       "name": "guard",
//       "description": "A vigilant guard monitoring your every move.",
//       "state": "normal",
//       "canTalk": {
//         "talk": true,
//         "message": "You cautiously wake up the guard."
//       },
//       "states": {
//         "angry": {
//           "message": "The guard, now angered, ignores your presence."
//         },
//         "normal": {
//           "message": "The guard remains vigilant and alert."
//         },
//         "sleep": {
//           "message": "The guard appears to be sound asleep."
//         }
//       },
//       "canSearch": {
//         "search": {
//           "items": ["key"],
//           "message": "You search the guard and find a key concealed on their person."
//         },
//         "message": "You search the guard and discover a key hidden on their person."
//       }
//     }
//   ],
//   "event": [
//     {
//       "id": "angry_guard",
//       "trigger": {
//         "verb": ["open", "unlock", "enter"],
//         "object": "door_cell"
//       },
//       "happen": false,
//       "name": "angry_guard",
//       "description": "The guard is alerted to your actions, becoming visibly angry.",
//       "effects": [
//         {
//           "item": "guard",
//           "state": "angry",
//           "message": "Hey you prisoner! What are you doing?"
//         },
//         {
//           "item": "door_cell",
//           "state": "closed",
//           "message": "The guard forcefully closes the door, restricting your actions.",
//           "actions": {
//             "canUnlock": {
//               "unlock": false,
//               "message": "The guard watches you closely, preventing any attempts to unlock or open the door."
//             },
//             "canOpen": {
//               "open": false,
//               "message": "The guard remains vigilant, making it impossible to open the door."
//             },
//             "canEnter": {
//               "enter": false,
//               "message": "The guard's watchful eyes prevent any attempts to enter the corridor."
//             }
//           }
//         }
//       ]
//     },
//     {
//       "id": "wakeup_midnight",
//       "trigger": {
//         "verb": "sleep",
//         "object": "bed"
//       },
//       "happen": false,
//       "name": "Wake Up In Mid Night",
//       "description": "You suddenly wake up in the eerie silence of midnight.",
//       "disableevent": "angry_guard",
//       "effects": [
//         {
//           "item": "guard",
//           "state": "sleep",
//           "message": "The guard is now sound asleep, granting you a moment of respite."
//         },
//         {
//           "item": "door_cell",
//           "state": "closed",
//           "message": "Surprisingly, the door is now unlocked, providing an opportunity for your escape.",
//           "actions": {
//             "canOpen": {
//               "open": false,
//               "message": "The door is still locked."
//             },
//             "canUnlock": {
//               "unlock": true,
//               "message": "Utilizing the keycell, you successfully unlock the door.",
//               "use": "keycell"
//             },
//             "canEnter": {
//               "enter": "Corridor",
//               "message": "Seizing the moment, you enter the corridor, leaving your cell behind.",
//               "locationbefore": "CellPrison"
//             }
//           }
//         }
//       ]
//     },
//     {
//       "id": "guard_wakeup",
//       "trigger": {
//         "verb": "talk",
//         "object": "guard"
//       },
//       "happen": false,
//       "name": "Guard Wakeup",
//       "description": "You cautiously wake up the guard, triggering a sense of anger and hostility.",
//       "MovePlayer": "CellPrison",
//       "isOver": true,
//       "effects": [
//         {
//           "item": "guard",
//           "state": "angry",
//           "message": "The guard, now angered, directs their attention towards you."
//         },
//         {
//           "item": "door_cell",
//           "state": "closed",
//           "message": "The door remains locked, limiting your options.",
//           "actions": {
//             "canOpen": {
//               "open": false,
//               "message": "The door is securely locked."
//             },
//             "canUnlock": {
//               "unlock": true,
//               "message": "Utilizing the keycell, you successfully unlock the door.",
//               "use": "keycell"
//             },
//             "canEnter": {
//               "enter": "Corridor",
//               "message": "Capitalizing on the unlocked door, you enter the corridor, leaving your cell behind.",
//               "locationbefore": "CellPrison"
//             }
//           }
//         }
//       ]
//     }
//   ],
//   "ARGAVER": "1.0.0"
// }

const fs = require("fs");
const readline = require("readline");
const PlayerManager = require("./PlayerManager");
const LocationManager = require("./LocationManager");
const { log, history } = require("../lib/Console");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

class GameEngine {
  constructor() {
    this.game = null;
    this.log = log;
    this.player = new PlayerManager(this);
    this.lm = new LocationManager(this);
    this.config = null;
    this.history = history;
  }

  /**
   * Loads a game from the specified path.
   * @param {string} path - The path to the game file.
   * @returns {Promise<void>} - A promise that resolves when the game is loaded.
   */
  async loadGame(path) {
    try {
      // parse to the variable data
      const data = fs.readFileSync(path, "utf8");
      // parse to the variable game
      try {
        this.game = JSON.parse(data);
      } catch (error) {
        if (error instanceof SyntaxError) {
          // Handle the error, attempt to repair JSON, and then try parsing again
          this.game = this.autoRepairJson(data);
        } else {
          // Handle other types of errors
          return console.error("Error parsing JSON:", error.message);
        }
      }

      console.log(this.game);
      this.progressBar(10);
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

      if (this.game.ARGAVER !== "1.0.0") {
        return log("ARGA VERSION INCOMPATIBLE", "fgBlack", "bgRed");
      }

      // set the location
      this.lm.init(this.game.locations);
      this.progressBar(20);
      this.lm.loadMap(this.game.start);
      this.progressBar(50);

      this.player.location = this.lm.id;

      // set inventory push inventory game to inventory player
      this.player.inventory = this.game.inventory;
      // set config
      this.config = this.game.config;
      this.progressBar(100);

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

    process.on("uncaughtException", (err) => {
      console.error("There was an uncaught error", err);
      return this.gameLoop();
    });

    process.on("unhandledRejection", (reason, promise) => {
      console.error("Unhandled Rejection at:", promise, "reason:", reason);
      return this.gameLoop();
    });

    // Wait for the game to load before running the game loop
    await this.gameLoop();
  }
  autoRepairJson(jsonString) {
    try {
      // Parse and stringify to ensure a valid JSON string
      const parsedJson = JSON.parse(jsonString);
      return JSON.stringify(parsedJson);
    } catch (e) {
      // Handle parsing error (e.g., JSON is incomplete or invalid)
      console.error("Error parsing JSON:", e.message);
      return jsonString;
    }
  }

  progressBar(progress) {
    const barLength = 20;
    const filledLength = Math.round(barLength * (progress / 100));
    const bar = "█".repeat(filledLength) + "-".repeat(barLength - filledLength);

    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`[${bar}] ${progress}%`);

    if (progress === 100) {
      process.stdout.clearLine();
      process.stdout.write("\n");
    }
  }

  look() {
    log(this.lm.name, "fgGreen");
    log(this.lm.description, "fgGreen");
    if (this.lm.items.length > 0) {
      log("You see:", "fgGreen");
      for (let item of this.lm.items) {
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
      if (event.movePlayer) {
        this.movePlayer(event.movePlayer);
      }
      log(event.description, "fgRed", "bgYellow");
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
      if (event.isOver) {
        log(this.game.gameovermessage);
        return log("Input 'restart' to restart the game.", "fgGreen")
      }
      event.happen = true;
      if (event.disableevent)
        this.findEventById(event.disableevent).happen = true;
    }

    // if (!this.itemExistInGame(args[0])) {
    //   log("this item isnt avalible in the game", "fgRed")
    // }

    const commandMap = {
      look: () => this.look(),
      open: (args) => this.open(args[0]),
      take: (args) => this.take(args[0]),
      inventory: () => this.inventory(),
      drop: (args) => this.drop(args[0]),
      search: (args) => this.search(args[0]),
      unlock: (args) => this.unlock(args[0], args[1]),
      close: (args) => this.close(args[0]),
      enter: (args) => this.enter(args[0]),
      help: () => this.help(),
      quit: () => this.quit(),
      sleep: (args) => this.sleep(args[0]),
      restart: () => this.loadGame("game/index.json"),
      eval: (args) =>
        this.config.debug
          ? this.eval(args.join(" "))
          : log("Debug mode is disabled.", "fgRed"),
      save: (args) => this.save(args[0]),
      load: (args) => this.loadSave(args[0]),
    };

    const commandHandler = commandMap[command];
    if (commandHandler) {
      commandHandler(args);
    } else {
      log("You can't do that.", "fgRed");
    }
  }

  // game loop
  gameLoop() {
    rl.question(`${this.lm.name}> `, (input) => {
      this.handleInput(input);
      this.gameLoop();
    });
  }

  open(item) {
    const itemIndexGame = this.findItemById(item);

    if (!this.lm.itemExistInLocation(item)) {
      log(`You can't find the ${item}`, "fgRed");
      return;
    }

    if (!itemIndexGame.canOpen || !itemIndexGame.canOpen.open) {
      log(itemIndexGame.canOpen.message || `You can't open the ${item}`, "fgRed");
      return;
    }

    if (itemIndexGame.state === "open") {
      log(`The ${item} is already open.`, "fgRed");
      if (itemIndexGame.canEnter) {
        this.enter(item);
      }
      return;
    }

    itemIndexGame.state = "open";

    if (itemIndexGame.canEnter) {
      return this.enter(item);
    }

    log(itemIndexGame.canOpen.message || `You open the ${item}`, "fgGreen");

    if (itemIndexGame.canSearch?.search) {
      this.search(item);
    }
  }

  take(items) {
    if (!this.lm.itemExistInLocation(items)) {
      log(`You can't find the ${items}`, "fgRed");
      return;
    }

    const item = this.findItemById(items);
    if (!item || !item.canTake || !item.canTake.take) {
      log(`You can't take the ${item.name}`, "fgRed");
      return;
    }

    this.player.addItem(item.id);
    this.lm.removeLocationItem(item.id);
    log(item.canTake.message || `You take the ${item.name}`, "fgGreen");
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
      this.lm.addItemsToLocation(itemDrop);
      log("You drop the " + item, "fgGreen");
    } else {
      log("You don't have the " + item, "fgRed");
    }
  }
  search(item) {
    const itemIndexGame = this.findItemById(item);

    if (!this.lm.itemExistInLocation(item)) {
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

    log(
      itemIndexGame.canSearch.search.message || `You search the ${item}`,
      "fgGreen"
    );

    if (itemIndexGame.canSearch.search.items) {
      if (itemIndexGame.canSearch.search.items.length === 0) {
        log(`You didn't find anything`, "fgYellow");
      } else {
        log(`You find :`, "fgYellow");
        this.arraytoList(itemIndexGame.canSearch.search.items);
        this.lm.addItemsToLocation(itemIndexGame.canSearch.search.items);
      }
    }

    itemIndexGame.canSearch.search = false;
    itemIndexGame.canSearch.message = `You already searched the ${item}`;
  }

  sleep(item) {
    const itemIndexGame = this.findItemById(item);
    if (this.lm.itemExistInLocation(item)) {
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

    if (!this.lm.itemExistInLocation(item)) {
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

    // if (itemIndexGame.states.open.items) {
    //   this.lm.addItemsToLocation(itemIndexGame.states.open.items);
    // }

    if (itemIndexGame.canOpen) {
      itemIndexGame.canOpen.open = true;
      this.open(item);
    }
  }

  close(item) {
    const itemIndexGame = this.findItemById(item);
    if (this.lm.itemExistInLocation(item)) {
      if (itemIndexGame.canClose) {
        if (itemIndexGame.canClose.close) {
          log(
            itemIndexGame.canClose.message || `You close the ${item}`,
            "fgGreen"
          );
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
    if (!this.lm.itemExistInLocation(item)) {
      log(`You can't find the ${item}`, "fgRed");
      return;
    }

    if (itemIndexGame.states.open.finish && itemIndexGame.canOpen.open) {
      return log(this.game.finishmessage, "fgGreen");
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
    this.movePlayer(itemIndexGame.canEnter.enter);

    // Display a message or default message
    log(itemIndexGame.canEnter.message || `You enter the ${item}`, "fgGreen");
    this.look();
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

  async save(namse) {
    const game = this.game;
    const player = this.player;
    const lm = this.lm;
    const history = this.history;

    const replacer = (key, value) => {
      if (key === "engine") return undefined;
      return value;
    };

    const data = JSON.stringify({ game, player, lm, history }, replacer);
    if (namse) {
      await fs.writeFileSync(`save/${namse}.json`, data);
      return this.gameLoop();
    } else {
      rl.question("Enter the name for the save file: ", async (name) => {
        await fs.writeFileSync(`save/${name}.json`, data);
        return this.gameLoop();
      });
    }
    log("Game saved.", "fgGreen");
    return this.gameLoop();
  }

  // fix this
  async loadSave(save) {
    if (!save) {
      rl.question("Enter the name of the save file: ", async (save) => {
        await this.loadSave(save);
      });
    } else {
      const data = fs.readFileSync(`save/${save}.json`, "utf8");
      const { game, player, lm, history } = JSON.parse(data);

      this.game = game;
      this.player.location = player.location;
      this.player.inventory = player.inventory;

      this.lm.locations = lm.locations;
      this.lm.id = lm.id;
      this.lm.name = lm.name;
      this.lm.description = lm.description;
      this.lm.items = lm.items;

      // load history
      this.history = history;
      for (let hist of this.history) {
        console.log(hist);
      }

      log("Game loaded.", "fgGreen");
      return this.gameLoop();
    }
  }
  help() {
    const allowedAction = this.config.allowedActions;
    const actionDescriptions = this.config.ActionDescription;
    log("Commands:", "fgGreen");
    for (let action of allowedAction) {
      const description = actionDescriptions[action];
      log(`- ${action}: ${description}`, "fgYellow");
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
    const locaton = this.lm.findLocationById(location);
    this.lm.loadMap(location);
    this.player.location = locaton.id;
  }

  findItemById(id) {
    return this.game.item.find((item) => item.id === id);
  }

  itemExistInGame(item) {
    return this.game.item.indexOf(item) !== -1;
  }

  findEventById(id) {
    return this.game.event.find((event) => event.id === id);
  }
}

module.exports = GameEngine;
