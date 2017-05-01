import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
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
        
    }

    delete(messageId){

    }
}