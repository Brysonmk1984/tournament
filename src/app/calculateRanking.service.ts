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
		this.playerList = this.root.ref('players/').once('value',(snap)=>{
			//console.log('players snapsnap',snap.val());

			this.playerList = snap.val();
			
			// Calculate  total score
			this.addTotalScore();

			//Calculate overall ranking
			this.determineOverallRank();

			//Calculate power ranking score
			this.determinePowerScore();

			//Calculate power ranking
			this.determinePowerRanking();


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

			//console.log('overall score - ', player.overallScore);
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
		let specificDbPlayer = this.root.ref('players/' + playerId);
		/*specificDbPlayer.child(property).once('value', (snap)=>{
			console.log('snap',snap.val());
		});*/
		
		specificDbPlayer.child(property).set(value);
		
		

	}


	private determinePowerScore(){
		let lastT = this.tournamentList[0];
		let secondLastT = this.tournamentList[1];
		//console.log('last tourn',lastT);
		

		// For each Player
		this.playerList.forEach(player=>{//console.log('CURRENT PLAYER', player.firstName, player);
			let numberOfTournaments = player.tournamentHistory.length;
			
			//console.log('PLAYER - ', player);
			let playerTArray =[];
			// For each tournament...
			for(let item in player.tournamentHistory){
				playerTArray.push(player.tournamentHistory[item].id);
			}
			playerTArray.reverse();
		
			//console.log("TTTTAA",playerTArray);
			
			let playedInLastT = (function(){
				return playerTArray[0] === lastT.tournamentDetails.id ? true : false;
			})();
			let playedInSecondLastT = (function(){
				return playerTArray[1] === secondLastT.tournamentDetails.id ? true : false;
			})();

			//Find olders Ts
		
			//console.log('player T hist',player.tournamentHistory);
			let oldTs = player.tournamentHistory.filter(item =>{
				//console.log('item',item);

				return playerTArray.find( id =>{
					return id === item.id && id !== lastT.tournamentDetails.id &&  id !== secondLastT.tournamentDetails.id ;
				})

	
			});
			//console.log('array of matches',oldTs);
			
			
			let playerTCollection = [];
			for(let i = 0; i<player.tournamentHistory.length;i++){
				if(player.tournamentHistory[i] !== undefined){
					playerTCollection.push(player.tournamentHistory[i]);
				}
			}
			playerTCollection.reverse();


			let playerLatestT = playerTCollection[0];
			let playerSecondLatestT = playerTCollection[1];
			//console.log('tournamentHist',player.tournamentHistory,'latestt',playerLatestT, 'second',playerSecondLatestT);
			
			// Has only played in last T
			if(playedInLastT && numberOfTournaments === 1){console.log('scenerio 1');console.log(playerLatestT);
				player.powerScore = this.algorithms.oneTournament(playerLatestT);
			// Has only played in the last two Ts
			}else if(playedInLastT && playedInSecondLastT && numberOfTournaments === 2){console.log('scenerio 2');
				player.powerScore = this.algorithms.twoTournaments(playerLatestT, playerSecondLatestT);
			
			// Has played in last two Ts and at least one more previous
			}else if(playedInLastT && playedInSecondLastT && numberOfTournaments > 2){console.log('scenerio 3');
				player.powerScore = this.algorithms.overTwoTournaments(playerLatestT,playerSecondLatestT, oldTs);
			
			// Has played in only the second to last T
			}else if(playedInSecondLastT && numberOfTournaments === 1){console.log('scenerio 4');
				player.powerScore = this.algorithms.onlySecondLatest(playerSecondLatestT);
			
			// Has played in last T and at least 1 older T
			}else if(playedInLastT && !playedInSecondLastT  && numberOfTournaments >= 1){console.log('scenerio 5');
				player.powerScore = this.algorithms.latestButNotSecondLatestAndOlder(playerLatestT,oldTs);

			// Has played in second to last T and at least 1 older T
			}else if(playedInSecondLastT && !playedInLastT && numberOfTournaments >= 1){console.log('scenerio 6');
				player.powerScore = this.algorithms.secondLatestAndOlder(playerSecondLatestT,oldTs);

			// Has only played old Ts (past last two)
			}else if(!playedInLastT && !playedInSecondLastT && numberOfTournaments >=1){console.log('scenerio 7');
				player.powerScore = this.algorithms.onlyOlder(oldTs);
			}
			console.log('Power score',parseInt(player.powerScore), 'playerid',player.id);
			this.updateDbPlayerValue(player.id,"powerScore",parseInt(player.powerScore));
			
		});
	}

	private determinePowerRanking(){
		let powerRankingArray = this.playerList.sort((a,b)=>{
			return a.powerScore - b.powerScore;
		}).reverse();

		this.playerList.forEach((player, i) =>{
			player.powerRanking = i +1;

			//Update Overall Ranking in DB
			this.updateDbPlayerValue(player.id,"powerRanking",player.powerRanking);

		});
	}

	algorithms = {
			oneTournament(first){//console.log('in first');
				let pp = this.pointsPossible(first);
				let updatedScore = ((first.score/pp) * 100).toFixed(2);
				//console.log('score', updatedScore);
				return updatedScore;
			},
			twoTournaments(first, second){//console.log('in second');
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
			overTwoTournaments(first, second, theRest){//console.log('in third');
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
					//console.log('FINAL',updatedFinal);
		
				})();

				return updatedFinal;
			},
			latestButNotSecondLatestAndOlder(first,theRest){
				let pp = this.pointsPossible(first);
				let updatedFirst = ((first.score/pp) * 75).toFixed(2);
				let updatedRest = (this.theRest(theRest) * 10).toFixed(2);

			
				return parseInt(updatedFirst) + parseInt(updatedRest);
			},
			onlySecondLatest(second){
				let pp = this.pointsPossible(second);
				let updatedSecond = ((second.score/pp) * 20).toFixed(2);

				return parseInt(updatedSecond)
			},
			secondLatestAndOlder(second,theRest){
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
				//console.log(pp);
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
					//console.log('rest final',updatedFinal);
				})();

				return updatedFinal;
			}

	}


}