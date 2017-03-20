import { Injectable, Inject } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseRef } from 'angularfire2';

@Injectable()
export class CalculateRanking {
	allPlayers$ : FirebaseListObservable<any>;
	allTournaments$ : FirebaseListObservable<any>;
	root;
	playerList : any[] = [];
	tournamentList : any[] = [];
	constructor(af : AngularFire, @Inject(FirebaseRef) ref){
		this.allPlayers$ = af.database.list('/players');
		this.allTournaments$ = af.database.list('/tournaments');
		this.root = ref.database();
	}

	calculateRanking(){

		//all tournaments
		let tournaments  = this.allTournaments$.subscribe(tournaments =>{
			this.tournamentList = tournaments.sort((a,b) =>{
				return a.id - b.id;
			}).reverse();
		});
		
		//get players from DB
		let playersObservable = this.allPlayers$.subscribe(players =>{
			this.playerList = players;
			
			// Calculate  total score
			this.addTotalScore();

			//Calculate overall ranking
			this.determineOverallRank();

			//Calculate power ranking score
			//this.determinePowerRankingScore();

			//Calculate power ranking
			//this.determinePowerRanking();


		});


	}


	private addTotalScore(){
		// For each Player
		this.playerList.forEach(player=>{
			let totalScore = 0;
			
			// For each tournament...
			for(let item in player.tournamentHistory){
				totalScore += player.tournamentHistory[item].score;
			}

			player.overallScore = totalScore;
			//Update Overall Score
			this.updateDbPlayerValue(player.id,"overallScore",player.overallScore);
		});
	}

	private determineOverallRank(){
		this.playerList.sort((a,b)=>{
			if(a.overallScore-b.overallScore === 0){
				return a.matchWins-b.matchWins;
			}
			  	return a.overallScore-b.overallScore;
			}).reverse();
		//console.log('opa',this.playerList);

		this.playerList.forEach((player, i) =>{
			player.overallRanking = i +1;
			//Update Overall Ranking in DB
			this.updateDbPlayerValue(player.id,"overallRanking",player.overallRanking);
		});
		//console.log('updatedrankings',this.playerList);

	}

	private updateDbPlayerValue(playerId,property,value){
		let specificDbPlayer = this.root.ref('players/' + playerId)
		specificDbPlayer.child(property).set(value);

	}


	private determinePowerRankingScore(){
		let lastT = this.tournamentList[0];
		let secondLastT = this.tournamentList[1];
		
		

		// For each Player
		this.playerList.forEach(player=>{
			let numberOfTournaments = player.tournamentHistory.length;
		
			
			let count = 0;
			let tournamentArray =[];
			// For each tournament...
			for(let item in player.tournamentHistory){

				console.log(tournamentArray.push(player.tournamentHistory[item].id));
				//let cake = new Date(player.tournamentHistory[item].date);
				//console.log(cake);
				count ++;
			}
			tournamentArray.reverse();
		
			console.log('ta',tournamentArray,lastT);
			let playedInLastT = function(){
				return tournamentArray[0] === lastT.tournamentDetails.id ? true : false;
			}
			let playedInSecondLastT = function(){
				return tournamentArray[1] === secondLastT.tournamentDetails.id ? true : false;
			}


			if(playedInLastT() && numberOfTournaments === 1){
				let latestT = player.tournamentHistory[tournamentArray[0]];
				player.powerRankingScore = this.algorithms.oneTournament(latestT);
			}else if(playedInSecondLastT() && numberOfTournaments === 2){
				let latestT = player.tournamentHistory[tournamentArray[0]];
				let secondLatestT = player.tournamentHistory[tournamentArray[1]];
				player.powerRankingScore = this.algorithms.twoTournaments(latestT, secondLatestT);
			}else if(playedInLastT() && playedInSecondLastT() && numberOfTournaments > 2){
				let latestT = player.tournamentHistory[tournamentArray[0]];
				let secondLatestT = player.tournamentHistory[tournamentArray[1]];
				let oldTs = [];
				// FInd older Ts
				for(let i=2;i<tournamentArray.length;i++){
					let ta = tournamentArray[i];
					console.log('ta',ta);
					let matchingT = player.tournamentHistory.find(item =>{
						return item.id === ta;
					});
					oldTs.push(matchingT);
				}
				player.powerRankingScore = this.algorithms.overTwoTournaments(latestT,secondLatestT, oldTs);
			}
		});
	}

