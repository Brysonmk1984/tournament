import { Component } from "@angular/core";

@Component({
	template : `
		<header>
			<h1>MTG DRAFT TRACKER</h1>
			<div id="hamburger" (click)="toggleMobileNav()" [ngClass]="{'hide' : nav_closed}">
				<i class="fa fa-bars fa-lg" *ngIf="nav_closed"></i>
				<i class="fa fa-close fa-lg" *ngIf="!nav_closed"></i>
			</div>
			<div id="mobileNav"  *ngIf="!nav_closed"  (click)="toggleMobileNav()">
				<a routerLink="/sign-in" routerLinkActive="active-link">
					<span class="link_container">
						<span class="icon_container"><i class="fa fa-user" aria-hidden="true"></i>&nbsp;&nbsp;</span>
						<span class="nav_text">Sign In</span>
					</span>
				</a>
				<a routerLink="/standings" routerLinkActive="active-link">
					<span class="link_container">
						<span class="icon_container"><i class="fa fa-list-ol" aria-hidden="true"></i>&nbsp;&nbsp;</span>
						<span class="nav_text">Standings</span>
					</span>
				</a>
				<a routerLink="/player" routerLinkActive="active-link">
					<span class="link_container">
						<span class="icon_container"><i class="fa fa-drivers-license-o" aria-hidden="true"></i>&nbsp;&nbsp;</span>
						<span class="nav_text">Player Details</span>
					</span>
				</a>
				<a routerLink="/add" routerLinkActive="active-link">
					<span class="link_container">
						<span class="icon_container"><i class="fa fa-trophy" aria-hidden="true"></i>&nbsp;&nbsp;</span>
						<span class="nav_text">New Tournament</span>
					</span>
				</a>
				<a routerLink="/stats" routerLinkActive="active-link">
					<span class="link_container">
						<span class="icon_container"><i class="fa fa-bar-chart" aria-hidden="true"></i>&nbsp;&nbsp;</span>
						<span class="nav_text">Statistics</span>
					</span>
				</a>
				<a routerLink="/chat" routerLinkActive="active-link">
					<span class="link_container">
						<span class="icon_container"><i class="fa fa-comments-o" aria-hidden="true"></i>&nbsp;&nbsp;</span>
						<span class="nav_text">Chat Wall</span>
					</span>
				</a>
				<a routerLink="/rules" routerLinkActive="active-link">
					<span class="link_container">
						<span class="icon_container"><i class="fa fa-file-text-o " aria-hidden="true"></i>&nbsp;&nbsp;</span>
						<span class="nav_text">Rules</span>
					</span>
				</a>
			</div>
		</header>
	`,
	selector : "header-component",
	styles : [`
		.hide{
			display: none;
		}
	    header{
	        background : #1f2329;
	        border-bottom:solid 5px #f07847;
	        line-height:65px;
	        height:65px;
	       
	    }
	   header h1{
	   		color : white;
	   		font-weight:bold;
	      	font-size:2.5em;
	    	padding:0px;
	    	line-height:65px;
	    	padding-left:15px;
	      	display:inline-block;
	    }
	    header a{
	    	color : white;
	    	line-height: 45px;
	    	display:inline-block;
	    	padding:0px 15px;
	    	border-left: solid 1px white;
	    	font-size:1.1em;
	    	text-decoration:none;
	    }
	    header nav{
	    	display:inline-block;
	    	float:right;
	    	
	    }
	    header a:hover{
	    	color:#f07847 !important;
	    		
		}
		#hamburger{
			display:none;
			width:100%;
			text-align:right;
			cursor:pointer;
		}
		#mobileNav{
			display:none;
			z-index:9000;
			position:absolute;
			color:white;
			left:0px;
			top:65px;
			width:100%;
		}
		#mobileNav a{
			display: block;
			color: white;
			background: #1f2329;
			border-bottom:solid 1px white;
			border-left:none;
			font-size: 1.4em;
		}
		@media(max-width : 739px){
			header h1{
				text-align:center;
				margin-left:-18px;
			}
			#hamburger{
				display:block;
				color:white;
				position:absolute;
				right:20px;
				top:20px;
				line-height:18px;
			}
			#mobileNav{
				display:block;
			}
		}
	  @media (max-width:550px){
   		header h1{
			font-size:2em;
		}
   		header{
   		   height:auto;
		}
		#mobileNav{
			display:block;
			top:75px;
		}
	   }
	`]
})

export class HeaderComponent{
	nav_closed : boolean = true;
	toggleMobileNav(){console.log('HERERE');
		this.nav_closed  = this.nav_closed ? false : true;
	}
}