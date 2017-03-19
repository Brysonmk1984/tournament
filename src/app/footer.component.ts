import { Component } from "@angular/core";

@Component({
	template : `
		<footer>
		    <p>App by <a href="http://www.brysonkruk.com">Bryson Kruk</a></p>
		    <p>&copy; 2017 Bryson Kruk Design & Development</p>
		</footer>
	`,
	selector : "footer-component",
	styles : [`
	    footer{
	        background-color : #333;
	        height:200px;
	        text-align:center;
	        font-family: Arial, Helvetica, sans-serif;
	        color: white;
	        padding-top:100px;
	    }
	    footer a{
	        color : #00688B;
	    }

	`]
})

export class FooterComponent{
	
}