import 'phaser';
import { GameWidth, GameHeight, FONT_FILES, PLAYER_SIGN, PLAYERTYPE } from '../utils/constants';
import {Cell} from "../gameobjects/cell"
import PlayerData from "../utils/playerData"
import {GameManager} from "../manager/game_manager"
import { NetworkManager } from '../manager/network_manager';

export default class Gameplay extends Phaser.Scene{
    private currentTurnText: Phaser.GameObjects.BitmapText
    private cellList: Cell[];
    public static instance: Gameplay
    public constructor(){
        super({key: "gameplay"});
    }

    public init(){
        Gameplay.instance = this
    }

    public create(){
        this.setupBackground()
        this.setUpGameBoard()
        this.showCurrentTurn()
    }

    private setupBackground(){
        let _bg = this.add.sprite(GameWidth * 0.5, GameHeight * 0.5, "menubg").setOrigin(0.5);
        let _title = this.add.bitmapText(GameWidth * 0.5, 30, FONT_FILES.BOTTOM_BOX_NUMBER_UN_SELECT, PLAYER_SIGN[PlayerData.getInstance().getPlayerType]).setOrigin(0.5)
    }

    private setUpGameBoard(){
        let index = 0
        let startX = 75
        let startY = 180
        let width = 150
        let gap = 60
        this.cellList = []
        for(let i=0;i<3;i++){
            for(let j=0;j<3;j++){
                let x = startX + j*150 + j*gap;
                let y = startY + i*150 + i*gap;
                let cell = new Cell(this,x,y,"b",index,1);
                this.cellList.push(cell)
                this.cellList[index].getGameObject().on('pointerup',this.tileControl.bind(this,index),this)
                index += 1
            }
        }
    }

    public setCellTexture(index, sign){
        this.cellList[index].cellClicked(sign);
    }

    private tileControl(tileIndex){
        let cell = this.cellList[tileIndex].getGameObject()
        if(PlayerData.getInstance().PlayerTurn() && !GameManager.getInstance().isGameOver() &&  cell.input.enabled){

            cell.disableInteractive()
            cell.setTexture(PLAYER_SIGN[PlayerData.getInstance().getPlayerType])
            
            PlayerData.getInstance().setPlayerTurn(false)

            PlayerData.getInstance().setPlayerScore(PlayerData.getInstance().getPlayerScore() + Math.pow(2,tileIndex))

            // send to server
            NetworkManager.getInstance().sendToServer({
                event: "move",
                message: {index: tileIndex} 
            })
        }
    }

    public showGameOver(player_id){
        console.log("DSB: Gameplay -> showGameOver -> player_id", player_id);
        GameManager.getInstance().setGameOver(true)
        if(player_id){
            if(player_id == PlayerData.getInstance().getPlayerData.player_id){
                this.currentTurnText.text = "YOU WON!!"
                GameManager.getInstance().setMatchWon(1)
            }else{
                this.currentTurnText.text = "YOU LOST!!"
                GameManager.getInstance().setMatchWon(2)
            }
        }else{
            this.currentTurnText.text = "DRAW!!"
            GameManager.getInstance().setMatchWon(0)
        }

        // let goToMenuBtn = this.add.sprite(GameWidth * 0.5,GameHeight * 0.85 ,"btn_up").setOrigin(0.5);
        // goToMenuBtn.setOrigin(0.5);
        // goToMenuBtn.setInteractive();
        // let goToMenuBtnText = this.add.bitmapText(goToMenuBtn.x, goToMenuBtn.y, FONT_FILES.TIMER_FONT, "HOME").setOrigin(0.5)
        // goToMenuBtn.on("pointerdown", (pointer, x, y, event) => {
        //     goToMenuBtn.setTexture("btn_down")
        //     goToMenuBtnText.y = goToMenuBtn.y + 10
        // })
        // goToMenuBtn.on("pointerup",(pointer,x,y,event)=>{
        //     goToMenuBtn.setTexture("btn_up")
        //     goToMenuBtnText.y = goToMenuBtn.y
        //     this.scene.start("menu");
        //     this.scene.stop("gameplay");
        // })
    }

    private showCurrentTurn(){
        this.currentTurnText = this.add.bitmapText(
            GameWidth*0.5, 
            GameHeight*0.75, 
            FONT_FILES.BOTTOM_BOX_NUMBER_UN_SELECT, 
            GameManager.getInstance().getTurnText()
            ).setOrigin(0.5)
    }

    public update(){
        if(!GameManager.getInstance().isGameOver()){
            this.currentTurnText.text =  GameManager.getInstance().getTurnText()
        }else{
            if(GameManager.getInstance().getMatchWon() == 0){
                this.currentTurnText.text = "DRAW!!"
            }else if(GameManager.getInstance().getMatchWon() == 1){
                this.currentTurnText.text = "YOU WON!!"
            }else if(GameManager.getInstance().getMatchWon() == 2){
                this.currentTurnText.text = "YOU LOST!!"

            }
        }
    }


}