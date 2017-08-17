
interface PlayerTournament{
    byes : number, colors : string[], date : string, draws : number, id : number, losses : number, place : number, score : number, set : string, wins : number
}

interface Player {
   email?: string, firstName : string, firstPlaces : number, id : number, lastName : string, matchDraws : number, matchLosses : number, matchWins : number, nickName : string, overallRanking : number, overallScore : number, photoUrl : string, powerRanking : number, powerScore : number, tournamentHistory : PlayerTournament[], trackingSince : string, wonLastTournament : boolean 
}

interface PlayerNameInfo{
    firstName : string, lastName : string, nickName : string
}
interface Colors{
    red : boolean, black : boolean, green : boolean, blue : boolean, white : boolean	
}

interface PlayerForm{
    byes : number, colors : Colors[], draws : number, losses : number, player : number, playerNameInfo : PlayerNameInfo[], rank : number, score : number, wins : number
}

interface TournamentDetails{
    date : string, id : number, set : string
}

interface Tournament{
    playerFormsArray : PlayerForm, tournamentDetails : TournamentDetails
}

interface User{
    signedIn : boolean, isAdmin : boolean, email : string, uid : string
}

export {PlayerTournament, Player, PlayerNameInfo, Colors, PlayerForm, TournamentDetails, Tournament, User};
