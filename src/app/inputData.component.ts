import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
// Don't think this is actually needed. used in place of FirebaseRef, which I don't even think was being used on this page
import { FirebaseApp } from 'angularfire2';

import { environment } from "../environments/environment";

import { CalculateRanking } from "./calculateRanking.service";
import { AuthService } from '../auth/auth.service';
import { PlayerTournament, Player, PlayerNameInfo, Colors, PlayerForm, TournamentDetails, Tournament, User } from './interface';

@Component({
	template : `
	<div class="page_wrapper">
		<div class="page_title_container">
			<h2>New Tournament Results</h2>
			<span  *ngIf="user?.isAdmin" class="subheader">All fields Required</span>
			<span *ngIf="!user?.isAdmin" class="subheader non_admin">Only admins may submit tournament data</span>
			<br />
			<hr />
			<br />
		</div>

		<div id="formContainer">
			<form [formGroup]="tournament" (ngSubmit)="onSubmit(tournament)">
				<div id="tournamentInputContainer" formGroupName="tournamentDetails">
					<h3>Tournament Details: production</h3>
						<div id="tournamentDetails" class="inline_block">
							<label class="inline_block">Date
								<input formControlName="date" type="date" class="text_input" placeholder="mm/dd/yy" />
							</label>
							<label class="inline_block">Draft Set
								<input formControlName="set" type="text" class="text_input" />
							</label>
						</div>
				</div>
				<hr />
				<div id="playerDetails">
					<h3 class="vertical_align_top">Participants</h3><span><div id="addPlayer" title="Add Player to This Tournament" (click)="addPlayer()"> + </div></span>
				</div>
				<div class="player_input_container" formArrayName="playerFormsArray">
					<div *ngFor="let control of tournament.controls['playerFormsArray'].controls; let i = index">
								
						<player-sub-component 
						[tournament]="tournament.controls.playerFormsArray.controls[i]" [index] ="i"
						(remove)="removePlayer($event)"  [playerList]="playerList"
						></player-sub-component>
					
					</div>
				</div>
				<div class="clearfix">
					<div id="pleaseSignInContainer" *ngIf="!tournament.untouched && !user?.isAdmin"   class="bg-danger">
							<span>Please <a href="./sign-in" >sign in</a> to submit new tournament data.</span>
					</div>
					<div id="submitContainer" class="pull-right">
						<button class="btn btn-default" type="button" (click)="addPlayer()" title="Add Player to This Tournament">Add Player</button>
						<button class="btn btn-default" type="button" (click)="resetForm(tournament)">Reset</button>
						<button class="btn btn-default" type="button" (click)="updateRankings()" [disabled]="!user?.isAdmin" title="Recalculate">Recalculate</button>
						<input class="btn btn-primary" type="submit" value="Submit" [disabled]="tournament.invalid || !user?.isAdmin" title="All form fields are required"   />
					</div>
				</div>
			</form>
		</div>
	</div>
	`,
	selector : "input-data-component",
	styleUrls : ['./inputData.component.sass'],
	// CalculateRanking needed here because it's not added in app.module.ts
	providers : [CalculateRanking]
})

export class InputDataComponent implements OnInit{
	
	tournament : FormGroup;
	tournaments$ : FirebaseListObservable<any>;
	players$: FirebaseListObservable<any>;
	playerList : Player[] = [];
	tournamentList : Tournament[] = [];
	root : any;
	user : User;
	updateError = {value:false, message:""};
	constructor( private fb: FormBuilder, afdb :  AngularFireDatabase, @Inject(FirebaseApp) ref, private calculateRanking : CalculateRanking, private authService : AuthService){
		this.tournaments$ = afdb.list('/tournaments');
		this.players$ = afdb.list('/players');
		this.root = ref.database();
	}

	ngOnInit(){
		//this.calculateRanking.calculateRanking();
		this.authService.watch()
		.subscribe((user : User) : void =>{
			
			this.user = user;
			//console.log('USER', this.user);
		});

		this.tournament  = this.fb.group({
			tournamentDetails : this.fb.group({
				date : ['',Validators.required],
				set : ['',Validators.required]
			}),
			playerFormsArray : this.fb.array([])
		});
		
		this.players$.subscribe(players => {
			this.playerList = players
		});

		this.addPlayer();
		this.addPlayer();
		this.addPlayer();
		this.addPlayer();

		this.tournaments$.subscribe(tournaments => {
			this.tournamentList = tournaments;
		});
		//console.log('ROOT',this.root);
	}


