import { Injectable, Inject } from '@angular/core';
import { FirebaseRef } from 'angularfire2';
import { PlayerTournament, Player, PlayerNameInfo, Colors, PlayerForm, TournamentDetails, Tournament } from './interface';

@Injectable()
export class CalculateRankingNew {
	root;
	playerList : Player[];
	tournamentList : any[] = [];
	constructor(@Inject(FirebaseRef) ref){
		this.root = ref.database();
	}
	//constructor(p,t){this.playerList = p;this.tournamentList = t;}

	public calculateRanking(){
		
		//all tournaments
		this.root.ref('tournaments/').once('value',(snap)=>{
			let tournaments = snap.val();
			this.tournamentList = tournaments.sort((a,b) =>{
				return b.id - a.id;
			});
			
			//get players from DB
			this.root.ref('players/').once('value',(snap)=>{
				this.playerList = snap.val();
				//Calculate Overall Score
				this.determineOverallScore();
				
				//Calculate Overall Rank
				this.determineOverallRank();
				
				//Calculate Power Score
				this.determinePowerScore();

				//Calculate Power Ranking
				this.determinePowerRanking();
			});
		});
	}
	

	private determineOverallScore() : Player[]{
		let playerList : any = this.playerList.forEach((player : Player)=>{
			player.overallScore = 0;
			// If the player participated in a tournament
			if(player.tournamentHistory){
				player.tournamentHistory.forEach((tournament) =>{
					player.overallScore += tournament.score;
				});
			}
			//console.log(player.firstName, player.overallScore);
		});
		return this.playerList;
	}

	private determineOverallRank() : Player[]{
		
		let playerList : any = this.playerList.sort((a : Player , b : Player)=>{
			// If same overall score, break tie with match wins
			if(b.overallScore === a.overallScore){
				// If same overall score AND same wins, break tie with least match losses
				if(b.matchWins === a.matchWins){
					return (a.matchLosses - b.matchLosses);
				}
				return (b.matchWins - a.matchWins);
			}
			return (b.overallScore - a.overallScore);
		}).forEach((player : Player, index : number)=>{
			player.overallRanking = index + 1;
			//console.log('player',player.firstName, player.overallScore);
			this.updateDbPlayerValue(player.id,"overallRanking",player.overallRanking);
		});
		
		return this.playerList;
	}

	private determinePowerScore() : Player[]{
		// Sort tournaments by id, which orders the latest tournaments with the highest id first
		this.tournamentList.sort((a : Tournament, b : Tournament)=>{
			return b.tournamentDetails.id - a.tournamentDetails.id;
		});

		let lastT = this.tournamentList[0];
		let secondLastT = this.tournamentList[1];

		// For each Player, determine tournament participation
		this.playerList.forEach(player=>{
			let playerTConfig : {lastT : boolean | PlayerTournament, secondLastT : boolean | PlayerTournament, oldTs : any[], totalTs : number} = {lastT : false, secondLastT : false, oldTs : [], totalTs : 0};
			player.tournamentHistory.forEach((t)=>{
				// If current tournament is defined, accounts for undefined spots in firebase
				if(t){
					if(t.id === lastT.tournamentDetails.id){
						playerTConfig.lastT = t;
					}else if(t.id === secondLastT.tournamentDetails.id){
						playerTConfig.secondLastT = t;
					}else{
						playerTConfig.oldTs.push(t);
					}
					playerTConfig.totalTs ++;
				}
			});
			// Determine appropriate algorithm then call it
			player.powerScore = this.algorithms(playerTConfig);
			this.updateDbPlayerValue(player.id,"powerScore",player.powerScore);
		});
		return this.playerList;
	}

	private determinePowerRanking() : Player[]{
		let powerRankingArray = this.playerList.sort((a,b)=>{
			return b.powerScore - a.powerScore;
		})
		powerRankingArray.forEach((player, i) =>{
			player.powerRanking = i +1;
			//Update Overall Ranking in DB
			this.updateDbPlayerValue(player.id,"powerRanking",player.powerRanking);
		});
		return this.playerList;
	}


