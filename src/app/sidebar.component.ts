import { Component } from '@angular/core';
import { RouterLinkActive } from '@angular/router';

@Component({
	template : `
		<div id="sideBar">
			<a routerLink="/sign-in" routerLinkActive="active-link">
				<span class="link_container">
					<span class="icon_container"><i class="fa fa-user" aria-hidden="true"></i></span>
					<span class="nav_text">Sign In</span>
				</span>
			</a>
			<a routerLink="/standings" routerLinkActive="active-link">
				<span class="link_container">
					<span class="icon_container"><i class="fa fa-list-ol" aria-hidden="true"></i></span>
					<span class="nav_text">Standings</span>
				</span>
			</a>
			<a routerLink="/stats" routerLinkActive="active-link">
				<span class="link_container">
					<span class="icon_container"><i class="fa fa-bar-chart" aria-hidden="true"></i></span>
					<span class="nav_text">Statistics</span>
				</span>
			</a>
			<a routerLink="/player" routerLinkActive="active-link">
				<span class="link_container">
					<span class="icon_container"><i class="fa fa-drivers-license-o" aria-hidden="true"></i></span>
					<span class="nav_text">Player Details</span>
				</span>
			</a>
			<a routerLink="/add" routerLinkActive="active-link">
				<span class="link_container">
					<span class="icon_container"><i class="fa fa-trophy" aria-hidden="true"></i></span>
					<span class="nav_text">New Tournament</span>
				</span>
			</a>
			<a routerLink="/chat" routerLinkActive="active-link">
				<span class="link_container">
					<span class="icon_container"><i class="fa fa-comments-o" aria-hidden="true"></i></span>
					<span class="nav_text">Chat Wall</span>
				</span>
			</a>
			<a routerLink="/rules" routerLinkActive="active-link">
				<span class="link_container">
					<span class="icon_container"><i class="fa fa-file-text-o " aria-hidden="true"></i></span>
					<span class="nav_text">Rules</span>
				</span>
			</a>
			
		</div>
	`,
	selector : 'sidebar-component',
	styles : [`
		#sideBar{
			width:40px;
			height:100%;
			position:fixed;
			right:0px;
			top:0px;
			background-color : #f07847;
			text-align:center;
			box-shadow:-1px 0px 2px;
			z-index:10000;
			-webkit-transition-property: width;
    		-webkit-transition-duration: 2s;
    		transition-property: width;
    		transition-duration: .3s;
		}
		#sideBar .link_container{
			height:45px;
			display:block;
			text-align:left;
			padding-left:5px;
			font-size:.9rem;
			border-bottom:solid 1px #740616;
			white-space:nowrap;
			line-height:45px;
		}
		#sideBar .link_container:hover{
			color:white;
		}
		#sideBar .link_container:hover i{
			color:white;
		}
		#sideBar .link_container:hover .icon_container{
			border-color:white;
		}

		#sideBar .active-link .link_container{
			color:#ffffff;
		}
		#sideBar .active-link .link_container i{
			color:#ffffff;
		}
		#sideBar .active-link .link_container .icon_container{
			border-color:#ffffff;
		}


		#sideBar .icon_container{
			color:#740616;
			display:inline-block;
			
			border: solid 2px #740616;
			text-align:center;
			border-radius:50%;
			width:28px;
			height:28px;
			line-height:25px;
			cursor:pointer;
		}
		#sideBar .nav_text{
			display:none;
		}
		#sideBar:hover{
			width:155px;
		}
		#sideBar:hover .nav_text{
			display:inline;
		}
		#sideBar a{
			text-decoration:none;
			color:#740616;
		}
		@media(max-width : 739px){
			#sideBar{
				display:none;
			}
		}
	`]
})
export class SidebarComponent{

}