	private determinePowerRanking(){
		let powerRankingArray = this.playerList.sort((a,b)=>{
			return a.powerRankingScore - b.powerRankingScore;
		}).reverse();

		this.playerList.forEach((player, i) =>{
			player.powerRanking = i +1;

			//Update Overall Ranking in DB
			this.updateDbPlayerValue(player.id,"powerRanking",player.powerRanking);

		});
	}

	algorithms = {
			oneTournament(first){console.log('in first');
				let pp = this.pointsPossible(first);
				let updatedScore = ((first.score/pp) * 100).toFixed(2);
				//console.log('score', updatedScore);
				return updatedScore;
			},
			twoTournaments(first, second){console.log('in second');
				let updatedFirst, updatedSecond,updatedFinal;
			
				
				(() =>{
					let pp = this.pointsPossible(first);
					updatedFirst = ((first.score/pp) * 80).toFixed(2);
					//console.log(updatedFirst);
				})();

				(() =>{
					let pp = this.pointsPossible(second);
					updatedSecond = ((second.score/pp) * 20).toFixed(2);
					//console.log('u2',updatedSecond);
				})();

				(() =>{
					updatedFinal = parseInt(updatedFirst) + parseInt(updatedSecond);
					//console.log('u1',updatedFirst,'u2',updatedSecond,'uf',updatedFinal);
				})();

				//console.log('final',updatedFinal);
				return updatedFinal;
			},
			overTwoTournaments(first, second, theRest){console.log('in third');
				//console.log('first',first,'second', second,'third',theRest);
				let updatedFirst, updatedSecond,oldTAverage,updatedFinal;

				(() =>{
					let pp = this.pointsPossible(first);
					updatedFirst = ((first.score/pp) * 75).toFixed(2);
					//console.log(updatedFirst);
				})();

				(() =>{
					let pp = this.pointsPossible(second);
					updatedSecond = ((second.score/pp) * 15).toFixed(2);
					//console.log('u2',updatedSecond);
				})();

				(() =>{
	
					let oldTTotal = 0;
					theRest.forEach(t =>{

						let pp = this.pointsPossible(t);
						oldTTotal += parseInt(((t.score/pp) * 10).toFixed(2));
						
					});
					oldTAverage = oldTTotal / theRest.length;
			
				})();

				(() =>{
					updatedFinal = parseInt(updatedFirst) + parseInt(updatedSecond) +parseInt(oldTAverage);
					console.log('FINAL',updatedFinal);
		
				})();

				return updatedFinal;
			},
			latestButNotSecondLatestAndOlder(first,theRest){
				let pp = this.pointsPossible(first);
				let updatedFirst = ((first.score/pp) * 75).toFixed(2);
				let updatedRest = (this.theRest(theRest) * 10).toFixed(2);

			
				return parseInt(updatedFirst) + parseInt(updatedRest);
			},
			notLatestButSecondLatest(second){
				let pp = this.pointsPossible(second);
				let updatedSecond = ((second.score/pp) * 20).toFixed(2);

				return parseInt(updatedSecond)
			},
			notLatestButSecondLatestAndOlder(second,theRest){
				let pp = this.pointsPossible(second);
				let updatedSecond = ((second.score/pp) * 15).toFixed(2);
				let updatedRest = (this.theRest(theRest) * 10).toFixed(2);

				
				return parseInt(updatedSecond) + parseInt(updatedRest);
			},
			onlyOlder(theRest){
				let updatedRest = (this.theRest(theRest) * 10).toFixed(2);

				return parseInt(updatedRest);
			},
			pointsPossible(t){
				let pp = (t.wins + t.losses + t.draws + t.byes) * 2;
				console.log(pp);
				return pp;
			},
			theRest(theRest){
				let oldTAverage ,updatedFinal;
				(() =>{
				
					let oldTTotal = 0;
					theRest.forEach(t =>{

						let pp = this.pointsPossible(t);
						oldTTotal += parseInt(((t.score/pp) * 10).toFixed(2));
						
					});
					oldTAverage = oldTTotal / theRest.length;
				
				})();

				(() =>{
					updatedFinal = parseInt(oldTAverage);
					console.log('rest final',updatedFinal);
				})();

				return updatedFinal;
			}

	}


}