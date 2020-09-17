import 'phaser';
import { GameWidth, GameHeight, FONT_FILES, PLAYER_SIGN, PLAYERTYPE } from '../utils/constants';
import {Cell} from "../gameobjects/cell"
import PlayerData from "../utils/playerData"
import {GameManager} from "../manager/game_manager"
import { NetworkManager } from '../manager/network_manager';

export default class Gameplay extends Phaser.Scene{
    private currentTurnText: Phaser.GameObjects.BitmapText
    private gameoverButtonContainer: Phaser.GameObjects.Container
    private cellList: Cell[];
    public static instance: Gameplay
    private goToHomeButton: Phaser.GameObjects.Sprite
    public constructor(){
        super({key: "gameplay"});
    }

    public init(){
        Gameplay.instance = this
        this.cellList = []
        GameManager.getInstance().setGameOver(false)
    }

    public create(){
        this.setupBackground()
        this.setUpGameBoard()
        this.showCurrentTurn()
        this.setUpButtons()
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

        this.gameoverButtonContainer.setVisible(true)
       
    }

    private showCurrentTurn(){
        this.currentTurnText = this.add.bitmapText(
            GameWidth*0.5, 
            GameHeight*0.75, 
            FONT_FILES.BOTTOM_BOX_NUMBER_UN_SELECT, 
            GameManager.getInstance().getTurnText()
            ).setOrigin(0.5)
    }

    private setUpButtons(){
        this.gameoverButtonContainer = this.add.container(0,0)
        this.goToHomeButton = this.add.sprite(GameWidth * 0.5,GameHeight * 0.85 ,"btn_up").setOrigin(0.5);
        this.goToHomeButton.setOrigin(0.5);
        this.goToHomeButton.setInteractive();
        let goToHomeButtonText = this.add.bitmapText(this.goToHomeButton.x, this.goToHomeButton.y, FONT_FILES.TIMER_FONT, "HOME").setOrigin(0.5)
        this.goToHomeButton.on("pointerdown", (pointer, x, y, event) => {
            if(!this.goToHomeButton.visible) return
            this.goToHomeButton.setTexture("btn_down")
            goToHomeButtonText.y = this.goToHomeButton.y + 10
        })
        this.goToHomeButton.on("pointerup",(pointer,x,y,event)=>{
            if(!this.goToHomeButton.visible) return
            this.goToHomeButton.setTexture("btn_up")
            goToHomeButtonText.y = this.goToHomeButton.y
            this.scene.start("menu");
            this.scene.stop("gameplay");
        })
        this.gameoverButtonContainer.add(this.goToHomeButton)
        this.gameoverButtonContainer.add(goToHomeButtonText)
        this.gameoverButtonContainer.setVisible(false)
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