const fs = require("fs");
const PlayerManager = require("./PlayerManager");
const LocationManager = require("./LocationManager");
const TimeManager = require("./TimeManager");
const { log, history } = require("../lib/Console");

class GameEngine {
  constructor() {
    this.game = null;
    this.log = log;
    this.player = new PlayerManager(this);
    this.lm = new LocationManager(this);
    this.config = null;
    this.history = history;
    this.time = new TimeManager();
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

      this.game = JSON.parse(data);

      console.log(this.game);
      console.clear();

      if (this.game.ARGAVER !== "1.0.0") {
        log("ARGA VERSION INCOMPATIBLE", "fgBlack", "bgRed");
        return process.exit();
      }

      // set the location
      this.lm.init(this.game.locations);
      this.lm.loadMap(this.game.start);

      this.player.location = this.lm.id;

      // set inventory push inventory game to inventory player
      this.player.inventory = this.game.inventory;
      // set config
      this.config = this.game.config;
      // set time
      this.time.start(this.config.time.start);
      log(this.time.time, "fgGreen");

      // Display the welcome message
      log(
        `Welcome to ${this.game.name}! By ${this.game.author} (${this.game.version})`,
        "fgCyan"
      );
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
    // await this.gameLoop();
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
    let correctedInput = input.toLowerCase();
    let [command, ...args] = input.toLowerCase().split(" ");
    const allowedActions = this.config.allowedActions;

    if (!allowedActions.includes(command)) {
      const correctedCommand = this.autocorrectCommand(command, allowedActions);
      log(`Autocorrect to ${correctedCommand}`, "fgYellow");
      if (correctedCommand) {
        command = correctedCommand;
      } else {
        const item = this.findItemById(command);
        return item
          ? log(item.description, "fgGreen")
          : log("You can't do that.", "fgRed");
      }
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
        return log("Input 'restart' to restart the game.", "fgGreen");
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
      use: (args) => this.use(args[0], args[1]),
      help: () => this.help(),
      quit: () => this.quit(),
      read: (args) => this.read(args[0]),
      sleep: (args) => this.sleep(args[0]),
      restart: () => this.loadGame(`game/${game.name}/index.json`),
      time: () => this.times(),
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
  autocorrectCommand(command, allowedActions) {
    let closestMatch = null;
    let minDistance = Infinity;

    // Iterate through allowed actions to find the closest match
    for (const action of allowedActions) {
      const distance = this.calculateLevenshteinDistance(command, action);
      if (distance < minDistance) {
        closestMatch = action;
        minDistance = distance;
      }
    }

    // If the closest match is within a certain threshold, return it
    if (minDistance <= 2) {
      // Threshold for autocorrect, you can adjust this as needed
      return closestMatch;
    }

    return null; // Return null if no suitable correction found
  }

  calculateLevenshteinDistance(s1, s2) {
    // Function to calculate Levenshtein distance between two strings
    const len1 = s1.length;
    const len2 = s2.length;
    const matrix = [];

    // Initialize the matrix
    for (let i = 0; i <= len1; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= len2; j++) {
      matrix[0][j] = j;
    }

    // Calculate Levenshtein distance
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }

    return matrix[len1][len2];
  }

  // game loop
  gameLoop(rl) {
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
      log(
        itemIndexGame.canOpen.message || `You can't open the ${item}`,
        "fgRed"
      );
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

  times() {
    log(this.time.getCurrentTime(), "fgGreen");
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

  read(item) {
    const itemIndex = this.findItemById(item);

    if (!this.lm.itemExistInLocation(item)) {
      log(`You can't find the ${item}`, "fgRed");
      return;
    }

    if (!itemIndex.canRead || !itemIndex.canRead.read) {
      log(`You can't read the ${item}`, "fgRed");
      return;
    }

    log(itemIndex.canRead.message || `You read the ${item}`, "fgGreen");
  }

  sleep(item) {
    const itemIndex = this.findItemById(item);

    if (!this.lm.itemExistInLocation(item)) {
      log(`You can't find the ${item}`, "fgRed");
      return;
    }

    if (!itemIndex.canSleep || !itemIndex.canSleep.sleep) {
      log(`You can't sleep on the ${item}`, "fgRed");
      return;
    }

    log(itemIndex.canSleep.message || `You sleep on the ${item}`, "fgGreen");
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
      try {
        const data = fs.readFileSync(`save/${save}.json`, "utf8");
        let { game, player, lm, history } = JSON.parse(data);

        // Fix corrupt JSON data
        game = game || {};
        player = player || {};
        lm = lm || {};
        history = history || [];

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
      } catch (error) {
        log("Error loading save file.", "fgRed");
        return this.gameLoop();
      }
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
