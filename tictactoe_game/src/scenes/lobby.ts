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
    public constructor(){
        super({key: "lobby"});
    }

    public init(){
        Lobby.instance = this
    }

    public create(){
        this.setupBackground()
        this.setUpContainers()
        this.matchedContainer.setVisible(false)
        NetworkManager.getInstance().connectToMatchMaker()
    }

    private setUpContainers(){
        this.searchContainer = this.add.container(0,0)
        this.matchedContainer = this.add.container(0,0)
    }

    private setupBackground(){
        let _bg = this.add.sprite(GameWidth * 0.5, GameHeight * 0.5, "menubg").setOrigin(0.5);
        let _title = this.add.bitmapText(GameWidth * 0.5, GameHeight * 0.3, FONT_FILES.BOTTOM_BOX_NUMBER_UN_SELECT, "LOBBY").setOrigin(0.5)
        this.lobbyText = this.add.bitmapText(GameWidth * 0.5, GameHeight * 0.5, FONT_FILES.BOTTOM_BOX_NUMBER_UN_SELECT, "FINDING MATCH...").setOrigin(0.5)
    }

    public matchNotFound(){
        this.lobbyText.text = "MATCH NOT FOUND"
    }

    public matchFound(matchData){
        
        GameManager.getInstance().setMatchId(matchData.match_id)

        if(matchData.players[0] == PlayerData.getInstance().getPlayerData.player_id){
            PlayerData.getInstance().setPlayerType = PLAYERTYPE.CREATOR
            PlayerData.getInstance().setPlayerTurn(true)
            PlayerData.getInstance().setOpponentData(matchData.players[1])
        }else{
            PlayerData.getInstance().setPlayerType = PLAYERTYPE.JOINEE        
            PlayerData.getInstance().setPlayerTurn(false) 
            PlayerData.getInstance().setOpponentData(matchData.players[0])
        }

        console.log("-----p", PlayerData.getInstance().getPlayerData)
        console.log("-----O", PlayerData.getInstance().getOpponentData)
        
        this.setupMatchedPlayerHUD(matchData)
    }
    
    public setupMatchedPlayerHUD(matchData){
        this.lobbyText.text = "MATCH FOUND"
        this.matchedContainer.setVisible(true);

        GameManager.getInstance().setMatchId(matchData.match_id)
        for(let i=0;i<matchData.players.length;i++){
            let playerDetails = getPlayerData(matchData.players[i])
            this.showMatchedHUD(playerDetails, i)
        }
        
        setTimeout(() => {
            this.scene.start("gameplay");
            this.scene.stop("lobby");
        }, 5000)
    }

    private showMatchedHUD(playerDetails, index){
        let name = playerDetails.name;
        let photo = playerDetails.photo;
        let playerID = index==0?"X":"O";

        let y = GameHeight*0.7 + index*200

        let playerAvatar = this.add.sprite(GameWidth*0.15, y, photo).setOrigin(0.5).setScale(0.25)
        let playerName = this.add.bitmapText(GameWidth * 0.5, y, FONT_FILES.PROFILE_NAME, name).setOrigin(0.5).setScale(1.2)
        let playerId = this.add.bitmapText(GameWidth * 0.8, y, FONT_FILES.PROFILE_NAME, playerID).setOrigin(0.5).setScale(1.2)

        this.matchedContainer.add(playerAvatar)        
        this.matchedContainer.add(playerName)        
        this.matchedContainer.add(playerId)        
    }


}