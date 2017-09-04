import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
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
                <h2>Statistics </h2>
                <br />
				<span class="subheader">Cumulative statistics since March 25, 2017</span>
			</div>
            <hr />
        
			<div id="playerContainer">
                <div>
					<h3>Overall:</h3>
					<div id="chartContainer">
						<div id="primaryCharts">
							<div id="totalDraftColors" class="chart"></div>
							<div id="championshipTitlesWon" class="chart"></div>
						</div>
					</div>
				</div>
				<hr />
				<div>
					<h3>By Set:</h3>
					<div id="chartContainer2">
						<div id="secondaryCharts">
							<div id="draft{{i}}" class="chart" *ngFor="let set of totals.tDetails; let i = index;">set {{set.set}}</div>
						</div>
					</div>
				</div>
				<hr />
				<div *ngFor="let t of tournamentList">
					<h3 class="inline_block">{{t.tournamentDetails.set}}</h3>
					<em class="subheader muted">&nbsp;-&nbsp;{{t.tournamentDetails.date | date}}</em>
					<table class="table table-list table-striped">
						<th>Rank</th>
						<th>Player</th>
						<th>Color</th>
						<th class="text-right">Wins</th>
						<th class="text-right">Losses</th>
						<th class="text-right">Draws</th>
						<tr *ngFor="let p of t.playerFormsArray;">
							<td>{{p.rank | suffix}}</td>
							<td>{{p.playerNameInfo.firstName}} {{p.playerNameInfo.lastName}}</td>
							<td><span *ngFor="let c of p.colors | keys">{{c.value ? (c.key + " ") : ""}}</span></td>
							<td class="text-right">{{p.wins}}</td>
							<td class="text-right">{{p.losses}}</td>
							<td class="text-right">{{p.draws}}</td>
						</tr>
					</table>
					<hr />
				</div>
			</div>
        </div>
	`,
	styles : [`
		h2{
			display:inline-block;
			margin-top:0px;
		}
		.well{
			width : 100%;
		}
		#chartContainer, #chartContainer2{
			margin:30px 0px;
			border: 1px solid rgba(0,0,0,.125);
        }
        #primaryCharts{
            border-bottom: 1px solid rgba(0,0,0,.125);
            display:flex;
            justify-content:space-between;
            flex-wrap:wrap;
        }
        #secondaryCharts div{
            display:inline-block;
        }
		.chart{
			min-width:400px;
			width:45%;
			background-color:#f5f5f5;
			border-radius:8px;
			margin:20px;
        }
		.inline_block{
			display:inline-block;
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
	selector : "stats-component",
	providers: []
})

export class StatsComponent implements OnInit{
	playerList : any[] = [];
	tournamentList : any[] = [];
    allPlayers : FirebaseListObservable<any>;
    allTournaments : FirebaseListObservable<any>;
    location;
    totals : any = {
        wins : 0,
        losses : 0,
        draws : 0,
        tournaments : 0,
        drafters : {
            red : 0,
            blue : 0,
            green : 0,
            black : 0,
            white :0
        },
        tDetails : [],
        champions :[]
    };

	constructor(private route: ActivatedRoute, afdb: AngularFireDatabase, location: Location) {
        this.allPlayers = afdb.list('/players');
        this.allTournaments = afdb.list('/tournaments');
 		this.location = location;
	}

   	ngOnInit(){
        this.allPlayers.subscribe(players => {
            this.playerList = players;
            console.log('PlayerList', this.playerList);
            this.calcTotalsFromPlayers();
        });

        this.allTournaments.subscribe(tournaments => {
            this.tournamentList = tournaments.reverse();
            console.log('TS',this.tournamentList);
            this.calcTotalsFromTournaments();
           
            //fix this
            setTimeout(()=>{
                this.renderCharts();
            },100);
            
        });
	}

