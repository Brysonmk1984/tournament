import { Component, OnInit } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Router} from '@angular/router';

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
				<br />
				<hr />
			</div>
			<div id="rankingContainer">

				<table class="table table-list table-striped">
					<tr>
						<th colspan="2">Player</th>
						<th class="text-right">Overall Rank</th>
						<th class="text-right">Power Rank</th>
						<th class="text-right">1st Place FInishes</th>
						<th class="text-right">Overall Score</th>
						<th class="text-right">Match Wins</th>
						<th class="text-right">Match Losses</th>
						<th class="text-right">Match Draws</th>
						
					</tr>
					<tr *ngFor="let player of playerList">
						<td (click)="playerSelected(player.id)" class=""><img [ngClass]="{ranked_first : player.overallRanking === 1}" class="profile_image img-thumbnail" src="{{player.photoUrl}}" /></td>
						<td (click)="playerSelected(player.id)"><div class="player_names">{{player.firstName}} {{player.lastName}}<br /><em class="text-muted">{{player.nickName}}</em></div></td>
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
		.profile_image{
			max-width:70px;
			width:70px;
			height:70px;
			cursor:pointer;
		}
		.player_names{
			cursor : pointer;
		}
		h2{
			margin-top:0px;
		}
		
		.table>tbody>tr>td{
			vertical-align:middle;
			font-weight:bold;
		}
		.table>tbody>tr>td em{
			font-weight:normal;
		}
		
	`]
})

export class StandingsComponent{
	playerList = [];
	allPlayers : FirebaseListObservable<any>;
	parentRouter;
	constructor(af: AngularFire, router : Router) {
		this.parentRouter = router;
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

	playerSelected(id){
		this.parentRouter.navigateByUrl('/player/' + id);
	}
}