import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {FIREBASE_PROVIDERS, defaultFirebase, AngularFire, FirebaseListObservable, FirebaseRef} from 'angularfire2';

import { TournamentDetails } from "./TournamentDetails.interface";
import { TournamentPlayerDetails } from "./TournamentPlayerDetails.interface";
import { PlayerSubComponent } from "./playerSubComponent.component";

@Component({
	template : `
	<div class="page_wrapper">
		<div class="page_title_container">
			<h2>New Tournament Results</h2>
			<span class="subheader">Please enter the latest results from Challonge - All fields required</span>
			<br /><br />
		</div>

		<div id="formContainer">
			<form [formGroup]="tournament" (ngSubmit)="onSubmit(tournament)">
				<div id="tournamentInputContainer" formGroupName="tournamentDetails">
					<h3>Tournament Details</h3>
					
						<label>Date
							<input formControlName="date" type="date" />
						</label>
					
					
						<label>Draft Set
							<input formControlName="set" type="text" />
						</label>
				</div>
				<hr />
				<h3 class="vertical_align_top">Player Details </h3><span><input class="btn btn-default btn_incrementer" type="button" name="addPlayer" value="+" (click)="addPlayer()" /></span>
				<div class="player_input_container" formArrayName="playerFormsArray">
					<div *ngFor="let control of tournament.controls['playerFormsArray'].controls; let i = index">
								
						<player-sub-component 
						[tournament]="tournament.controls.playerFormsArray.controls[i]" [index] ="i"
						(remove)="removePlayer($event)"  [playerList]="playerList"
						></player-sub-component>
					
					</div>
				</div>
				<hr />
				<div class="clearfix">
					<div id="submitContainer" class="pull-right">
						<input class="btn btn-default" type="button"  value="Add Player" (click)="addPlayer()" />
						<input class="btn btn-default" type="button"  value="Reset" (click)="resetForm(tournament)" />
						<input class="btn btn-primary" type="submit" value="Submit" [disabled]="tournament.invalid" title="All form fields are required"   />
					</div>
				</div>
			</form>
		</div>
	</div>
	`,
	selector : "input-data-component",
	styleUrls : ['./inputData.component.sass']
})

export class InputDataComponent implements OnInit{
	
	tournament : FormGroup;
	tournaments$ : FirebaseListObservable<any>;
	players$: FirebaseListObservable<any>;
	playerList : any[] = [];
	root;
	constructor( private fb: FormBuilder, af :  AngularFire, @Inject(FirebaseRef) ref){
		this.tournaments$ = af.database.list('/tournaments');
		this.players$ = af.database.list('/players');
		this.root = ref.database();

		
	}

	ngOnInit(){

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

		
		
	}


	onSubmit({ value  , valid } : { value : {TournamentDetails, playerFormsArray}, valid: boolean }){
		console.log('submitted form data', value["tournamentDetails"]);

			// Loop through each submitted player from the form
			value.playerFormsArray.forEach((player) =>{
				console.log(player);
				this.dbUpdatePlayer(player, value["tournamentDetails"]);
			});
	

		//push tournament data
		this.tournaments$.push(value);

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
         score :  ['',Validators.required],
         tb :  ['',Validators.required],
         points :  ['',Validators.required],
         buchholz :  ['',Validators.required],
         ptsDiff :  ['',Validators.required]

         
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
		
		let colorData = {
			colors : [],
			date : formTournamentData.date,
			set : formTournamentData.set,
			wins : formPlayerData.wins,
			losses : formPlayerData.losses,
			draws : formPlayerData.draws
		};
		for(let color in formPlayerData.colors){
			if(formPlayerData.colors[color]){
				colorData.colors.push(color);
			}
		}

		//test
		/*this.root.ref('players/').orderByChild('id').equalTo(formPlayerData.id).once('value',test=>{
			console.log(test.val());
		});*/





		let calcId = function(playerList){
			let newArray = [];
			playerList.forEach(item =>{
				newArray.push(item.id);
			});
			return (Math.max(...newArray) + 1);
		};

		
			
			// existing player 
			if(formPlayerData.player !== "newPlayer"){console.log('existing player - ', parseInt(formPlayerData.player));
				playerRef.orderByChild('id').equalTo(parseInt(formPlayerData.player)).once('value',(snap)=>{
					console.log('snap',snap.val());
					snap = snap.val()[parseInt(formPlayerData.player)]
					playerData = {
						'matchWins' : snap.matchWins + formPlayerData.wins,
						'matchLosses' : snap.matchLosses + formPlayerData.losses,
						'matchDraws' : snap.matchDraws + formPlayerData.draws,
						'firstPlaces' : formPlayerData.rank === 1 ? snap.firstPlaces + 1 : snap.firstPlaces
					};
					
					playerRef.child(parseInt(formPlayerData.player)).update(playerData);
					playerRef.child(parseInt(formPlayerData.player)).child('colorPairHistory').push(colorData);
				});
				
			// new player 
			}else{console.log('new player');
				playerData = {
					'matchWins' : formPlayerData.wins,
					'matchLosses' : formPlayerData.losses,
					'matchDraws' : formPlayerData.draws,
					'firstPlaces' : formPlayerData.rank === 1 ? 1 : 0,
					'trackingSince' : formTournamentData.date,
				
					'score' : 0,
					'overallRanking' : 0,
					'powerRanking' : 0,
					'firstName' : formPlayerData.playerNameInfo.firstName,
					'lastName' : formPlayerData.playerNameInfo.lastName,
					'nickName' : formPlayerData.playerNameInfo.nickName,
					'id' : calcId(this.playerList) || 0
				};
				
				playerRef.child(parseInt(playerData.id)).set(playerData);
				this.root.ref('players/' + playerData.id).child("colorPairHistory").push(colorData);
			}

		
	}

}