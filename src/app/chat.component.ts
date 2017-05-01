import { Component } from '@angular/core';
import { ChatMessageSubComponent } from './chatMessageSubComponent.component';
import { ChatService } from './chat.service';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { FormBuilder, FormGroup, Validators} from "@angular/forms";
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
                <div *ngIf="user.signedIn">
                    <form [formGroup]="sendMessageForm" (ngSubmit)="onSubmit(sendMessageForm)">
                        <div>
                            <textarea formControlName="message" id="inputText" placeholder="Enter a message to the group." autofocus></textarea>
                            <br />
                            <input type="submit" class="btn btn-primary btn-block pointer" value="submit" [disabled]="!sendMessageForm.valid"  />
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
    user : {signedIn, isAdmin, email, uid} = {
        signedIn : false,
        isAdmin : false,
        email : "",
        uid : ""
    };

    constructor(private chatService : ChatService, af : AngularFire,  private fb: FormBuilder, private authService : AuthService){
        this.chatService = chatService;
        this.allPlayersObs = af.database.list('/players');
    }

    ngOnInit(){
        this.sendMessageForm = this.fb.group({
            message :['',Validators.compose([Validators.required])]
       });

       this.authService.watch()
        .subscribe(user =>{
            console.log('USER',user);
            this.user = user;
        });
        

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
        console.log(matchingPlayer);
        /* If existing player (Bryson has added their email to their user info in firebase) */
        if(matchingPlayer){
            let fullName = matchingPlayer.firstName + " " + matchingPlayer.lastName;
            this.chatService.post(matchingPlayer.id, fullName, form.value.message)
            .subscribe(results =>{
                console.log('results',results);
            });
        /* A registered user who has not been confirmed by bryson */
        }else{
            this.chatService.post(100, this.user.email, form.value.message)
            .subscribe(results =>{
                console.log('results',results);
            });
        }

    }
    
}