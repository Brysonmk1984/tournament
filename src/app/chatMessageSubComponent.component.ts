import { Component, Input } from '@angular/core';

@Component({
    selector : "chat-message-sub-component",
    template : `
        <div class="chat_message_wrapper">
            <div class="details inline_block">
                <img class="profile_image img-thumbnail" src="{{message?.player?.photoUrl || 'http://brysonkruk.com/tournament/images/blank.jpg'}}" />
                <div class="player_names">
                    <span *ngIf="message?.player?.firstName" class="block">{{(message.player.firstName || "") + ' ' + (message?.player?.lastName || "")}}</span>
                    <span *ngIf="!message?.player?.firstName" class="block">{{message.name}}</span>
                </div>
            </div>
            <div class="message inline_block vertical_align_top">
                <p>{{message.message}}</p>
                <p><em class="text-muted">{{message.timestamp | date:'medium'}}</em></p>
            </div>
        </div>
    `,
    styles : [`
        .profile_image{
			max-width:70px;
			width:70px;
			height:70px;
			cursor:pointer;
		}
		.player_names{
			cursor: pointer;
            margin-top:10px;
		}
        .message{
            padding:10px;
            border: 1px solid #ddd;
            background-color: white;
            color:#333;
            border-radius: 2px;
            max-width:60%;
            word-wrap: break-word;
            text-align:left;
        }
    `]

})

export class ChatMessageSubComponent{
    @Input() message;
    selectedPlayer = "";

    
}