import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'player-sub-component',
    template: `
    <div [formGroup]="tournament" >
    	<div>
  	    	<div>
  	    		<h4>Player {{index + 1}} - </h4>
    			<select formControlName="player" id="players" (change)="selectPlayerChange($event)">
    			 	<option value="">Select Player</option>
    			 	<option *ngFor="let player of playerList" value="{{player.id}}">{{player.firstName}} {{player.lastName}}</option>
    				<option value="newPlayer">New Player</option>
    			</select>
	  	    	<div formGroupName="colors" class="inline_block color_checkboxes">
		  	    	<strong class="inline_block colors_title">Colors: </strong>
		  	    	<label>Red
		  	    		<input formControlName="red" type="checkbox" class="text_input"  />
		  	    	</label>
		  	    	<label>Blue
		  	    		<input formControlName="blue" type="checkbox" class="text_input"  />
		  	    	</label>
		  	    	<label>White
		  	    		<input formControlName="white" type="checkbox"  class="text_input" />
		  	    	</label>
		  	    	<label>Black
		  	    		<input formControlName="black" type="checkbox" class="text_input"  />
		  	    	</label>
		  	    	<label>Green
		  	    		<input formControlName="green" type="checkbox" class="text_input"  />
		  	    	</label>
		  	   </div>
  	    		<div class="remove_player" (click)="removePlayer(index)" title="Remove Player">-</div>
  	    	</div>
  	    	
  	    	<div formGroupName="playerNameInfo" *ngIf="newPlayer">
	  	    	<label>First Name
	  	    		<input formControlName="firstName" type="text" class="text_input" />
	  	    	</label>
	  	    	<label>Last Name
	  	    		<input formControlName="lastName" type="text"  class="text_input"/>
	  	    	</label>
	  	    	<label>Nick Name
	  	    		<input formControlName="nickName" type="text" class="text_input" />
	  	    	</label>
	  	   </div>
  	    	<br />
  	    	<label>Rank
  	    		<input formControlName="rank" type="number" class="text_input" />
  	    	</label>
  	    	<label>Wins
  	    		<input formControlName="wins" type="number" class="text_input" />
  	    	</label>
  	    	<label>Losses
  	    		<input formControlName="losses" type="number" class="text_input" />
  	    	</label>
  	    	<label>Draws
  	    		<input formControlName="draws" type="number" class="text_input" />
  	    	</label>
  	    	<label>Byes
  	    		<input formControlName="byes" type="number" class="text_input" />
  	    	</label>
  	    	<label>Score
  	    		<input formControlName="score" type="number" class="text_input" />
  	    	</label>
  	    </div>
    </div>
    <hr />
   

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