import { Component, OnInit } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Router } from "@angular/router";

import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import suffix from "../utility/placementSuffix";

@Component({
  template: `
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
						<th>Player</th>
						<th class="small_screen_hide"></th>
						<th class="small_screen_hide"></th>
						<th class="text-right primary_column">Power Rank</th>
						<th class="text-right">Overall Rank</th>
						
						<th class="text-right small_screen_hide">1st Place FInishes</th>
						<th class="text-right">Match Wins</th>
						<th class="text-right">Match Losses</th>
						<th class="text-right">Match Draws</th>
						
					</tr>
					<tr *ngFor="let player of playerList">
						<td (click)="playerSelected(player.firstName, player.lastName)" class="">
							<img [ngClass]="{ranked_first : player.wonLastTournament === true}" class="profile_image img-thumbnail" src="{{player.photoUrl}}" />
							<div class="large_screen_hide">
								<span class="belt_row" [ngClass]="{has_belt : player.wonLastTournament === true}" ><img src="http://www.brysonkruk.com/tournament/images/belt.png" title="{{player.firstName}} Won the Last Tournament" /></span>
							</div>
						</td>
						<td class="small_screen_hide" (click)="playerSelected(player.firstName, player.lastName)"><div class="player_names">{{player.firstName}} {{player.lastName}}<br /><em class="text-muted">{{player.nickName}}</em></div></td>
						<td class="small_screen_hide"><span class="belt_row" [ngClass]="{has_belt : player.wonLastTournament === true}" ><img src="http://www.brysonkruk.com/tournament/images/belt.png" title="{{player.firstName}} Won the Last Tournament" /></span></td>
						<td class="text-right primary_column"><span class="large_text">{{player.powerRanking | suffix}}</span> <em class="text-muted small">({{ player.powerScore | round}})</em></td>
						<td class="text-right"><span class="large_text">{{player.overallRanking | suffix}}</span> <em class="text-muted small">({{player.overallScore}})</em></td>
						
						<td class="text-right small_screen_hide">{{player.firstPlaces}}</td>
						<td class="text-right">{{player.matchWins}}</td>
						<td class="text-right">{{player.matchLosses}}</td>
						<td class="text-right">{{player.matchDraws}}</td>
						
					</tr>
				</table>
			</div>
		</div>
	`,
  selector: "standings-component",
  styles: [
    `
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
		.belt_row{
			display:none;
		}
		.belt_row.has_belt{
			width:100px;
			display: inline-block;
			text-align: center;
		}
		.belt_row.has_belt img{
			width: 100px;

		}
		.large_screen_hide{
			display:none;
		}
		.large_text{
			font-size:1.1em;
		}
		.primary_column{
			background-color:rgba(240,120,71,.1);
		}
		@media(max-width:805px){
			.small_screen_hide{
				display:none;
			}
			.large_screen_hide{
				display:block;
			}
			.has_belt{
				text-align:left;
			}
			.belt_row.has_belt{
				width:70px;
			}
			.has_belt img{
				display:inline-block;
				width:70px !important;
			}
			.table th, .table td{
				padding:.25rem;
			}
		}
		
		
	`
  ]
})
export class StandingsComponent {
  playerList = [];
  allPlayers: FirebaseListObservable<any>;
  parentRouter;
  constructor(afdb: AngularFireDatabase, router: Router) {
    this.parentRouter = router;
    this.allPlayers = afdb.list("/players");
  }

  ngOnInit() {
    this.allPlayers.subscribe(players => {
      this.playerList = players.sort((a, b) => {
        return a.powerRanking - b.powerRanking;
      });
    });
  }
  playerSelected(firstName: string, lastName?: string) {
    if (lastName) {
      this.parentRouter.navigateByUrl(
        "/player/" + firstName.toLowerCase() + "-" + lastName.toLowerCase()
      );
    } else {
      this.parentRouter.navigateByUrl("/player/" + firstName.toLowerCase());
    }
	
  }
}
