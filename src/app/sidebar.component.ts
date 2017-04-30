import { Component } from '@angular/core';

@Component({
	template : `
		<div id="sideBar">
			<a routerLink="/sign-in" class="icon_container">
				<i class="fa fa-user" aria-hidden="true"></i>
			</a>
			<a routerLink="/standings" class="icon_container">
				<i class="fa fa-list-ol" aria-hidden="true"></i>
			</a>
			<a routerLink="/player" class="icon_container">
				<i class="fa fa-drivers-license-o" aria-hidden="true"></i>
			</a>
			<a routerLink="/add" class="icon_container">
				<i class="fa fa-trophy" aria-hidden="true"></i>
			</a>
			<a routerLink="/chat" class="icon_container">
				<i class="fa fa-comments-o" aria-hidden="true"></i>
			</a>
			<a routerLink="/rules" class="icon_container">
				<i class="fa fa-file-text-o " aria-hidden="true"></i>
			</a>
			
		</div>
	`,
	selector : 'sidebar-component',
	styles : [`
		#sideBar{
			width:36px;
			height:100%;
			position:fixed;
			right:0px;
			top:0px;
			background-color : #f07847;
			text-align:center;
			box-shadow:-1px 0px 2px;
		}
		#sideBar i{
			
		}
		#sideBar .icon_container{
			color:#740616;
			display:inline-block;
			margin-bottom:20px;
			border: solid 2px #740616;
			text-align:center;
			border-radius:50%;
			width:28px;
			height:28px;
			line-height:25px;
			margin-top:20px;
			cursor:pointer;
		}
		#sideBar .icon_container:hover i{
			color:white;
		}
		#sideBar .icon_container:hover{
			border-color:white;
		}
	`]
})
export class SidebarComponent{

}