import 'phaser';
import {GameHeight, GameWidth, FONT_FILES, PLAYERTYPE} from "../utils/constants";
import PlayerData from '../utils/playerData';
// import Network from "../network";

export default class Menu extends Phaser.Scene{

    private buttton:Phaser.GameObjects.Sprite;
    public static instance: Menu
    public constructor(){
        super({key: "menu"});
    }

    public init(){
        // Network.getInstance().init();
    }

    public create(){
        this.setupBackground()
        this.setupButtons()
    }

    private setupBackground(){
        PlayerData.getInstance().setPlayerType = PLAYERTYPE.CREATOR


        let _bg = this.add.sprite(GameWidth * 0.5, GameHeight * 0.5, "menubg").setOrigin(0.5);
        let _title = this.add.bitmapText(GameWidth * 0.5, GameHeight * 0.2, FONT_FILES.BOTTOM_BOX_NUMBER_UN_SELECT, "TIC TAC TOE").setOrigin(0.5)
    }

    private setupButtons(){
        let _this = this;

        let findMatchBtn = this.add.sprite(GameWidth * 0.5,GameHeight * 0.85 ,"btn_up").setOrigin(0.5);
        findMatchBtn.setOrigin(0.5);
        findMatchBtn.setInteractive();
        let findMatchBtnText = this.add.bitmapText(findMatchBtn.x, findMatchBtn.y, FONT_FILES.TIMER_FONT, "FIND MATCH").setOrigin(0.5)
        findMatchBtn.on("pointerdown", (pointer, x, y, event) => {
            findMatchBtn.setTexture("btn_down")
            findMatchBtnText.y = findMatchBtn.y + 10
        })
        findMatchBtn.on("pointerup",(pointer,x,y,event)=>{
            findMatchBtn.setTexture("btn_up")
            findMatchBtnText.y = findMatchBtn.y
            this.scene.start("lobby");
            this.scene.stop("menu");
            // _this.startGameplay(findMatchBtn, DIFFICULTY.EASY)
            // AudioManager.getAudioInstance(this).playClick();
        })
    }
}