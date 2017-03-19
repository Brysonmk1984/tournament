import { Component } from '@angular/core';

import { HeaderComponent } from './header.component';
import { InputDataComponent } from './inputData.component';
import { PlayerHistoryComponent } from './playerHistory.component';
import { StandingsComponent } from './standings.component';
import { FooterComponent } from './footer.component';

//import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  challongeKey = "IOUHkRV4ZGrAphKrUpENx5s4o15NF2Ripsn2EyZr";
  url = "https://brysonmk1984:IOUHkRV4ZGrAphKrUpENx5s4o15NF2Ripsn2EyZr@api.challonge.com/v1/tournaments.json";

  /*players: FirebaseListObservable<any>;
    constructor(af: AngularFire) {
      this.players = af.database.list('/players');
    }

  ngOnInit(){

  		  this.players.subscribe(snapshot => {
  			  console.log('snapshot',snapshot);
  			});
  }*/


 
}
