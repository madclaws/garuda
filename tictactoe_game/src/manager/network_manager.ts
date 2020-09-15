import { GameManager } from "./game_manager";
import { Garuda } from "garudajs"
import PlayerData from "../utils/playerData";
import Lobby from "../scenes/lobby";
import Gameplay from "../scenes/gameplay";

export class NetworkManager{
    private static _instance: NetworkManager = null;
    private garudaSocket: any
    private matchmakerChannel: any
    private gameChannel: any
    private gameManager: GameManager
    public static getInstance(): NetworkManager {

        if (NetworkManager._instance === null) {
            NetworkManager._instance = new NetworkManager();
        }

        return NetworkManager._instance;
    }

    constructor() {
        NetworkManager._instance = this;
    }


    public init(): void {
        this.garudaSocket = new Garuda({
            socketUrl: "ws://localhost:4000/socket"
        })
    }

    public connectToMatchMaker(){
        this.garudaSocket.getGameChannel("tictactoe", {
            maxPlayers: 2,
            playerId: PlayerData.getInstance().getPlayerData.player_id
        }, this.onMatchMade)
    }

    private onMatchMade(gameChannel, message) {
        console.log("DSB: NetworkManager -> onMatchMade -> message", message);
        console.log("DSB: NetworkManager -> onMatchMade -> gameChannel", gameChannel);

        NetworkManager.getInstance().gameChannel = gameChannel
        
        if(gameChannel){
            Lobby.instance.matchFound(message)
            gameChannel.join()
                .receive("ok", resp => { 
                    console.log("Joined successfully", resp)
                    NetworkManager.getInstance().sendToServer({
                        event: "add_player",
                        message: {player_id: PlayerData.getInstance().getPlayerData.player_id} 
                    })
                })
                .receive("error", resp => { console.log("Unable to join", resp) })

            gameChannel.on("moved", message =>{
                console.log("---------------------DSB: NetworkManager -> onMatchMade -> message", message);
                let playerId = message.player_id
                let index = message.index
                if(playerId != PlayerData.getInstance().getPlayerData.player_id){
                    GameManager.getInstance().updateCellTexture(index)
                    PlayerData.getInstance().setPlayerTurn(true) 
                }
                let gameoverData = message.gameover
                let gameover = gameoverData[0]
                let lastTurnId = gameoverData[1]
                if(gameover){
                    NetworkManager.getInstance().garudaSocket.leaveGameChannel()
                    Gameplay.instance.showGameOver(lastTurnId)
                    GameManager.getInstance().setGameOver(true)
                    if(lastTurnId){
                        if(lastTurnId == PlayerData.getInstance().getPlayerData.player_id){
                            console.log("you won")
                        }else{
                            console.log("you lost")
                        }
                    }else{
                        console.log("draw")
                    }
                }else{
                    console.log("carry on->->->")
                }
            })
        }else{
            Lobby.instance.matchNotFound()
        }
      }

    public sendToServer(client_msg: any):void{
        NetworkManager.getInstance().gameChannel.push(
            client_msg.event, client_msg.message
        )
    }
}