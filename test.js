const GameEngine = require("./core/GameEngine");

const game = new GameEngine();
const test = require("node:test");

test("Loading Game", (t) => {
  // This test passes because it does not throw an exception.
  game.loadGame("game/PrisonEscape/");
});

test("Run Game #1", (t) => {
  // This test passes because it does not throw an exception.
  game.look();
  game.search("desk");
  game.open("drawer");
  game.take("keycell");
  game.inventory();
  game.sleep("bed");
});

test("Run Game #2", (t) => {
  // This test passes because it does not throw an exception.
  game.unlock("door_cell");
  game.look();
  game.search("guard");
  game.take("key");
  game.inventory();
  game.unlock("door_corr");
});

test("Save Game", (t) => {
  // This test passes because it does not throw an exception.
  game.save("test");
});

test("Load Game", (t) => {
  // This test passes because it does not throw an exception.
  game.loadSave("test");
});
