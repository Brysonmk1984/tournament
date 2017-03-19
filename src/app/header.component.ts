import { Component } from "@angular/core";

@Component({
	template : `
		<header>
		<h1>MTG STANDINGS</h1>
		<nav>
		  <a routerLink="/">Home</a>
		  <a routerLink="/add">Add Tournament Results</a>
		  <a routerLink="/player">Player History</a>
		</nav>
		</header>
	`,
	selector : "header-component",
	styles : [`
	    header{
	        background : #333;
	        color : white;
	        font-weight:normal;
	        font-size:2em;
	        line-height:50px;
	        height:50px;
	       
	    }
	   header h1{
	    	padding:10px 20px;
	      display:inline-block;
	    }
	    header nav{
	    	display:inline-block;
	    	float:right;
	    }
	`]
})

export class HeaderComponent{

}