import { Game } from "phaser"
import Gameplay from "../scenes/gameplay"
import { PLAYER_SIGN } from "../utils/constants"
import PlayerData from "../utils/playerData"

export class GameManager{
    private _isGameOver: boolean = false
    private _matchId: string = ""
    private _matchWon: number = 0 
    private static _instance: GameManager = null
    public static getInstance():GameManager{
        if(this._instance === null){
            this._instance = new GameManager
        }
        return this._instance
    }

    public setGameOver(isGameOver: boolean){
        this._isGameOver = isGameOver
    }

    public isGameOver():boolean{
        return this._isGameOver
    }

    public setMatchId(matchId: string){
        this._matchId = matchId
    }

    public getMatchId(){
        return this._matchId
    }

    public setMatchWon(matchWon){
        this._matchWon = matchWon
    }

    public getMatchWon(){
        return this._matchWon
    }

    public getTurnText(){
        if(PlayerData.getInstance().PlayerTurn()){
            return PLAYER_SIGN[PlayerData.getInstance().getPlayerType] + "'s turn"
        }else{
            return PLAYER_SIGN[PlayerData.getInstance().getOpponentType] + "'s turn"
        }
    }

    public checkGameOver(){
        let playerScore = PlayerData.getInstance().getPlayerScore()
        let winScores = [7,56,73,84,146,273,292,448]
        for(let i=0;i<winScores.length;i++){
            if((playerScore & winScores[i]) == winScores[i]){
                return true;
            }
        }
        return false;
    }

    public updateCellTexture(index){
        Gameplay.instance.setCellTexture(index, PLAYER_SIGN[PlayerData.getInstance().getOpponentType]);
    }
}