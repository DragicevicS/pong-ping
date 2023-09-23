import Phaser from "phaser";
import MainScene from "./src/MainScene";

const config = {
  type: Phaser.AUTO,
  width: 900,
  height: 500,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scene: [MainScene],
  parent: "game-div",
  backgroundColor: "black",
};

const game = new Phaser.Game(config);
