import { Injectable, Inject } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseRef } from 'angularfire2';

@Injectable()
export class CalculateRankingNew {
	allPlayers$ : FirebaseListObservable<any>;
	allTournaments$ : FirebaseListObservable<any>;
	root;
	playerList : any[] = [];
	tournamentList : any[] = [];
	/*constructor(af : AngularFire, @Inject(FirebaseRef) ref){
		this.allPlayers$ = af.database.list('/players');
		this.allTournaments$ = af.database.list('/tournaments');
		this.root = ref.database();
	}*/
	constructor(p,t){
		this.playerList = p;
		this.tournamentList = t;
	}

	public addTotalScore() : any[]{
		this.playerList.forEach((player)=>{
			player.overallScore = 0;
			// If the player participated in a tournament
			if(player.tournamentHistory){
				player.tournamentHistory.forEach((tournament) =>{
					player.overallScore += tournament.score;
				});
			}
			console.log(player.firstName, player.overallScore);
		});
		return this.playerList;
	}

	public determineOverallRank() : any[]{
		this.playerList.sort((a,b)=>{
			// If same overall score, break tie with match wins
			if(b.overallScore === a.overallScore){
				return (b.matchWIns - a.matchWins);
			}
			return (b.overallScore - a.overallScore);
		}).forEach((player, index)=>{
			player.overallRanking = index + 1;
			//console.log('player',player.firstName, player.overallScore);
		});
		return this.playerList;
	}

}