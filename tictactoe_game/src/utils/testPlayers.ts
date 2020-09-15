export const players = [
    {player_id: "gp_00", name: "TESTPLAYER_00", photo:"avatar5"},
    {player_id: "gp_01", name: "TESTPLAYER_01", photo:"avatar4"},
    {player_id: "gp_02", name: "TESTPLAYER_02", photo:"avatar3"},
    {player_id: "gp_03", name: "TESTPLAYER_03", photo:"avatar4"},
    {player_id: "gp_04", name: "TESTPLAYER_04", photo:"avatar6"},
    {player_id: "gp_05", name: "TESTPLAYER_05", photo:"avatar3"},
    {player_id: "gp_06", name: "TESTPLAYER_06", photo:"avatar4"},
    {player_id: "gp_07", name: "TESTPLAYER_07", photo:"avatar3"},
    {player_id: "gp_08", name: "TESTPLAYER_08", photo:"avatar2"},
    {player_id: "gp_09", name: "TESTPLAYER_09", photo:"avatar5"},
    {player_id: "gp_10", name: "TESTPLAYER_10", photo:"avatar4"},
    {player_id: "gp_11", name: "TESTPLAYER_11", photo:"avatar3"},
    {player_id: "gp_12", name: "TESTPLAYER_12", photo:"avatar4"},
    {player_id: "gp_13", name: "TESTPLAYER_13", photo:"avatar6"},
    {player_id: "gp_14", name: "TESTPLAYER_14", photo:"avatar3"},
    {player_id: "gp_15", name: "TESTPLAYER_15", photo:"avatar4"},
    {player_id: "gp_16", name: "TESTPLAYER_16", photo:"avatar3"},
    {player_id: "gp_17", name: "TESTPLAYER_17", photo:"avatar4"},
    {player_id: "gp_18", name: "TESTPLAYER_18", photo:"avatar3"},
    {player_id: "gp_19", name: "TESTPLAYER_19", photo:"avatar2"},
    {player_id: "gp_20", name: "TESTPLAYER_20", photo:"avatar2"}
]

export function getTestPlayers (count: number){
    let playerList = []
    playerList.push(players[0])
    let pltemp = players.slice(1)
    for(let i=0;i<count-1;i++){
        let idx = Math.floor(Math.random()*pltemp.length)
        playerList.push(pltemp[idx])
        pltemp.splice(idx,1)
    }
    return playerList
}

export function getPlayer (){
    let idx = Math.floor(Math.random()*players.length)
    return players[idx]
}

export function getPlayerData(player_id: string) {
    for(let i = 0; i< players.length; i++){
        if(players[i].player_id == player_id){
            return players[i]
        }
    }
}

export function getRandomMatchData(playerCount) {
    let testPlayers = getTestPlayers(playerCount);
    let playerIdList = []
    for(let i=0; i< playerCount;i++){
        playerIdList.push(testPlayers[i].player_id);
    }
    let match_id = String(Math.floor(Math.random()*100))
    return {
        match_id: match_id,
        players: playerIdList
    }
}

export function getRandomMatchDataForPlayer(player_details) {
    let randomPlayer = getPlayer()
    while(randomPlayer.player_id == player_details.player_id){
        randomPlayer = getPlayer()
    }
    let match_id = String(Math.floor(Math.random()*100))
    return {
        match_id: match_id,
        players: [player_details.player_id, randomPlayer.player_id]
    }
}
