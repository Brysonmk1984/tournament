import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class ChatService{
    constructor(private http : Http){}

    get() : Observable<any>{
        return this.http.get("https://tournament-chat-wall.herokuapp.com/chat-wall-api")
                .map((res : Response)=>{
                    let body = res.json();
                    return body;
                });
    }

    post(pid, name, message){
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        let options = new RequestOptions({ headers: headers });
        


        return this.http.post(`https://tournament-chat-wall.herokuapp.com/chat-wall-api/?pid=${pid}&message=${message}&name=${name}`, options)
                .map((res : Response)=>{
                    let body = res.json();
                    return body;
                });
    }

    del(messageId){

        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        let options = new RequestOptions({ headers: headers });
        return this.http.delete(`https://tournament-chat-wall.herokuapp.com/chat-wall-api/${messageId}`, options)
                .map((res : Response)=>{
                    let body = res.json();
                    return body;
                });
    }
}