	renderCharts(){
		// CHART - Total Draft Colors
		Highcharts.chart('totalDraftColors', {
			chart: {
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false,
				type: 'pie',
				backgroundColor: '#f5f5f5',
			},
			title: {
				text: 'Overall Colors Drafted'
			},
			tooltip: {
				pointFormat: 'Drafted <b>{point.y}</b> times'
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
					y: this.totals.drafters.red,
					color: '#FAAA8F'
				}, {
					name: 'Blue',
					y: this.totals.drafters.blue,
					color: '#A9E0F9'
				}, {
					name: 'Green',
					y: this.totals.drafters.green,
					color: '#9BD3AE'
				}, {
					name: 'Black',
					y: this.totals.drafters.black,
					color: '#000000'
				}, {
					name: 'White',
					y: this.totals.drafters.white,
					color: '#FFFDD7'
				}]
			}]
        });
        
        Highcharts.chart('championshipTitlesWon', {
            chart: {
                type: 'column',
                plotBackgroundColor: null,
                backgroundColor: '#f5f5f5',
            },
            title: {
                text: 'Championship Titles Won'
            },
            yAxis : {
                title : {text : "First Place Finishes"},
                tickInterval : 1,
				floor : 0,
				labels: {
					formatter : function(){
						return this.value;
					}
				}
            },
            xAxis : {
                categories : this.totals.champions.map((champion)=>{return champion}),
                labels : {
                    useHTML : true,
                    formatter : function(){
                        var elem = `<div style="text-align:center"><img width="50" height="50" src="${this.value.photoUrl}" /><br /><strong>${this.value.name}</strong></div>`;
                        return elem; 
                    }
                }
            },
            tooltip : false,
            credits : false,
            legend : false,
            series: [{
                color: '#404040',
                name : this.totals.champions.map((champion)=>{return champion.name}),
                data: this.totals.champions.map((champion)=>{return champion.firstPlaces})
            }]
        });
    }
    
    calcTotalsFromPlayers(){
        this.playerList.forEach((player)=>{
            this.totals.wins += player.matchWins;
            this.totals.losses += player.matchLosses;
            this.totals.draws += player.matchDraws;
            if(player.firstPlaces){
                this.totals.champions.push({name:player.firstName,firstPlaces:player.firstPlaces, photoUrl : player.photoUrl});
            }
            
        });
    }
    calcTotalsFromTournaments(){
        this.totals.tournaments = this.tournamentList.length;
        this.tournamentList.forEach((tournament, index)=>{
            const tName = tournament.tournamentDetails.set;
            const tObj = {set : tName,red:0,blue:0,green:0,black:0,white:0};
            this.totals.tDetails.push(tObj);
            tournament.playerFormsArray.forEach((playerTDetails)=>{
                for(let color in playerTDetails.colors){
                    
                    if(playerTDetails.colors[color]){
                        this.totals.drafters[color] ++;
                       
                        this.totals.tDetails[index][color] ++;
                        
                    }
                }
            });
            setTimeout(()=>{
                this.makeDynamicCharts(this.totals.tDetails[index],index);
            },100)
            
        });
        
    }
    makeDynamicCharts(t,i){

        const chartName = `draft${i}`;

        // CHART - Total Draft Colors
		Highcharts.chart(chartName, {
			chart: {
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false,
				type: 'pie',
				backgroundColor: '#f5f5f5',
			},
			title: {
				text: `${t.set} - Colors Drafted`
			},
			tooltip: {
				pointFormat: 'Drafted by <b>{point.y}</b> people'
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
					y: t.red,
					color: '#FAAA8F'
				}, {
					name: 'Blue',
					y: t.blue,
					color: '#A9E0F9'
				}, {
					name: 'Green',
					y: t.green,
					color: '#9BD3AE'
				}, {
					name: 'Black',
					y: t.black,
					color: '#000000'
				}, {
					name: 'White',
					y: t.white,
					color: '#FFFDD7'
				}]
			}]
		});
    }
	
}