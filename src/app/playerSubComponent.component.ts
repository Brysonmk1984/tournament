import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'player-sub-component',
    template: `
    <div [formGroup]="tournament" >
    	<div>
  	    	<div>
  	    		<h4>Player {{index + 1}}</h4>
  	    		<span><input class="btn btn-default btn_decrementer" type="button" name="removePlayer" value="-" (click)="removePlayer(index)" /></span>
  	    	</div>
  	    	<label>Player
  	    		 	<select formControlName="player" id="players" (change)="selectPlayerChange($event)">
  	    		 		<option value="">Select Player</option>
  	    		 		<option *ngFor="let player of playerList" value="{{player.id}}">{{player.firstName}} {{player.lastName}} {{player.id}}</option>
  	    				<option value="newPlayer">New Player</option>
  	    		 </select>
  	    	</label>
  	    	<div formGroupName="playerNameInfo" *ngIf="newPlayer">
	  	    	<label>First Name
	  	    		<input formControlName="firstName" type="text" />
	  	    	</label>
	  	    	<label>Last Name
	  	    		<input formControlName="lastName" type="text" />
	  	    	</label>
	  	    	<label>Nick Name
	  	    		<input formControlName="nickName" type="text" />
	  	    	</label>
	  	   </div>
  	    	<br />
  	    	<label>Rank
  	    		<input formControlName="rank" type="number" />
  	    	</label>
  	    	<div formGroupName="colors" class="inline-block">
	  	    	<strong>Colors: </strong>
	  	    	<label>Red
	  	    		<input formControlName="red" type="checkbox"  />
	  	    	</label>
	  	    	<label>Blue
	  	    		<input formControlName="blue" type="checkbox"  />
	  	    	</label>
	  	    	<label>White
	  	    		<input formControlName="white" type="checkbox"  />
	  	    	</label>
	  	    	<label>Black
	  	    		<input formControlName="black" type="checkbox"  />
	  	    	</label>
	  	    	<label>Green
	  	    		<input formControlName="green" type="checkbox"  />
	  	    	</label>
	  	   </div>
  	    	<label>Wins
  	    		<input formControlName="wins" type="number" />
  	    	</label>
  	    	<label>Losses
  	    		<input formControlName="losses" type="number" />
  	    	</label>
  	    	<label>Draws
  	    		<input formControlName="draws" type="number" />
  	    	</label>
  	    	<label>Byes
  	    		<input formControlName="byes" type="number" />
  	    	</label>
  	    	<label>Score
  	    		<input formControlName="score" type="number" />
  	    	</label>
  	    </div>
    </div>
   

    `
})
export class PlayerSubComponent { 
	@Input() tournament :  FormGroup;
	@Input() index :  number;
	@Input() playerList : any[];
	@Output() remove : EventEmitter<string> = new EventEmitter();
	removePlayer(index){
		this.remove.emit(index);
	}
	newPlayer;
	constructor(){
		this.newPlayer = false;
	}
	selectPlayerChange(e){
		let val = e.target.value;
		if(val === "newPlayer"){
			this.newPlayer = true;
			this.tournament.controls['playerNameInfo'].setValue({
				firstName : "",
				lastName : "",
				nickName : "",
			});
			// Show player name and player nick name input
		}else{console.log(this.playerList);
			this.newPlayer = false;
			let selectedPlayer = this.playerList.find((player) =>{
				return player.id === parseInt(val);
			});
			this.tournament.controls['playerNameInfo'].setValue({
				firstName : selectedPlayer.firstName,
				lastName : selectedPlayer.lastName,
				nickName : selectedPlayer.nickName,
			});
		}

	}

}