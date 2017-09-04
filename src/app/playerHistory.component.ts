import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Location} from '@angular/common';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

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

			
				</div><br />
				<h3>Player Data</h3>
				<div id="chartContainer">
					<div id="colorAffiliation" class="chart"></div>
					<div id="colorWinPercentage" class="chart"></div>
					<div id="placementOverTime" class="chart"></div>
					<div id="setBreakdown" class="chart"></div>
					
				</div>
			
				<div id="colorHistory"  *ngIf="selectedPlayer.tournamentHistory">
					<h3>Tournament Results</h3>
					<table class="table table-list table-striped">
						<tr>
							<th>Date</th>
							<th>Set</th>
							<th>Colors</th>
							<th class="text-right">P<span class="hide_small_screen">lacement</span></th>
							<th class="text-right">S<span class="hide_small_screen">core</span></th>
							<th class="text-right">W<span class="hide_small_screen">ins</span></th>
							<th class="text-right">L<span class="hide_small_screen">osses</span></th>
							<th class="text-right">D<span class="hide_small_screen">raws</span></th>
							<th class="text-right">B<span class="hide_small_screen">yes</span></th>
						</tr>
						<tr *ngFor="let item of selectedPlayer.tournamentHistory | keys">
							<td>{{item.value.date | date}}</td>
							<td>{{item.value.set}}</td>
							<td>
								<span *ngFor="let color of item.value.colors; let isLast=last">{{color}}<br /></span>
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
			.hide_small_screen{
				display:none;
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
	playerTournamentData : any = [];
	playerTournamentSets : any = [];
	colorAffiliation : any = [];
	winPercentageByColor : any = [];
	overallRecord : any = {wins : 0, losses : 0, draws : 0};
	allTournamentResults : any  = [];
	tbSeries : any = {wins:[],losses:[],draws:[]};

	location;

	constructor(private route: ActivatedRoute, afdb: AngularFireDatabase, location: Location) {
 		this.allPlayers = afdb.list('/players');
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
		console.log('asd',playerTournamentSets);
		// CHART - Color Affiliation
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

		// CHART - Win Percentage by Color
		Highcharts.chart('colorWinPercentage', {
			chart: {
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false,
				type: 'column',
				backgroundColor: '#f5f5f5',
			},
			title: {
				text: 'Win Percentage by Color'
			},
			xAxis: {
				title: {
					text: ''
				},
				categories : ["Red", "Blue","Green","Black","White"],
				labels: {
					formatter : function(){
						return this.value;
					}
				}
			},
			yAxis: {
				title: {
					text: 'Win Percentage'
				},
				min : 0,
				max : 100,
				startOnTick : false,
				endOnTick : false,
				labels: {
					formatter : function(){
						return this.value + "%";
					}
				},
				plotLines: [{
					color: 'red',
					value: 50,
					width: 1,
					zIndex: 1000   
				}]
			},
			plotOptions: {
				series: {pointWidth: 76}
			},
			tooltip: {
				pointFormat: '<b>{point.y:.1f}%</b>'
			},
			legend: {
				enabled: false
			},
			credits : false,
			series: [{
				colorByPoint: true,
				data: [{
					y: this.winPercentageByColor.red * 100,
					color: '#FAAA8F'
				}, {
					y: this.winPercentageByColor.blue * 100,
					color: '#A9E0F9'
				}, {
					y: this.winPercentageByColor.green * 100,
					color: '#9BD3AE'
				}, {
					y: this.winPercentageByColor.black * 100,
					color: '#000000'
				}, {
					y: this.winPercentageByColor.white * 100,
					color: '#FFFDD7'
				}]
			}]
		});
		console.log('PTD', playerTournamentData);
		// CHART - Placement Over Time
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
			legend: {
				enabled: false
			},
			series: [{
				name: 'Placement',
				color: '#404040',
				data: [...playerTournamentData],
				set : [...playerTournamentSets]
			}]

		});

		// CHART - Tournamnet Breakdown
		Highcharts.chart('setBreakdown', {
			chart: {
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false,
				type: 'column',
				backgroundColor: '#f5f5f5',
			},
			title: {
				text: 'Tournament Breakdown'
			},
			xAxis: {
				title: {
					text: 'Draft'
				},
				categories : [...this.playerTournamentSets],
				labels: {
					formatter : function(){
						return this.value;
					}
				}
			},
			yAxis: {
				title: {
					text: 'Match Count'
				},
				labels: {
					formatter : function(){
						return this.value;
					}
				}
			},
			legend: {
				enabled: true
			},
			credits : false,
			series: [
				{
					name : "Wins",
					color : "#404040",
					data : this.tbSeries.wins
				},
				{
					name : "Losses",
					color : "#909090",
					data : this.tbSeries.losses
				},
				{
					name : "Draws",
					color : "#D3D3D3",
					data : this.tbSeries.draws
				}
			]
			
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
		const tournaments = this.selectedPlayer.tournamentHistory;
		const colorFrequency = {blue : 0, red : 0, white : 0, black : 0, green : 0};
		const winPercentageByColor = {blue : 0, red : 0, white : 0, black : 0, green : 0};
		const cumulativeWinsByColor = {
			blue : {winCount : 0, matchCount : 0},
			red : {winCount : 0, matchCount : 0},
			white : {winCount : 0, matchCount : 0},
			black : {winCount : 0, matchCount : 0},
			green : {winCount : 0, matchCount : 0}
		};

		// Calc the total number of matches and wins for each color
		for(let tournament of tournaments){
			//const colorCount = tournament.colors.length;
			console.log('T',tournament);
			if(typeof tournament !== "undefined"){
				for(let color in tournament.colors){
					const c = tournament.colors[color];
					console.log('C',c);

					cumulativeWinsByColor[c].winCount += tournament.wins + tournament.byes;
					cumulativeWinsByColor[c].matchCount += tournament.wins + tournament.byes + tournament.losses;

					// Frequency chart data
					colorFrequency[tournament.colors[color]] ++;
				}
				this.overallRecord.wins += tournament.wins + tournament.byes;
				this.overallRecord.losses += tournament.losses;
				this.overallRecord.draws += tournament.draws;
			}
		}

		// For each color, set the win percent
		for(let c in winPercentageByColor){
			winPercentageByColor[c] = cumulativeWinsByColor[c].winPercentage = (cumulativeWinsByColor[c].winCount / cumulativeWinsByColor[c].matchCount) || 0;
		}

		this.colorAffiliation = colorFrequency;
		this.winPercentageByColor = winPercentageByColor;


		// Tournament data for Tournament Breakdown Chart
		this.tbSeries = {wins : [], losses : [], draws : []};
		tournaments.forEach((t)=>{
			this.tbSeries.wins.push(t.wins);
			this.tbSeries.losses.push(t.losses);
			this.tbSeries.draws.push(t.draws);
		});

		// Firebase includes undefined in arrays, so need this to prevent charts from breaking
		this.playerTournamentData = this.playerTournamentData.filter((t)=>{
			if(typeof t !== undefined){
				return t;
			}
		});
	}

	playerChange(firstName, lastName){
		this.location.replaceState("/player/"+firstName.toLowerCase() + "-" + lastName.toLowerCase());
		
		this.updatePlayerData();
		this.renderCharts(this.playerTournamentData, this.playerTournamentSets);
	}
	
}