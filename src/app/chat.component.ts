import { Component } from '@angular/core';
import { ChatMessageSubComponent } from './chatMessageSubComponent.component';
import { ChatService } from './chat.service';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { FormBuilder, FormGroup, Validators} from "@angular/forms";
import { AuthService } from '../auth/auth.service';

@Component({
    selector : "chat-component",
    template : `
        <div class="page_wrapper">
			<div>	
				<h2>The Discussion Wall</h2>	
			</div>
			<span *ngIf="!user.signedIn" class="subheader"><a href="./#/sign-in">Login</a> to post a message</span>
            <span *ngIf="user.signedIn" class="subheader">Post discussion related to past and future tournaments below</span>
			<hr />
            <div id="chatWallWrapper">
                <div id="chatWall">
                    <div id="loadingMessagesContainer"  [hidden]="!isLoading">
                        <h3>Retrieving messages from Heroku Node.js Server...</h3>
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
                            <input *ngIf="user.isAdmin" type="button" class="btn  btn-block pointer" value="Delete Last Message" (click)="deleteMessage()"  />
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
            background: url(http://brysonkruk.com/mtg/images/mtgGraphic.jpg);
            background-repeat:  no-repeat;
            background-size: 100% auto;
            background-position: center;
            background-color: #000000;
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
            margin-top:250px;
            color:white;
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

        /deep/ @media(max-width:805px){
            #chatWallWrapper #chatWall{
                padding: 8px;
            }
            .message{
                font-size: .8rem;
                padding: 2px;
            }
            .player_names{
                width:90px;
            }
        }
    `]
})
export class ChatComponent{
    messages = [];
    playersArray = [];
    allPlayersObs : FirebaseListObservable<any>;
    isLoading = false;
    sendMessageForm : FormGroup;
    chatBox;
    messageMatchCounter : number = 0;
    user : {signedIn, isAdmin, email, uid} = {
        signedIn : false,
        isAdmin : false,
        email : "",
        uid : ""
    };

    constructor(private chatService : ChatService, afdb : AngularFireDatabase,  private fb: FormBuilder, private authService : AuthService){
        this.chatService = chatService;
        this.allPlayersObs = afdb.list('/players');
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
        

        

        

        this.allPlayersObs.subscribe((players)=>{
            this.playersArray = players;
            this.messageMatch();
        });

        
    }

    ngAfterViewInit(){
        this.chatService.get().subscribe(results =>{
            console.log('RESULTS!', results);
            const sorted = results.messages.sort((a,b) =>{
                return (a.id-b.id);
            });

            this.messages = sorted.map((m)=>{
                const decodedMessage = decodeURIComponent(m.message);
                m.message = decodedMessage;
                return m;
            });
            this.messageMatch();
            
            this.chatBox = document.getElementById("chatWall");
            this.chatBox.scrollTop = this.chatBox.scrollHeight;
           
            this.isLoading = false;
            
        });

    }

    onSubmit(form){
        (<HTMLInputElement>document.getElementById("inputText")).value = "";
        //console.log('FD',form);
        let matchingPlayer = this.playersArray.find((player)=>{
            if(player.email === this.user.email){
                console.log(player.email,this.user.email);
            }
            return player.email === this.user.email;
        });
        //console.log('matching player - ', matchingPlayer);
        /* If existing player (Bryson has added their email to their user info in firebase) */
        if(matchingPlayer){
            let fullName = matchingPlayer.firstName + " " + matchingPlayer.lastName;
            let encodedMessage = encodeURIComponent(form.value.message.replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+'));
            console.log('asd',encodedMessage);
            this.chatService.post(matchingPlayer.id, fullName, encodedMessage)
            .subscribe(results =>{
                this.messages = results.messages.map((m)=>{
                    const decodedMessage = decodeURIComponent(m.message);
                    m.message = decodedMessage;
                    return m;
                });
                this.messageMatch();
                setTimeout(()=>{
                    this.chatBox.scrollTop = this.chatBox.scrollHeight;
                },100)
               
            });
        /* A registered user who has not been confirmed by bryson */
        }else{
            this.chatService.post(100, this.user.email, form.value.message)
            .subscribe(results =>{
                this.messages = results.messages;
                //console.log('results',results);
            });
        }

    }

    messageMatch(){
        this.messageMatchCounter ++;
        if(this.messageMatchCounter >= 2){
            this.messages.map((message)=>{
                message.player = this.playersArray.find((player)=>{
                    if(message.pid === player.id){
                        return message.pid === player.id;
                    }else if(message.name === player.email){
                        return message.name === player.email;
                    }else{
                        return undefined;
                    }
                });
            });
        }
        
            
    }

    deleteMessage(){
        const sortedMessages = this.messages.sort((a,b)=>{ return (a.id - b.id);});
        const lastMessageId = sortedMessages[sortedMessages.length -1].id;
        
        this.chatService.del(lastMessageId)
        .subscribe(results =>{
            this.messages = results.messages;
            console.log('results',results);
        });
        
    }
    
}