	onSubmit({ value  , valid } ){
		
		console.log('submitted tournament data', value["tournamentDetails"]);
			
		if(this.tournamentList.length > 0){
			value.tournamentDetails.id = this.calcTournamentId(this.tournamentList);
		}else{
			value.tournamentDetails.id = 0;
		}
		
		//push tournament data
		this.root.ref('tournaments/').child(parseInt(value.tournamentDetails.id)).set(value);
		
		let participantsArray : number[] = [];
		let nonParticipantsArray : number[] = [];
		// Loop through each submitted player from the form
		value.playerFormsArray.forEach((player) =>{
			if(this.updateError.value === false){
				participantsArray.push(parseInt(player.player));
				this.dbUpdatePlayer(player, value["tournamentDetails"]);
			}else{
				alert(`ERROR: ${this.updateError.message}`);
				return;
			}
		});

		// fix this later
		setTimeout(()=>{
			// Need to update non participants to set that they don't have the belt	
			this.playerList.forEach((player) =>{console.log('player',player);
				let check = participantsArray.find((item)=>{
					return player.id === item;
				});
				if(check === undefined){nonParticipantsArray.push(player.id);}
			});

			nonParticipantsArray.forEach((id) =>{
				if(this.updateError.value === false){
					this.dbUpdateNonParticipant(id);
				}else{
					alert(`ERROR: ${this.updateError.message}`);
					return;
				}
			});

			if(this.updateError.value === false){
				
				this.calculateRanking.calculateRanking();
				alert('Data has been successfully updated!');
				window.location.href = "/#/standings";
			}
		},2000);
		

	}
	resetForm(form){
		this.tournament  = this.fb.group({
			tournamentDetails : this.fb.group({
				date : ['',Validators.required],
				set : ['',Validators.required]
			}),
			playerFormsArray : this.fb.array([])
		});
		this.addPlayer();
	}
	addPlayer(){
		const arrayControl = <FormArray>this.tournament .controls['playerFormsArray'];
		let newGroup = this.fb.group({
         //playerId :  ['',Validators.required],
         player : ['',Validators.required],
         rank :  ['',Validators.required],
         colors : this.fb.group({
         	red :  [''],
         	blue :  [''],
         	white :  [''],
         	black :  [''],
         	green :  ['']
         }),
         playerNameInfo : this.fb.group({
         	firstName : [''],
         	lastName : [''],
         	nickName : ['']
        }),
         wins :  ['',Validators.required],
         losses :  ['',Validators.required],
         draws :  ['',Validators.required],
         byes :  ['',Validators.required],
         score :  ['',Validators.required]
      });

		arrayControl.push(newGroup);
		
	}
	removePlayer(index : number){
		const arrayControl = <FormArray>this.tournament .controls['playerFormsArray'];
		arrayControl.removeAt(index);
	}

	dbUpdatePlayer(formPlayerData, formTournamentData){
		console.log('fd',formPlayerData, formTournamentData);

		let snap;
		let playerData;

		let playerRef = this.root.ref('players/');
		
		let playerTournamentData = {
			id : formTournamentData.id,
			colors : [],
			date : formTournamentData.date,
			set : formTournamentData.set,
			wins : formPlayerData.wins,
			losses : formPlayerData.losses,
			draws : formPlayerData.draws,
			byes : formPlayerData.byes,
			score : formPlayerData.score,
			place : formPlayerData.rank
		};

		for(let color in formPlayerData.colors){
			if(formPlayerData.colors[color]){
				playerTournamentData.colors.push(color);
			}
		}
		// existing player 
		if(formPlayerData.player !== "newPlayer"){console.log('existing player - ', parseInt(formPlayerData.player));
			

			playerRef.orderByChild('id').equalTo(parseInt(formPlayerData.player)).once('value',(snap)=>{
				snap = snap.val()[parseInt(formPlayerData.player)];
				
				playerData = {
					'matchWins' : snap.matchWins + formPlayerData.wins,
					'matchLosses' : snap.matchLosses + formPlayerData.losses,
					'matchDraws' : snap.matchDraws + formPlayerData.draws,
					'firstPlaces' : formPlayerData.rank === 1 ? snap.firstPlaces + 1 : snap.firstPlaces,
					'wonLastTournament' : formPlayerData.rank === 1 ? true : false,
					'trackingSince' : snap.trackingSince ? snap.trackingSince : formTournamentData.date
				};
				
				playerRef.child(parseInt(formPlayerData.player)).update(playerData);

				playerRef.once('value',(snap2)=>{console.log('IN');
					playerRef.child(parseInt(formPlayerData.player)).child('tournamentHistory').child(playerTournamentData.id).set(playerTournamentData, function(error){
						if (error) {
							this.updateError.value = true;
							this.updateError.message = error;
						}
					});
					
				});

				
			});
			
		// new player 
		}else{console.log('new player',formPlayerData);
			playerData = {
				'matchWins' : formPlayerData.wins,
				'matchLosses' : formPlayerData.losses,
				'matchDraws' : formPlayerData.draws,
				'firstPlaces' : formPlayerData.rank === 1 ? 1 : 0,
				'wonLastTournament' : formPlayerData.rank === 1 ? true : false,
				'trackingSince' : formTournamentData.date,
				'photoUrl' : 'http://brysonkruk.com/tournament/images/blank.jpg',
				'score' : "",
				'overallRanking' : "",
				'powerRanking' : "",
				'powerScore' : "",
				'firstName' : formPlayerData.playerNameInfo.firstName,
				'lastName' : formPlayerData.playerNameInfo.lastName,
				'nickName' : formPlayerData.playerNameInfo.nickName,
				'tournamentHistory' : [playerTournamentData],
				'id' : this.calcId(this.playerList) || 0
			};

			// Update player info
			playerRef.child(parseInt(playerData.id)).set(playerData);

			// Add to player tournament history data
			/*playerRef.once('value',(snap2)=>{
				playerRef.child(parseInt(playerData.id)).child('tournamentHistory').child(playerTournamentData.id).set(playerTournamentData);
			});*/


		}

		
	}

	dbUpdateNonParticipant(id){
		this.root.ref('players/' + id).child('wonLastTournament').set(false, function(error){
			if (error) {
				this.updateError.value = true;
				this.updateError.message = error;
			}
		});
	}


	private calcId(list){
		let newArray = [];
			list.forEach(item =>{
				newArray.push(item.id);
			});
			//console.log((Math.max(...newArray) + 1));
			return (Math.max(...newArray) + 1);
	}

	private calcTournamentId(list){
		let newArray = [];
			list.forEach(item =>{
				newArray.push(item.tournamentDetails.id);
			});
			//console.log('asd',...newArray,(Math.max(...newArray) + 1));
			return (Math.max(...newArray) + 1);
	}

	private updateRankings(){
		this.calculateRanking.calculateRanking();
	}


}