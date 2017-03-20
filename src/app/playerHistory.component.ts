import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { AngularFire, FirebaseListObservable } from 'angularfire2';


@Component({
	template : `
		<div class="page_wrapper">
			<div class="page_title_container">
				
				<select class="input-lg vertical_align_top" [(ngModel)]="selectedPlayer" name="player" (change)="pc()">
					<option *ngFor="let player of playerList" [ngValue]="player">{{player.firstName}} {{player.lastName}}</option>
				</select>
				<!--<h2> Player History</h2>-->

						
				
			
				<br />
			</div>
			<div id="playerContainer">
				<h3>Player Details</h3>
				<div class="clearfix">
					<ul  id="detailsGroup1" class="list-group pull-left">
						<li class="list-group-item"><strong>Nick Name : </strong><span>{{selectedPlayer.nickName}}</span></li>
						<li class="list-group-item"><strong>Overall Ranking : </strong><span>{{selectedPlayer.overallRanking}}</span></li>
						<li class="list-group-item"><strong>Power Ranking : </strong><span>{{selectedPlayer.powerRanking}}</span></li>
						<li class="list-group-item"><strong>Overall Score : </strong><span>{{selectedPlayer.overallScore}}</span></li>
						<li class="list-group-item"></li>
					</ul>
					<ul id="detailsGroup2" class="list-group pull-right">
						<li class="list-group-item"><strong>1st Place FInishes : </strong><span>{{selectedPlayer.firstPlaces}}</span></li>
						<li class="list-group-item"><strong>Wins: </strong><span>{{selectedPlayer.matchWins}}</span></li>
						<li class="list-group-item"><strong>Losses : </strong><span>{{selectedPlayer.matchLosses}}</span></li>
						<li class="list-group-item"><strong>Draws : </strong><span>{{selectedPlayer.matchDraws}}</span></li>
						<li class="list-group-item"><strong>Tracking Since</strong> <span>{{selectedPlayer.trackingSince}}</span></li>
					</ul>
				</div>
				<div id="colorHistory"  *ngIf="selectedPlayer.tournamentHistory">
					<h3>Tournaments</h3>
					<table class="table table-list table-striped">
						<tr>
							<th>Date</th>
							<th>Set</th>
							<th>Colors</th>
							<th class="text-right">Placement</th>
							<th class="text-right">Score</th>
							<th class="text-right">Wins</th>
							<th class="text-right">Losses</th>
							<th class="text-right">Draws</th>
							<th class="text-right">Byes</th>
						</tr>
						<tr *ngFor="let item of selectedPlayer.tournamentHistory | keys">
							<td>{{item.value.date | date}}</td>
							<td>{{item.value.set}}</td>
							<td>
								{{item.value.colors}}
							</td>
							<td class="text-right">{{item.value.place}}</td>
							<td class="text-right">{{item.value.score}}</td>
							<td class="text-right">{{item.value.wins}}</td>
							<td class="text-right">{{item.value.losses}}</td>
							<td class="text-right">{{item.value.draws}}</td>
							<td class="text-right">{{item.value.byes}}</td>
						</tr>
					</table>


				</div>
			</div>
		</div>
	`,
	styles : [`
		#detailsGroup1, #detailsGroup2{
			width:49%;
			display:inline-block;
		}
		h2{
			display:inline-block;
			margin-top:5px;

		}
	`],
	selector : "player-history-component",
	providers: []
})

export class PlayerHistoryComponent implements OnInit{


	playerList : any[] = [];
	selectedPlayer = 0;
	allPlayers : FirebaseListObservable<any>;


	constructor(private route: ActivatedRoute, af: AngularFire) {
 		this.allPlayers = af.database.list('/players');
 		
	}


   ngOnInit(){
   	this.route.params.subscribe((params : {playerid}) => {
   	 	let id = typeof params.playerid  === "string" ? parseInt(params.playerid) : 0;
   		this.allPlayers.subscribe(players => {
   	  			console.log('players',players);
   	  			this.playerList = players;
   	  			this.selectedPlayer = this.playerList.find( (player) =>{
   	  				return player.id === id;
   	  			});
   	  			console.log('selectedPlayer',this.selectedPlayer);
   	  	});
   	});
	}

	pc(){
		console.log('selectedPlayer',this.selectedPlayer);
	}
}