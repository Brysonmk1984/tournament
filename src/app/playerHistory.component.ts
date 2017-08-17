import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Location} from '@angular/common';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import Highcharts from 'highcharts';
import suffix from "../utility/placementSuffix";

Highcharts.setOptions({
    lang: {
        thousandsSep: ','
    }
});

@Component({
	template : `
		<div class="page_wrapper">
			<div>	
				<h2>Player Details: </h2>
				<select id="playerSelect" class="input-lg vertical_align_top pull-right" [(ngModel)]="selectedPlayer" name="player" (change)="playerChange(selectedPlayer.firstName, selectedPlayer.lastName)">
					<option *ngFor="let player of playerList" [ngValue]="player">{{player.firstName}} {{player.lastName}}</option>
				</select>
				
			</div>
			<span class="subheader" *ngIf="selectedPlayer.trackingSince">Cumlulative Player Data Since: {{selectedPlayer.trackingSince | date}}</span>
			<hr />
			<div id="playerContainer">
				<div class="page_title_container well">
					<div id="detailsPhoto" class="details_group inline_block"><img [ngClass]="{has_belt : player?.wonLastTournament === true}" class="profile_image img-thumbnail" src="{{selectedPlayer.photoUrl}}" /></div>
					
					<div class="details_group inline_block">
						<ul  id="detailsList1" class="details_list list-group inline_block">
							<li class="list-group-item"><strong>Nick Name :&nbsp;</strong><span> {{selectedPlayer.nickName}}</span></li>
							<li class="list-group-item"><strong>Overall Ranking :&nbsp;</strong><span> {{selectedPlayer.overallRanking | suffix}}</span></li>
							<li class="list-group-item"><strong>Power Ranking :&nbsp;</strong><span> {{selectedPlayer.powerRanking | suffix}}</span></li>
							<li class="list-group-item"><strong>Overall Score :&nbsp;</strong><span> {{selectedPlayer.overallScore}}</span></li>
							<li class="list-group-item"><strong>Player ID:&nbsp;</strong><span> {{selectedPlayer.id}}</span></li>
						</ul>
						<ul id="detailsList2" class="details_list list-group inline_block">
							<li class="list-group-item"><strong>1st Place Finishes :&nbsp;</strong><span> {{selectedPlayer.firstPlaces}}</span></li>
							<li class="list-group-item"><strong>Wins:&nbsp;</strong><span> {{selectedPlayer.matchWins}}</span></li>
							<li class="list-group-item"><strong>Losses :&nbsp;</strong><span> {{selectedPlayer.matchLosses}}</span></li>
							<li class="list-group-item"><strong>Draws :&nbsp;</strong><span> {{selectedPlayer.matchDraws}}</span></li>
							<li class="list-group-item"><strong>Tracking Since:&nbsp;</strong> <span> {{(selectedPlayer.trackingSince | date) || "No tournament History"}}</span></li>
						</ul>
					</div>

			
				</div>
				<div id="chartContainer">
					<div id="placementOverTime" class="chart"></div>
					<div id="colorAffiliation" class="chart"></div>
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
							<td class="text-right">{{item.value.place | suffix }}</td>
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
			margin-right:20px;
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
		#chartContainer{
			margin:30px 0px;
			display:flex;
			justify-content:center;
			align-content : space-between;
			flex-wrap: wrap;
			border: 1px solid rgba(0,0,0,.125);
		}
		.chart{
			min-width:400px;
			width:45%;
			background-color:#f5f5f5;
			border-radius:8px;
			margin:20px;
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
		@media(max-width : 500px){
			.chart{
				min-width:350px;
			}
		}
	`],
	selector : "player-history-component",
	providers: []
})

export class PlayerHistoryComponent implements OnInit{
	playerList : any[] = [];
	selectedPlayer : any = 0;
	allPlayers : FirebaseListObservable<any>;
	playerTournamentData: any = [];
	playerTournamentSets: any = [];
	colorAffiliation : any = [];
	location;

	constructor(private route: ActivatedRoute, af: AngularFire, location: Location) {
 		this.allPlayers = af.database.list('/players');
 		this.location = location;
	}

