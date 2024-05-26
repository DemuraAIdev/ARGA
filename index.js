const fs = require("fs");
const zlib = require("zlib");
const path = require("path");
const GameEngine = require("./core/GameEngine");
const game = new GameEngine();
const { log } = require("./lib/Console");
const readline = require("readline");
const { exec } = require("child_process");

// Create necessary folders if they do not exist
["game", "save", "cache"].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to list all games in the "game" folder
function listGames() {
  console.clear();
  const games = fs.readdirSync("game");
  log(
    `
        ARGA GAME LAUNCHER
        █████╗ ██████╗  ██████╗  █████╗ 
        ██╔══██╗██╔══██╗██╔════╝ ██╔══██╗
        ███████║██████╔╝██║  ███╗███████║
        ██╔══██║██╔══██╗██║   ██║██╔══██║
        ██║  ██║██║  ██║╚██████╔╝██║  ██║
        ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝    
        ARGA GAME ENGINE 2.0.0
                `,
    "fgCyan"
  );

  log("Available games:");
  log("========================================");
  log("0. Download new game");
  log("u. Update all games");
  log("d. Delete a game");
  log("========================================");
  games.forEach((game, index) => {
    log(`${index + 1}. ${game}`, "fgGreen");
  });
}

// Function to load a game based on user input
async function loadGame(gameIndex) {
  const games = fs.readdirSync("game");

  if (gameIndex >= 1 && gameIndex <= games.length) {
    const selectedGame = games[gameIndex - 1];
    await game.loadGame(`game/${selectedGame}/`);
    game.gameLoop(); // Start the game loop after loading the game
  } else {
    console.log("Invalid game selection.");

    // List games again if the selection is invalid
    askQuestions();
  }
}

// Function to get a list of repositories with the tag 'arga-game-production'
async function getGameList() {
  const cacheFile = path.join("cache", "game_list.json");

  return fetch(
    "https://api.github.com/search/repositories?q=topic:arga-game-production",
    {
      headers: {
        "User-Agent": "node.js",
      },
    }
  )
    .then((res) => res.json())
    .then(async (response) => {
      if (!response.items) {
        throw new Error("Invalid response from GitHub API");
      }

      const gameList = [];
      for (const repo of response.items) {
        gameList.push({
          name: repo.name,
          repo_url: repo.html_url,
        });
      }

      fs.writeFileSync(cacheFile, JSON.stringify(gameList));
      return gameList;
    })
    .catch((error) => {
      log("Error fetching game list from GitHub:", "fgWhite", "bgRed");
      log(error, "fgWhite", "bgRed");
      log("Loading games from cache...", "fgWhite", "bgRed");
      return JSON.parse(fs.readFileSync(cacheFile, "utf-8")).then(
        (gameList) => {
          return gameList;
        }
      );
    });
}

function deleteGame(gameIndex) {
  const games = fs.readdirSync("game");

  if (gameIndex >= 1 && gameIndex <= games.length) {
    const gameToDelete = games[gameIndex - 1];
    fs.rmdirSync(path.join("game", gameToDelete), { recursive: true });
    return console.log(`Game ${gameToDelete} deleted successfully.`);
  } else {
    console.log("Invalid game selection.");
  }
}
async function cloneGame(repoURL, dest) {
  if (fs.existsSync(dest)) {
    const update = await askQuestion(
      "The game already exists. Do you want to update it? (y/n): "
    );
    if (update.toLowerCase() === "y") {
      try {
        await new Promise((resolve, reject) => {
          exec(`git -C ${dest} pull`, (error, stdout, stderr) => {
            if (error) {
              console.error(`Error updating repository: ${error.message}`);
              reject(error);
              return;
            }
            if (stderr) {
              console.error(`Updating warning: ${stderr}`);
            }
            console.log(`Repository updated successfully: ${repoURL}`);
            resolve();
          });
        });
      } catch (error) {
        console.error("Error updating the game:", error);
        throw error;
      }
    }
  } else {
    try {
      await new Promise((resolve, reject) => {
        exec(`git clone ${repoURL} ${dest}`, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error cloning repository: ${error.message}`);
            reject(error);
            return;
          }
          if (stderr) {
            console.error(`Cloning warning: ${stderr}`);
          }
          console.log(`Repository cloned successfully: ${repoURL}`);
          resolve();
        });
      });
    } catch (error) {
      console.error("Error cloning the game:", error);
      throw error;
    }
  }
}

// List all games
listGames();
function askQuestion(question) {
  return new Promise((resolve) =>
    rl.question(question, (answer) => {
      resolve(answer);
    })
  ).catch((error) => {
    log("Error during user input:", error, "fgWhite", "bgRed");
    throw error; // Rethrow the error after logging it.
  });
}

function askQuestions() {
  askQuestion(
    "Enter the number of the game you want to play or 0 to clone a new game: "
  ).then(async (answer) => {
    if (answer === "0") {
      const gameList = await getGameList();
      gameList.forEach((game, index) => {
        console.log(`${index + 1}. ${game.name}`);
      });

      const gameIndex = await askQuestion(
        "Enter the number of the game you want to clone: "
      );
      const selectedGame = gameList[gameIndex - 1];
      const url = selectedGame.repo_url;
      const dest = `game/${selectedGame.name}`;

      console.log("Cloning the game repository, please wait...");
      await cloneGame(url, dest);
      console.log(`Game repository cloned to ${dest}`);
      listGames(); // List games after cloning
      askQuestions();
    } else if (answer.toLowerCase() === "u") {
      console.log("Updating all game repositories, please wait...");
      await updateAllGames();
      console.log(`All game repositories updated`);
      listGames(); // List games after updating
      askQuestions();
    } else if (answer.toLowerCase() === "d") {
      const gameIndex = await askQuestion(
        "Enter the number of the game you want to delete: "
      );
      deleteGame(parseInt(gameIndex, 10));
      listGames(); // List games after deleting
      askQuestions();
    } else {
      loadGame(parseInt(answer, 10));
    }
  });
}

askQuestions();

function updateAllGames() {
  const games = fs.readdirSync("game");

  return Promise.all(
    games.map((game) => {
      const dest = `game/${game}`;
      return new Promise((resolve, reject) => {
        exec(`git -C ${dest} pull`, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error updating repository: ${error.message}`);
            reject(error);
            return;
          }
          if (stderr) {
            console.error(`Updating warning: ${stderr}`);
          }
          console.log(`Repository updated successfully: ${game}`);
          resolve();
        });
      });
    })
  );
}

game.gameLoop = function () {
  rl.question(`${this.lm.name}> `, (input) => {
    this.handleInput(input);
    this.gameLoop();
  });
};

process.on("uncaughtException", (err) => {
  log("Game Engine error:", "fgWhite", "bgRed");
  // at
  log(err.stack, "fgWhite", "bgRed");
  game.quit();
});

process.on("unhandledRejection", (reason, promise) => {
  log("========================================", "fgWhite", "bgRed");
  log("Game Engine : Unhandled Rejection at:", "fgWhite", "bgRed");
  log(`Reason: ${reason}`, "fgWhite", "bgRed");
  log(`Promise: ${promise}`, "fgWhite", "bgRed");
  log("========================================", "fgWhite", "bgRed");

  game.quit();
});

// handle process exit
process.on("exit", async (code) => {
  log(`Kernel Rechive Game Engine Exit with code ${code}`, "fgWhite", "bgRed");

  // make exit block
  await new Promise((resolve) => setTimeout(resolve, 1000));
});