	private algorithms(h){
		// Has only played in last T
		if(h.lastT && h.totalTs === 1){console.log('scenerio 1, lastOnly');

			let pp = this.pointsPossible(h.lastT);
			let updatedScore = +((h.lastT.score/pp) * 100).toFixed(2);
			//console.log('score', updatedScore);
			return updatedScore;

		// Has only played in the last two Ts
		}else if(h.lastT && h.secondLastT && h.totalTs === 2){console.log('scenerio 2, lastTwoOnly');
			const powerScore : {lastT : number, secondLastT : number} = {
				lastT : 0,
				secondLastT : 0
			};

			// Calculated Last Tournament Score
			let pp = this.pointsPossible(h.lastT);
			powerScore.lastT = +((h.lastT.score/pp) * 70).toFixed(2);

			// Calculated Second to Last Tournament Score
			pp = this.pointsPossible(h.secondLastT);
			powerScore.secondLastT  = +((h.secondLastT.score/pp) * 30).toFixed(2);

			//console.log(powerScore.lastT + powerScore.secondLastT);
			return powerScore.lastT + powerScore.secondLastT;
		
		// Has played in last two Ts and at least one more previous
		}else if(h.lastT && h.secondLastT && h.totalTs > 2){console.log('scenerio 3, lastTwoAndOlder');
			const powerScore : {lastT : number, secondLastT : number, olderTotal : number} = {
				lastT : 0,
				secondLastT : 0,
				olderTotal : 0
			};

			// Calculated Last Tournament Score
			let pp = this.pointsPossible(h.lastT);
			powerScore.lastT = +((h.lastT.score/pp) * 70).toFixed(2);

			// Calculated Second to Last Tournament Score
			pp = this.pointsPossible(h.secondLastT);
			powerScore.secondLastT  = +((h.secondLastT.score/pp) * 20).toFixed(2);

			// Calculated Older Tournament Scores
			h.oldTs.forEach(t =>{
				let pp = this.pointsPossible(t);
				powerScore.olderTotal += +((t.score/pp) * 10).toFixed(2);
			});
				
			//console.log('FINAL',powerScore.lastT + powerScore.secondLastT + (powerScore.olderTotal / h.oldTs.length));
			return powerScore.lastT + powerScore.secondLastT + (powerScore.olderTotal / h.oldTs.length);
		
		// Has played in only the second to last T
		}else if(h.secondLastT && h.totalTs === 1){console.log('scenerio 4, secondToLastOnly');
			let pp = this.pointsPossible(h.secondLastT);
			return +((h.secondLastT.score/pp) * 20).toFixed(2);

		// Has played in last T and at least 1 older T
		}else if(h.lastT && !h.secondLastT  && h.totalTs >= 1){console.log('scenerio 5, lastAndOlder');
			const powerScore : {lastT : number, olderTotal : number} = {
				lastT : 0,
				olderTotal : 0
			};

			let pp = this.pointsPossible(h.lastT);
				powerScore.lastT = +((h.lastT.score/pp) * 70).toFixed(2);
			
			// Calculated Older Tournament Scores
			h.oldTs.forEach(t =>{
				let pp = this.pointsPossible(t);
				powerScore.olderTotal += +((t.score/pp) * 10).toFixed(2);
			});

			return powerScore.lastT + powerScore.olderTotal;
		// Has played in second to last T and at least 1 older T
		}else if(h.secondLastT && !h.lastT && h.totalTs >= 1){console.log('scenerio 6, secondToLastAndOlder');
			const powerScore : {secondLastT : number, olderTotal : number} = {
				secondLastT : 0,
				olderTotal : 0
			};

			let pp = this.pointsPossible(h.secondLastT);
				powerScore.secondLastT = +((h.secondLastT.score/pp) * 70).toFixed(2);
			
			// Calculated Older Tournament Scores
			h.oldTs.forEach(t =>{
				let pp = this.pointsPossible(t);
				powerScore.olderTotal += +((t.score/pp) * 10).toFixed(2);
			});
			return powerScore.secondLastT + powerScore.olderTotal;
		// Has only played old Ts (past last two)
		}else if(!h.lastT && !h.secondLastT && h.totalTs >=1){console.log('scenerio 7, olderOnly');
			const powerScore : {olderTotal : number} = {
				olderTotal : 0
			};
			// Calculated Older Tournament Scores
			h.oldTs.forEach(t =>{
				let pp = this.pointsPossible(t);
				powerScore.olderTotal += +((t.score/pp) * 10).toFixed(2);
			});
			return powerScore.olderTotal;
		// Shouldn't happen
		}else{console.log("scenerio shouldn't be here");
			console.error(new Error("Unexpected algorithm scenerio!"));
		}
		
	}
	private pointsPossible(t) : number{
		let pp = ((t.wins + t.losses + t.draws + t.byes) * 2);
		return pp;
	}

	private updateDbPlayerValue(playerId,property,value) : void{
		let specificDbPlayer = this.root.ref('players/' + playerId);
		specificDbPlayer.child(property).set(value);
	}

}
