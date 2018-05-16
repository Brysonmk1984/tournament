import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AuthService } from './auth.service';
@Component({
    moduleId: module.id,
    selector: 'sign-in',
    template:`
        <div class="page_wrapper">
            <div class="page_title_container">
              
                <div id="loggedInStatus" *ngIf="user.signedIn then loggedIn else loggedOut"></div>
                <ng-template #loggedIn>
                    <h2>You Are Signed In</h2>
                    <span class="subheader">Click 'Log out' to sign out.</span>
                </ng-template>
                <ng-template #loggedOut>
                    <h2>Sign In</h2>
                    <span class="subheader">Email and password are required.</span>
                </ng-template>
                
                <br />
                <hr />
                <br />
            </div>
            <form [formGroup]="signUpForm" (ngSubmit)="onSubmit(signUpForm)">
                <div id="signedIn" class="inner_form_wrapper" *ngIf="user.signedIn">
                    <h4>Currently Logged In : </h4>
                    <h4 class="text-muted">{{user.email}}</h4>
                    <button type="button" class="btn btn-primary btn-block" (click)="signOut()">Log out</button>
                </div>
                <div class="inner_form_wrapper"  *ngIf="!user.signedIn">
                    <div class="input_div">
                        <label>
                            <strong>Email:</strong>
                            <input formControlName="email" type="email" />
                        </label>
                    </div>
                    <div class="input_div">
                        <label>
                            <strong>Password:</strong>
                            <input formControlName="password" type="password" />
                        </label>
                    </div>
                    <div id="errorContainer" *ngIf="logIn.error"  class="bg-danger">
                        <strong>{{logIn.error}}</strong>
                    </div>
                    <button type="submit" class="btn btn-primary btn-block" [disabled]="!signUpForm.valid">Submit</button>
                    <div id="noAccount">
                        <strong>No Account? Create one <a href="./#/create-account">here.</a></strong>
                    </div>
                </div>
                
            </form>
        </div>
    `,
    styles : [`
        input[type='text'],
        input[type='email']{
            width:200px;
        }
        button{
            margin-top:30px;
            display:block;
            cursor:pointer;
        }
        .input_div{
            width:285px;
        }
        label span, label strong{
            display:inline-block;
            width:80px;
            
        }
        #signedIn{
            text-align:center;
        }
        .inner_form_wrapper{
           width:300px;
           margin:0px auto;
        }
        #noAccount{
            margin-top:20px;
            text-align:center;
        }
    `]
})

export class SignInComponent implements OnInit {
    signUpForm : FormGroup;
    user : {signedIn, isAdmin, email, uid} = {
        signedIn : false,
        isAdmin : false,
        email : "",
        uid : ""
    };
    logIn = {
        error : ""
    };
    constructor( private fb: FormBuilder, /*private af : AngularFire,*/ private authService : AuthService) { }

    ngOnInit(){
       this.signUpForm = this.fb.group({
            email :['',Validators.compose([Validators.required])],
            password :['',Validators.compose([Validators.required])]
       });

    this.authService.watch()
    .subscribe(user =>{
        this.user = user;
    });

    }

    onSubmit(form){
       this.authService.signIn(form)
       .subscribe((obs)=>{
           console.log('returned to onSubmit', obs);
           if(obs.hasOwnProperty("error")){
                this.logIn.error = obs.error;
           }else{ this.logIn.error = "";}
           
            
       });
    }

    signOut(){
        this.authService.signOut();
        this.signUpForm = this.fb.group({
            email :['',Validators.compose([Validators.required])],
            password :['',Validators.compose([Validators.required])]
       });
    }
}