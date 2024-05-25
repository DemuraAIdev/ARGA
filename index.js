const fs = require("fs");
const path = require("path");
const GameEngine = require("./core/GameEngine");
const game = new GameEngine();
const { log } = require("./lib/Console");
const readline = require("readline");

const games = fs.readdirSync("game");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to list all games in the "game" folder
function listGames() {
  log(
    `
        ARGA KERNEL LOADER
        █████╗ ██████╗  ██████╗  █████╗ 
        ██╔══██╗██╔══██╗██╔════╝ ██╔══██╗
        ███████║██████╔╝██║  ███╗███████║
        ██╔══██║██╔══██╗██║   ██║██╔══██║
        ██║  ██║██║  ██║╚██████╔╝██║  ██║
        ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝    
        ARGA GAME ENGINE 1.0.0
                `,
    "fgCyan"
  );

  console.log("Available games:");
  games.forEach((game, index) => {
    console.log(`${index + 1}. ${game}`);
  });
}

// Function to load a game based on user input
async function loadGame(gameIndex) {
  if (gameIndex >= 1 && gameIndex <= games.length) {
    const selectedGame = games[gameIndex - 1];
    await game.loadGame(`game/${selectedGame}/`);
    game.gameLoop(); // Start the game loop after loading the game
  } else {
    console.log("Invalid game selection.");
  }
}

// List all games
listGames();

function askQuestion() {
  return new Promise((resolve) =>
    rl.question("Enter the number of the game you want to play:", (ans) => {
      resolve(ans);
    })
  );
}

// Ask user to select a game
askQuestion().then((answer) => {
  loadGame(answer);
});

game.gameLoop = function () {
  rl.question(`${this.lm.name}> `, (input) => {
    this.handleInput(input);
    this.gameLoop();
  });
};

process.on("uncaughtException", (err) => {
  log("Game Engine error:", "fgWhite", "bgRed");
  log(err, "fgWhite", "bgRed");
  game.quit();
});

process.on("unhandledRejection", (reason, promise) => {
  log("Game Engine : Unhandled Rejection at:", "fgWhite", "bgRed");
  log(promise, "fgWhite", "bgRed");

  game.quit();
});

// handle process exit
// handle process exit
process.on("exit", async (code) => {
  log(`Kernel Rechive Game Engine Exit with code ${code}`, "fgWhite", "bgRed");

  // make exit block
  await new Promise((resolve) => setTimeout(resolve, 1000));
});
