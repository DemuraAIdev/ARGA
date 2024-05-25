# ARGA GameEngine

ARGA GameEngine is a text-based adventure game engine. It allows you to create and play interactive fiction games in a structured way. The engine is written in JavaScript and can be easily extended to support new features.

## Structure

The project is structured into several directories:

- `core/`: Contains the main game engine code.
- `game/`: Contains the game data for different games.
- `lib/`: Contains utility functions and classes.
- `save/`: Contains saved game states.

## How to Run

To run a game, you need to have Node.js installed on your machine. Once you have Node.js installed, you can run a game using the following command:

```sh
npm start
```

This will start the game engine and prompt you to select a game to play.

## How to Build the Project

To build the project into an executable file, you can use the build script in the package.json file:

```sh
npm run build
```

This will create an executable file named arga.exe that you can run to play the game without needing to have Node.js installed.
