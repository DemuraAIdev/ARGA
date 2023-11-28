const fs = require("fs");
const path = require("path");
const GameEngine = require("./core/GameEngine");
const game = new GameEngine();
const { log } = require("./lib/Console");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to list all games in the "game" folder
function listGames() {
  const gameFolder = path.join(__dirname, "game");
  const games = fs.readdirSync(gameFolder);
  log(
    `

        █████╗ ██████╗  ██████╗  █████╗ 
        ██╔══██╗██╔══██╗██╔════╝ ██╔══██╗
        ███████║██████╔╝██║  ███╗███████║
        ██╔══██║██╔══██╗██║   ██║██╔══██║
        ██║  ██║██║  ██║╚██████╔╝██║  ██║
        ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝    
        ARGA GAME ENGINE
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
  const gameFolder = path.join(__dirname, "game");
  const games = fs.readdirSync(gameFolder);

  if (gameIndex >= 1 && gameIndex <= games.length) {
    const selectedGame = games[gameIndex - 1];
    const gamePath = path.join(gameFolder, selectedGame, "index.json");
    await game.loadGame(gamePath);
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
  log("There was an uncaught error:", "fgWhite", "bgRed");
  log(err, "fgWhite", "bgRed");
  game.quit();
});

process.on("unhandledRejection", (reason, promise) => {
  log("Unhandled Rejection at:", "fgWhite", "bgRed");
  log(promise, "fgWhite", "bgRed");

  game.quit();
});

// handle process exit
// handle process exit
process.on("exit", async (code) => {
  log(`Kernel Rechive Game Engine Exit with code ${code}`, "fgWhite", "bgRed");

});
