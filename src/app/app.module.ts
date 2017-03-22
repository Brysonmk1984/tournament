import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Pipe, PipeTransform } from '@angular/core';


import { AlertModule } from 'ng2-bootstrap';
import { AngularFireModule } from 'angularfire2';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header.component';
import { InputDataComponent } from './inputData.component';
import { PlayerSubComponent } from "./playerSubComponent.component";
import { PlayerHistoryComponent } from './playerHistory.component';
import { StandingsComponent } from './standings.component';
import { FooterComponent } from './footer.component';
import { KeysPipe } from './keys.pipe';

export const ROUTES: Routes = [
	{ path : "", component : StandingsComponent },
	{ path : "standings", component : StandingsComponent },
	{ path : "add", component : InputDataComponent },
	{ path : "player", component : PlayerHistoryComponent },
	{ path : "player/:playerid", component : PlayerHistoryComponent },
	{ path : "player/:playerlast", component : PlayerHistoryComponent }
];

// Must export the config
export const firebaseConfig = {
  apiKey: "AIzaSyA4yBfeXOTJBhBJ81zsPhT1Doh_-2RPj18",
  authDomain: "mtg-standings.firebaseapp.com",
  databaseURL: "https://mtg-standings.firebaseio.com",
  storageBucket: "mtg-standings.appspot.com",
  messagingSenderId: "637468525174"
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    InputDataComponent,
    PlayerSubComponent,
    PlayerHistoryComponent,
    StandingsComponent,
    FooterComponent,
    KeysPipe
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES),
    ReactiveFormsModule,
    FormsModule,
    HttpModule,
    AlertModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
