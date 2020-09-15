import {IUserData} from  "../utils/interfaces";
import { PLAYERTYPE } from "./constants";
import { getPlayerData } from "./testPlayers";
export default class PlayerData{
    private playerScore: number = 0
    private PlayerType: PLAYERTYPE = PLAYERTYPE.NONE
    private playerTurn: boolean = false
    private playerCount: number = 0
    private allPlayers: any[] = []
    private opponentPlayers: any[] = []
    private static _instance: PlayerData = null
    public static getInstance(){
        if(this._instance === null){
            this._instance = new PlayerData
        }
        return this._instance				
    }

    public constructor(){
    }

    public playerData: IUserData ={
        player_id:"",
        name:"",
        photo:"",
    }
    public opponentData: IUserData ={
        player_id:"",
        name:"",
        photo:"",
    }

    public get getPlayerType(){
        return this.PlayerType;
    }
    
    public set setPlayerType(_pt : PLAYERTYPE) {
        this.PlayerType = _pt
    }
    
    public get getOpponentType(){
        if(PlayerData.getInstance().getPlayerType == PLAYERTYPE.CREATOR){
            return PLAYERTYPE.JOINEE
        }else if(PlayerData.getInstance().getPlayerType == PLAYERTYPE.JOINEE){
            return PLAYERTYPE.CREATOR
        }
    }

    public get getPlayerData(){
        return this.playerData;
    }

    public get getOpponentData(){
        return this.opponentData
    }

    public setOpponentData(player_id){
        this.opponentData = getPlayerData(player_id)
    }

    public setPlayerScore(score: number){
        this.playerScore = score
    } 

    public getPlayerScore(){
        return this.playerScore
    }
     
    public setPlayerTurn(_turn:boolean){
        this.playerTurn = _turn
    }
    public PlayerTurn(){
        return this.playerTurn
    } 

}
