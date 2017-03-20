import { Component } from "@angular/core";

@Component({
	template : `
		<header>
		<h1>STANDINGS</h1>
		<nav>
		  <a routerLink="/">Standings</a>
		  <a routerLink="/add">New Tournament</a>
		  <a routerLink="/player">Player History</a>
		</nav>
		</header>
	`,
	selector : "header-component",
	styles : [`
	    header{
	        background : #333;
	        
	        
	        line-height:50px;
	        height:50px;
	       
	    }
	   header h1{
	   	color : white;
	   	font-weight:normal;
	        font-size:2em;
	    	padding:10px 20px;
	      display:inline-block;
	    }
	    header a{
	    	color : white;
	    	line-height: 50px;
	    	display:inline-block;
	    	padding:0px 10px;
	    	border-left: solid 1px white;
	    }
	    header nav{
	    	display:inline-block;
	    	float:right;
	    }
	`]
})

export class HeaderComponent{

}