   	ngOnInit(){
		this.route.params.subscribe((params : {playerName}) => {
			let firstName;
			let lastName;
		
			if(typeof params.playerName === "string"){
				let dashIndex = params.playerName.indexOf('-');
				firstName = dashIndex !== -1 ? params.playerName.slice(0,dashIndex) : params.playerName;
				lastName = dashIndex !== -1 ? params.playerName.slice(dashIndex + 1, params.playerName.length) : undefined;
				console.log(firstName,lastName);
			}
			
			this.allPlayers.subscribe(players => {
				
				this.playerList = players;
				this.selectedPlayer = this.playerList.find( (player) =>{
						console.log('PLAYER',player);
					if(lastName){
						return player.lastName.toLowerCase() === lastName;
					}else if(firstName){
						return player.firstName.toLowerCase() === firstName;
					}else{
						return player.id === 0;
					}
				});
					
				
				this.updatePlayerData();


				console.log('TD',this.playerTournamentData);
				
				this.renderCharts(this.playerTournamentData, this.playerTournamentSets);
				
									
				
			});


					
				
		});
	}

	renderCharts(playerTournamentData,playerTournamentSets){
		
		Highcharts.chart('placementOverTime', {
			chart : {
				backgroundColor: '#f5f5f5'
			},
			title: {
				text: 'Tournament Placement'
			},
			xAxis: {
				type: 'datetime',
				dateTimeLabelFormats: {
					day: '%e. %b',
					month: '%b \'%y',
					year: '%Y'
				},
				title: {
					text: 'Date'
				}
			},
			yAxis: {
				title: {
					text: 'Placement'
				},
				reversed : true,
				tickInterval : 1,
				floor : 1,
				labels: {
					formatter : function(){
						return this.value + suffix(this.value);
					}
				}
			},
			credits : false,
			tooltip:{
				formatter: function () {
					return (`<b>Placed: ${this.y + suffix(this.y)}</b><br/>
							Set: ${this.series.options.set[this.point.index]}`);
				}
			},

			series: [{
				name: 'Placement',
				data: [...playerTournamentData],
				set : [...playerTournamentSets]
			}]

		});

		Highcharts.chart('colorAffiliation', {
			chart: {
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false,
				type: 'pie',
				backgroundColor: '#f5f5f5',
			},
			title: {
				text: 'Color Affiliation'
			},
			tooltip: {
				pointFormat: '<b>{point.percentage:.1f}%</b>'
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						format: '<b>{point.name}</b>: {point.percentage:.1f} %',
						style: {
							color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
						}
					}
				}
			},
			credits : false,
			series: [{
				colorByPoint: true,
				data: [{
					name: 'Red',
					y: this.colorAffiliation.red,
					color: '#FAAA8F'
				}, {
					name: 'Blue',
					y: this.colorAffiliation.blue,
					color: '#A9E0F9'
				}, {
					name: 'Green',
					y: this.colorAffiliation.green,
					color: '#9BD3AE'
				}, {
					name: 'Black',
					y: this.colorAffiliation.black,
					color: '#000000'
				}, {
					name: 'White',
					y: this.colorAffiliation.white,
					color: '#FFFDD7'
				}]
			}]
		});
	}

	updatePlayerData(){
		// Tournament Data
		const tournamentDate = this.selectedPlayer.tournamentHistory.map((tournament) =>{
			console.log('T',tournament);
			return Date.parse(tournament.date);
		});

		const tournamentPlacement = this.selectedPlayer.tournamentHistory.map((tournament) =>{
			console.log('T',tournament);
			return tournament.place;
		});

		this.playerTournamentData = tournamentDate.map((date, index) => {
			return [date, tournamentPlacement[index]];
		});

		// Set Data
		this.playerTournamentSets = this.selectedPlayer.tournamentHistory.map((tournament) =>{
			return tournament.set;
		});

		// Color Data
		let colorFrequency = {blue : 0, red : 0, white : 0, black : 0, green : 0};
		
		const tournaments = this.selectedPlayer.tournamentHistory;

		for(let tournament of tournaments){
			for(let color in tournament.colors){
				colorFrequency[tournament.colors[color]] ++;
			}
		}

		this.colorAffiliation = colorFrequency;

	}

	playerChange(firstName, lastName){
		this.location.replaceState("/player/"+firstName.toLowerCase() + "-" + lastName.toLowerCase());
		
		this.updatePlayerData();
		this.renderCharts(this.playerTournamentData, this.playerTournamentSets);
	}
	
}