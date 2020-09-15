import 'phaser';
import Boot from "../src/scenes/boot";
import Lobby from "../src/scenes/lobby";
import Gameplay from "../src/scenes/gameplay";
import Menu from "../src/scenes/menu";

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#125555',
    width: 720,
    height: 1280,
    scene: [Boot, Menu, Lobby, Gameplay],
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH ,
        mode: Phaser.Scale.FIT,
        height: 1280,
        width: 720,
        parent: "game",
      },
};

const game = new Phaser.Game(config);
