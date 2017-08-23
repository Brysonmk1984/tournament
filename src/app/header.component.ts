import { Component } from "@angular/core";

@Component({
	template : `
		<header>
		<h1>MTG DRAFT TRACKER</h1>
		</header>
	`,
	selector : "header-component",
	styles : [`
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
	    	line-height: 65px;
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
	    @media (max-width:805px){
		    	header h1{
		    		text-align:center;
		    		margin-left:-18px;
		    	}
		    	/*header{
		    		height:130px;
		    	}
		    	header h1{
		    		display:block;
		    		text-align:center;
		    		margin-bottom:0px;
		    	}
		    	header nav{
		    		display:block;
		    		text-align:center;
		    		border-top:solid 1px white;
		    		float:none;
		    	}
		    	header a{
		   
		    		width:32%;
		    		display:inline-block;
		    		
		    		
		    	}
		    	header a:first-child{
		    		border-left: none;
		    	}*/
	    }
	  @media (max-width:550px){
   		 /*header a{
   			width:100%;
   			display:block;
   			border-bottom: solid 1px white;
   		}*/
   		header{
   		   height:auto;
   		   
   		}
	   }
	`]
})

export class HeaderComponent{

}