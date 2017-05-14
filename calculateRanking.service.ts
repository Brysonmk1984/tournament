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
		this.allTournaments$.subscribe(tournaments =>{
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
		console.log('last tourn',lastT);
		

		// For each Player
		//this.playerList = [this.playerList[3]];
		this.playerList.forEach(player=>{//console.log('CURRENT PLAYER', player.firstName, player);
			let numberOfTournaments = player.tournamentHistory ? player.tournamentHistory.length  : 0;
			console.log(player.id);
			// Because of Clay... can remove later prob...
			if(numberOfTournaments === 0){
				player.tournamentHistory = [];
			}

			console.log('PLAYER - ', player);
			let playerTArray : number[] = [];
			// For each tournament...
			for(let item in player.tournamentHistory){
				playerTArray.push(player.tournamentHistory[item].id);
			}
			playerTArray.reverse();
		
			console.log("player T Array - ",playerTArray);
			
			let playedInLastT = (function(){
				let matchingT = playerTArray.find((item)=>{
					return item === lastT.tournamentDetails.id;
				});
				return matchingT !== undefined ? true : false;
			})();
			console.log('in last T?',playedInLastT);
			
			let playedInSecondLastT = (function(){
				let matchingT;
				if(secondLastT){
					matchingT = playerTArray.find((item)=>{
						return item === secondLastT.tournamentDetails.id;
					});
				}
				return matchingT !== undefined ? true : false;
			})();
			console.log('in second last ?',playedInSecondLastT);

			//Find olders Ts
		
			//console.log('player T hist',player.tournamentHistory);
			let oldTs = player.tournamentHistory.filter(item =>{
				return playerTArray.filter( id =>{
					//console.log('id', id, 'item', item.id, 'lt',lastT.tournamentDetails.id,'slt',secondLastT.tournamentDetails.id);
					return id === item.id && id !== lastT.tournamentDetails.id &&  id !== secondLastT.tournamentDetails.id ;
				});

		

	
			});
			//console.log('array of matches',oldTs);
			
			
			let playerTCollection = [];
			for(let i = 0; i<player.tournamentHistory.length;i++){
				if(player.tournamentHistory[i] !== undefined){
					playerTCollection.push(player.tournamentHistory[i]);
				}
			}


			let playerLatestT = playerTCollection[lastT.tournamentDetails.id];
			let playerSecondLatestT = secondLastT ? playerTCollection[secondLastT.tournamentDetails.id] : undefined;
			//console.log('tournamentHist',player.tournamentHistory,'latestt',playerLatestT, 'second',playerSecondLatestT);
			
			// Has only played in last T
			if(playedInLastT && numberOfTournaments === 1){console.log('scenerio 1');
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
				//console.log('RERRR',playerLatestT,oldTs);
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

			//console.log('PR', player.powerRanking);
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
					updatedFirst = ((first.score/pp) * 70).toFixed(2);
					//console.log(updatedFirst);
				})();

				(() =>{
					let pp = this.pointsPossible(second);
					updatedSecond = ((second.score/pp) * 30).toFixed(2);
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
					updatedFirst = ((first.score/pp) * 70).toFixed(2);
					//console.log(updatedFirst);
				})();

				(() =>{
					let pp = this.pointsPossible(second);
					updatedSecond = ((second.score/pp) * 20).toFixed(2);
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
				let updatedFirst = ((first.score/pp) * 70).toFixed(2);
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
				let updatedSecond = ((second.score/pp) * 20).toFixed(2);
				let updatedRest = (this.theRest(theRest) * 10).toFixed(2);

				
				return parseInt(updatedSecond) + parseInt(updatedRest);
			},
			onlyOlder(theRest){console.log('THE REST', theRest);
				let updatedRest = (this.theRest(theRest) * 10).toFixed(2);

				return parseInt(updatedRest);
			},
			pointsPossible(t){
				let pp = ((t.wins + t.losses + t.draws + t.byes) * 2);
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