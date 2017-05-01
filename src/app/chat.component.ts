import { Component } from '@angular/core';
import { ChatMessageSubComponent } from './chatMessageSubComponent.component';
import { ChatService } from './chat.service';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { FormBuilder, FormGroup} from "@angular/forms";
import { AuthService } from '../auth/auth.service';

@Component({
    selector : "chat-component",
    template : `
        <div class="page_wrapper">
			<div>	
				<h2>The Wall</h2>	
			</div>
			<span class="subheader">Login to post a message</span>
			<hr />
            <div id="chatWallWrapper">
                <div id="chatWall">
                    <div id="loadingMessagesContainer"  [hidden]="!isLoading">
                        <h3 class="text-muted">Retrieving messages from Heroku Node.js Server...</h3>
                    </div>
                    <div class="message_sub_wrapper" [hidden]="isLoading" *ngFor="let message of messages; let i = index">
                        <chat-message-sub-component [message]="message"></chat-message-sub-component>
                    </div>
                </div>
                <br />
                <div>
                    <form [formGroup]="sendMessageForm" (ngSubmit)="onSubmit(sendMessageForm)">
                        <div>
                            <textarea formControlName="message" id="inputText" placeholder="Enter a message to the group." autofocus></textarea>
                            <input type="submit" class="btn btn-primary btn-block pointer" value="submit" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `,
    styles : [`
        #chatWall{
            padding:20px;
            border-radius: 4px;
            border: solid 1px black;
            background-color:#2B2B2B;
            color: #E5E5E5;
            height:600px;
            overflow-y:scroll;
        }
        #chatWallWrapper{
            width: 90%;
            margin: 20px auto;
        }
        #inputText{
            width:100%;
        }
        #loadingMessagesContainer{
            text-align:center;
            margin-top:30%;
        }
        .message_sub_wrapper{
            margin-bottom:20px;
            min-height:100px;
        }
        .message_sub_wrapper:nth-child(even){
            text-align:right;
        }
   
        /deep/ .message_sub_wrapper:nth-child(even) .details{
            float:right;
            margin-left:10px;
        }
        /deep/ .message_sub_wrapper:nth-child(odd) .details{
            margin-right:10px;
        }
    `]
})
export class ChatComponent{
    messages = [];
    playersArray = [];
    allPlayersObs : FirebaseListObservable<any>;
    isLoading = true;
    sendMessageForm : FormGroup;
    user;

    constructor(private chatService : ChatService, af : AngularFire,  private fb: FormBuilder, private authService : AuthService){
        this.chatService = chatService;
        this.allPlayersObs = af.database.list('/players');
    }

    ngOnInit(){
        this.sendMessageForm = this.fb.group({
            message :['']
       });

       this.user = this.authService.getUser();
        console.log(this.user);

        let messageMatch = (function(){
            let counter = 0;
            return function(thisContext){
                counter ++;
                if(counter >= 2){
                    thisContext.messages.map((message)=>{
                        message.player = thisContext.playersArray.find((player)=>{
                            return message.pid === player.id;
                        });
                    });
                }
            }

        })();

        this.chatService.get().subscribe(results =>{
            this.messages = results.messages.sort((a,b) =>{
                return a > b ? a.id : b.id;
            }).reverse();
            messageMatch(this);
            this.isLoading = false;
            console.log('messages',this.messages);
        });

        this.allPlayersObs.subscribe((players)=>{
            
            this.playersArray = players;
            messageMatch(this);
            console.log('players',this.playersArray);
        });
        
    }

    onSubmit(form){
        console.log('FD',form);
        let matchingPlayer = this.playersArray.find((player)=>{
            return player.email === this.user.email;
        });

        /*if(matchingPlayer){
            this.chatService.post(matchingPlayer.id, matchingPlayer.firstName, form.value.message)
            .subscribe(results =>{
            
            });
        }else{

        }*/

    }
    
}