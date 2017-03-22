import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Location} from '@angular/common';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { AngularFire, FirebaseListObservable } from 'angularfire2';


@Component({
	template : `
		<div class="page_wrapper">
			<div>	
				<h2>Player Details: </h2>
				<select id="playerSelect" class="input-lg vertical_align_top pull-right" [(ngModel)]="selectedPlayer" name="player" (change)="pc()">
					<option *ngFor="let player of playerList" [ngValue]="player">{{player.firstName}} {{player.lastName}}</option>
				</select>
			</div>
			<span class="subheader">Cululative Player Data Since: {{selectedPlayer.trackingSince}}</span>
			<hr />
			<div id="playerContainer">
				<div class="page_title_container well">
					<div id="detailsPhoto" class="details_group inline_block"><img [ngClass]="{ranked_first : selectedPlayer.overallRanking === 1}" class="profile_image img-thumbnail" src="{{selectedPlayer.photoUrl}}" /></div>
					
					<div class="details_group inline_block">
						<ul  id="detailsList1" class="details_list list-group inline_block">
							<li class="list-group-item"><strong>Nick Name : </strong><span>{{selectedPlayer.nickName}}</span></li>
							<li class="list-group-item"><strong>Overall Ranking : </strong><span>{{selectedPlayer.overallRanking}}</span></li>
							<li class="list-group-item"><strong>Power Ranking : </strong><span>{{selectedPlayer.powerRanking}}</span></li>
							<li class="list-group-item"><strong>Overall Score : </strong><span>{{selectedPlayer.overallScore}}</span></li>
							<li class="list-group-item"><strong>Player ID:</strong> <span>{{selectedPlayer.id}}</span></li>
						</ul>
						<ul id="detailsList2" class="details_list list-group inline_block">
							<li class="list-group-item"><strong>1st Place FInishes : </strong><span>{{selectedPlayer.firstPlaces}}</span></li>
							<li class="list-group-item"><strong>Wins: </strong><span>{{selectedPlayer.matchWins}}</span></li>
							<li class="list-group-item"><strong>Losses : </strong><span>{{selectedPlayer.matchLosses}}</span></li>
							<li class="list-group-item"><strong>Draws : </strong><span>{{selectedPlayer.matchDraws}}</span></li>
							<li class="list-group-item"><strong>Tracking Since</strong> <span>{{selectedPlayer.trackingSince}}</span></li>
						</ul>
					</div>

			
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
	`,
	styles : [`
		#playerSelect{
			cursor : pointer;
		}

		.details_group{
			vertical-align:top;
			width:70%;
		}
		.details_group:first-child{
			width:208px;
		}
		.details_list{
			width:49%;
		}
		h2{
			display:inline-block;
			margin-top:0px;
		}
		.well{
			width : 100%;
		}
		
		
		@media(max-width : 900px){
			.details_list{
				display:block;
				width:100%;
			}
			.details_group{
				width:100%;
			}
			#detailsPhoto{
				text-align:center;
				width:100%;
				margin-bottom:10px;
			}
		}
	`],
	selector : "player-history-component",
	providers: []
})

export class PlayerHistoryComponent implements OnInit{


	playerList : any[] = [];
	selectedPlayer = 0;
	allPlayers : FirebaseListObservable<any>;

	location;
	constructor(private route: ActivatedRoute, af: AngularFire, location: Location) {
 		this.allPlayers = af.database.list('/players');
 		this.location = location;
	}


   ngOnInit(){
   	this.route.params.subscribe((params : {playerid}) => {
   	 	let id;
   	 	console.log(params.playerid );
   		if(typeof params.playerid === "string"){
   			id = parseInt(params.playerid);
   		}else{
   			id = 0;
   			this.location.replaceState("/player/"+id);
   		}

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
		let id = this.selectedPlayer['id'];

		this.location.replaceState("/player/"+id);
	}
}