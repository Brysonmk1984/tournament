import { Component } from "@angular/core";

@Component({
	template : `
		<footer>
			<p>See official rules here: <a href="/#/rules" >Rules</a></p>
		    <p>App by <a href="http://www.brysonkruk.com">Bryson Kruk</a></p>
		    <p>&copy; 2017 Bryson Kruk Design & Development</p>
		</footer>
	`,
	selector : "footer-component",
	styles : [`
	    footer{
	        background-color : #1f2329;
	        height:300px;
	        text-align:center;
	        font-family: Arial, Helvetica, sans-serif;
	        color: white;
	        padding:125px;
	        border-top:solid 5px #f07847;
	    }
	    footer a{
	        color : #00688B;
	    }


	`]
})

export class FooterComponent{
	
}