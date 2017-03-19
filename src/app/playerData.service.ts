import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class PlayerDataService {
	constructor(private http: Http){}
	
	getAllPlayers(){
		return this.http.get("http://www.brysonkruk.com/tournament/playerData.json")
			.map((res : Response) =>{
				let body = res.json();
				return body;
			}).catch(this.handleError);
		
	}
	getPlayer(id){

		return this.http.get("http://www.brysonkruk.com/tournament/playerData.json")
			.map((res : Response) =>{
				let body = res.json();
				
				let selectedPlayer = body.find(player =>{
					return player.id === id;
				});


				return selectedPlayer;
			}).catch(this.handleError);
	}



	private handleError(error : Response | any){
		let errMsg: string;
		   if (error instanceof Response) {
		     const body = error.json() || '';
		     const err = body.error || JSON.stringify(body);
		     errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
		   } else {
		     errMsg = error.message ? error.message : error.toString();
		   }
	
		   console.error('in handleError - ',errMsg);
		   return Observable.throw(errMsg);
	}
}