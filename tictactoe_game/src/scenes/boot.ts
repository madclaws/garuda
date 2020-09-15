import 'phaser';
import { NetworkManager} from '../manager/network_manager';
import {FONT_FILES} from "../utils/constants";
import PlayerData from '../utils/playerData';
import { getPlayer } from '../utils/testPlayers';

export default class Boot extends Phaser.Scene{

    private buttton:Phaser.GameObjects.Sprite;

    public constructor(){
        super({key: "boot"});
    }

    public preload(){
        this.pseudoLogin();
        this.loadAssets();
        this.load.on("complete", this.onAllFilesLoaded.bind(this));
    }

    private pseudoLogin(){
        let randomPlayerDetails = getPlayer()
        PlayerData.getInstance().playerData = randomPlayerDetails
        NetworkManager.getInstance().init();
    }

    private loadAssets(){
        this.loadSprites();
        this.loadBitmapFonts();
    }

    private loadSprites(){
        this.load.image("avatar1", "./assets/avatars/1.png");
        this.load.image("avatar2", "./assets/avatars/2.png");
        this.load.image("avatar3", "./assets/avatars/3.png");
        this.load.image("avatar4", "./assets/avatars/4.png");
        this.load.image("avatar5", "./assets/avatars/5.png");
        this.load.image("avatar6", "./assets/avatars/6.png");
        this.load.image('title', './assets/sprites/title.png');
        this.load.image('menubg', './assets/sprites/menubg.png');
        this.load.image('gamebg', './assets/sprites/gamebg.png');
        this.load.image('btn_up', './assets/sprites/button_press0.png');
        this.load.image('btn_down', './assets/sprites/button_press1.png');
        this.load.image('b', './assets/sprites/b.png');
        this.load.image('x', './assets/sprites/x.png');
        this.load.image('o', './assets/sprites/o.png');
    }

    private loadBitmapFonts(){
        for(let i=0;i<Object.keys(FONT_FILES).length; i++){
            let key = Object.keys(FONT_FILES)[i]
            let file = FONT_FILES[key]
            this.load.bitmapFont(file, "./assets/font/"+ file +".png", "./assets/font/"+ file +".fnt");
        }
    }

    private onFileComplete(progress) {
        // GZLOADER.loadProcess(progress * 100);
      }

    private async onAllFilesLoaded(loader, totalComplete, totalFailed) {
        this.scene.start("menu");
        this.scene.stop("boot");
    }

    // public create(){
    //     this.add.text(400, 100, "MENU").setOrigin(0.5);
    //     this.buttton =  this.add.sprite(400,300, "buttonup").setOrigin(0.5);
    //     this.add.text(this.buttton.x, this.buttton.y, "start").setOrigin(0.5);
    //     this.buttton.setInteractive();
    //     this.buttton.on("pointerdown", ()=>{
    //         this.buttton.setTexture("buttondown");
    //     })
    //     this.buttton.on("pointerup", ()=>{
    //         this.buttton.setTexture("buttonup");
    //         this.scene.start("lobby");
    //         this.scene.stop("boot");
    //     })
    // }
}