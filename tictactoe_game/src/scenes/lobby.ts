import 'phaser';
import { GameManager } from '../manager/game_manager';
import { NetworkManager } from '../manager/network_manager';
import { GameWidth, GameHeight, FONT_FILES, PLAYERTYPE } from '../utils/constants';
import PlayerData from '../utils/playerData';
import { getTestPlayers, getPlayerData, getRandomMatchData, getRandomMatchDataForPlayer } from "../utils/testPlayers";
export default class Lobby extends Phaser.Scene{

    private lobbyText: Phaser.GameObjects.BitmapText
    private searchContainer: Phaser.GameObjects.Container
    private matchedContainer: Phaser.GameObjects.Container
    public static instance: Lobby
    private startGameButtonContainer: Phaser.GameObjects.Container;
    private startGameButton: Phaser.GameObjects.Sprite;
    private addPlayer: boolean = false
    public constructor(){
        super({key: "lobby"});
    }

    public init(){
        Lobby.instance = this
        this.addPlayer = false
    }

    public create(){
        this.setupBackground()
        this.setUpContainers()
        this.matchedContainer.setVisible(false)
        NetworkManager.getInstance().connectToMatchMaker()
        this.setUpButtons();
    }

    private setUpContainers(){
        this.searchContainer = this.add.container(0,0)
        this.matchedContainer = this.add.container(0,0)
    }

    private setupBackground(){
        let _bg = this.add.sprite(GameWidth * 0.5, GameHeight * 0.5, "menubg").setOrigin(0.5);
        let _title = this.add.bitmapText(GameWidth * 0.5, GameHeight * 0.2, FONT_FILES.BOTTOM_BOX_NUMBER_UN_SELECT, "LOBBY").setOrigin(0.5)
        this.lobbyText = this.add.bitmapText(GameWidth * 0.5, GameHeight * 0.3, FONT_FILES.HINT_FONT, "FINDING MATCH...")
        .setOrigin(0.5)
    }

    private setUpButtons(){
        this.startGameButtonContainer = this.add.container(0,0)
        this.startGameButton = this.add.sprite(GameWidth * 0.5,GameHeight * 0.85 ,"btn_up").setOrigin(0.5);
        this.startGameButton.setOrigin(0.5);
        this.startGameButton.setInteractive();
        let startGameButtonText = this.add.bitmapText(this.startGameButton.x, this.startGameButton.y, FONT_FILES.TIMER_FONT, "READY").setOrigin(0.5)
        this.startGameButton.on("pointerdown", (pointer, x, y, event) => {
            if(!this.startGameButton.visible) return
            this.startGameButton.setTexture("btn_down")
            startGameButtonText.y = this.startGameButton.y + 10
        })
        this.startGameButton.on("pointerup",(pointer,x,y,event)=>{
            if(!this.startGameButton.visible) return
            if(this.addPlayer) return
            this.addPlayer = true
            // NetworkManager.getInstance().sendToServer({
            //     event: "add_player",
            //     message: {player_id: PlayerData.getInstance().getPlayerData.player_id} 
            // })
        })
        this.startGameButtonContainer.add(this.startGameButton)
        this.startGameButtonContainer.add(startGameButtonText)
        this.startGameButtonContainer.setVisible(false)
    }

    public matchNotFound(){
        this.lobbyText.text = "MATCH NOT FOUND"
    }

    public matchFound(matchData){
        
        GameManager.getInstance().setMatchId(matchData.match_id)
        this.startGameButtonContainer.setVisible(true)

        if(matchData.players[0] == PlayerData.getInstance().getPlayerData.player_id){
            PlayerData.getInstance().setOpponentData(matchData.players[1])
        }else{
            PlayerData.getInstance().setOpponentData(matchData.players[0])
        }

        console.log("-----p", PlayerData.getInstance().getPlayerData)
        console.log("-----O", PlayerData.getInstance().getOpponentData)
        
        this.setupMatchedPlayerHUD(matchData)
    }

    public startGame(playerList){
        console.log("DSB: Lobby -> startGame -> playerList", playerList);
        if(playerList[0] == PlayerData.getInstance().getPlayerData.player_id){
            PlayerData.getInstance().setPlayerType = PLAYERTYPE.CREATOR
            PlayerData.getInstance().setPlayerTurn(true)
        }else{
            PlayerData.getInstance().setPlayerType = PLAYERTYPE.JOINEE        
            PlayerData.getInstance().setPlayerTurn(false) 
        }
        // setTimeout(() => {
            this.scene.start("gameplay");
            this.scene.stop("lobby");
        // }, 5000)
    }
    
    public setupMatchedPlayerHUD(matchData){
        this.lobbyText.text = "MATCH FOUND"
        this.matchedContainer.setVisible(true);

        GameManager.getInstance().setMatchId(matchData.match_id)
        for(let i=0;i<matchData.players.length;i++){
            let playerDetails = getPlayerData(matchData.players[i])
            this.showMatchedHUD(playerDetails, i)
        }
        
    }

    private showMatchedHUD(playerDetails, index){
        let name = playerDetails.name;
        let photo = playerDetails.photo;
        // let playerID = index==0?"X":"O";

        let y = GameHeight*0.5 + index*200

        let playerAvatar = this.add.sprite(GameWidth*0.15, y, photo).setOrigin(0.5).setScale(0.25)
        let playerName = this.add.bitmapText(GameWidth * 0.5, y, FONT_FILES.PROFILE_NAME, name).setOrigin(0.5).setScale(1.2)
        // let playerId = this.add.bitmapText(GameWidth * 0.8, y, FONT_FILES.PROFILE_NAME, playerID).setOrigin(0.5).setScale(1.2)

        this.matchedContainer.add(playerAvatar)        
        this.matchedContainer.add(playerName)        
        // this.matchedContainer.add(playerId)        
    }


}