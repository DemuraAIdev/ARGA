const fs = require("fs");
const zlib = require("zlib");
const path = require("path");
const stream = require("stream");
const util = require("util");
const pipeline = util.promisify(stream.pipeline);
const GameEngine = require("./core/GameEngine");
const game = new GameEngine();
const { log } = require("./lib/Console");
const readline = require("readline");
const { mkdir } = require("fs/promises");
const { Readable } = require("stream");
const { finished } = require("stream/promises");

// Create necessary folders if they do not exist
["game", "save", "cache"].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
});

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

// Function to get a list of repositories with the tag 'arga-game-production'
async function getGameList() {
  const cacheFile = path.join("cache", "game_list.json");

  // Check if cache exists and is not older than 24 hours
  if (fs.existsSync(cacheFile)) {
    const stats = fs.statSync(cacheFile);
    const age = Date.now() - stats.mtimeMs;
    if (age < 24 * 60 * 60 * 1000) {
      return JSON.parse(fs.readFileSync(cacheFile, "utf-8"));
    }
  }

  return fetch(
    "https://api.github.com/search/repositories?q=topic:arga-game-production",
    {
      headers: {
        "User-Agent": "node.js",
        Accept: "application/vnd.github.v3+json",
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
        const release = await getLatestRelease(repo.owner.login, repo.name);
        if (release) {
          gameList.push({
            name: repo.name,
            tarball_url: release.tarball_url,
          });
        }
      }

      fs.writeFileSync(cacheFile, JSON.stringify(gameList));
      return gameList;
    })
    .catch((error) => {
      log("Error fetching game list from GitHub:", "fgWhite", "bgRed");
      log(error.message, "fgWhite", "bgRed");
      throw error; // Rethrow the error after logging it.
    });
}

async function getLatestRelease(owner, repo) {
  return fetch(
    `https://api.github.com/repos/${owner}/${repo}/releases/latest`,
    {
      headers: {
        "User-Agent": "node.js",
      },
    }
  )
    .then((res) => res.json())
    .then((releaseInfo) => {
      return {
        tarball_url: releaseInfo.tarball_url,
      };
    })
    .catch((error) => {
      return null; // No release found or error occurred
    });
}

// Function to download the tar.gz file of the latest release of the selected repository
async function downloadGame(url, dest) {
  const response = await fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error(`Failed to get '${url}' (${res.status})`);
    }
    return res;
  });
  if (!response.ok) {
    throw new Error(`Failed to get '${url}' (${response.status})`);
  }

  const fileStream = fs.createWriteStream(dest);
  await new Promise((resolve, reject) => {
    response.body.pipe(fileStream);
    response.body.on("error", (err) => {
      reject(err);
    });
    fileStream.on("finish", () => {
      resolve();
    });
  });
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

askQuestion(
  "Enter the number of the game you want to play or 0 to download a new game: "
).then(async (answer) => {
  if (answer === "0") {
    // try {
    const gameList = await getGameList();
    gameList.forEach((game, index) => {
      console.log(`${index + 1}. ${game.name}`);
    });

    const gameIndex = await askQuestion(
      "Enter the number of the game you want to download: "
    );
    const selectedGame = gameList[gameIndex - 1];
    const url = selectedGame.tarball_url;
    const dest = `game/${selectedGame.name}.tar.gz`;

    console.log("Downloading the game, please wait...");
    await downloadGame(url, dest);
    console.log(`Game downloaded to ${dest}`);

    // Optionally, update the game list to include the new download
    games.push(selectedGame.name);
    // } catch (error) {
    //   log(
    //     "An error occurred while downloading the game:",
    //     error,
    //     "fgWhite",
    //     "bgRed"
    //   );
    // }
  } else {
    loadGame(parseInt(answer, 10));
  }
});

game.gameLoop = function () {
  rl.question(`${this.lm.name}> `, (input) => {
    this.handleInput(input);
    this.gameLoop();
  });
};

class TarExtractor {
  static async extract(source, destination) {
    await pipeline(
      fs.createReadStream(source),
      zlib.createGunzip(),
      fs.createWriteStream(destination)
    );
  }
}

process.on("uncaughtException", (err) => {
  log("Game Engine error:", "fgWhite", "bgRed");
  log(err, "fgWhite", "bgRed");
  game.quit();
});

process.on("unhandledRejection", (reason, promise) => {
  log("Game Engine : Unhandled Rejection at:", "fgWhite", "bgRed");
  log("Reason: ", reason, "fgWhite", "bgRed");
  log("Promise: ", promise, "fgWhite", "bgRed");

  game.quit();
});

// handle process exit
process.on("exit", async (code) => {
  log(`Kernel Rechive Game Engine Exit with code ${code}`, "fgWhite", "bgRed");

  // make exit block
  await new Promise((resolve) => setTimeout(resolve, 1000));
});
