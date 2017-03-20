import { Component, OnInit } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
	template : `
		<div class="page_wrapper">
			<div class="page_title_container">
				<h2>Overall Standings</h2>
				<span class="subheader">Cumulative Rankings since March 25, 2017</span>
				<br /><br />
			</div>
			<div id="rankingContainer">

				<table class="table table-list table-striped">
					<tr>
						<th>Player</th>
						<th>Overall Rank</th>
						<th class="text-right">Power Rank</th>
						<th class="text-right">1st Place FInishes</th>
						<th class="text-right">Overall Score</th>
						<th class="text-right">Match Wins</th>
						<th class="text-right">Match Losses</th>
						<th class="text-right">Match Draws</th>
						
					</tr>
					<tr *ngFor="let player of playerList">
						<td>{{player.firstName}} {{player.lastName}}<br /><em class="text-muted">{{player.nickName}}</em></td>
						<td class="text-right">{{player.overallRanking}}</td>
						<td class="text-right">{{player.powerRanking}}</td>
						<td class="text-right">{{player.firstPlaces}}</td>
						<td class="text-right">{{player.overallScore}}</td>
						<td class="text-right">{{player.matchWins}}</td>
						<td class="text-right">{{player.matchLosses}}</td>
						<td class="text-right">{{player.matchDraws}}</td>
						
					</tr>
				</table>
			</div>
		</div>
	`,
	selector : "standings-component",
	styles : [`
		
		
	`]
})

export class StandingsComponent{
	playerList = [];
	allPlayers : FirebaseListObservable<any>;
	constructor(af: AngularFire) {
	  this.allPlayers = af.database.list('/players');
	}

	ngOnInit(){
			function compare(a,b){
				if (a.overallRanking < b.overallRanking)
				    return -1;
				  if (a.overallRanking > b.overallRanking)
				    return 1;
				return 0;
			}

			this.allPlayers.subscribe(players => {
		  			  console.log('players',players);
		  			 this.playerList = players.sort(compare);
		  			  
		  	});
	}

	
}