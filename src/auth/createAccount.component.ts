import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { AngularFire, FirebaseListObservable, AuthProviders, AuthMethods } from 'angularfire2';

import { AuthService } from './auth.service';


@Component({
    moduleId: module.id,
    selector: 'create-account',
    template : `
        <div class="page_wrapper">
            <div class="page_title_container">
              
                <div id="loggedInStatus" *ngIf="user.signedIn then loggedIn else loggedOut"></div>
                <ng-template #loggedIn>
                    <h2>You Are Already Signed In</h2>
                    <span class="subheader">Click 'Log out' to sign out.</span>
                </ng-template>
                <ng-template #loggedOut>
                    <h2>Create Account</h2>
                    <span class="subheader">Email and password are required.</span>
                </ng-template>
                
                <br />
                <hr />
                <br />
            </div>
            <form [formGroup]="createAccountForm" (ngSubmit)="onSubmit(createAccountForm)">
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
                    <div class="input_div">
                        <label>
                            <strong>Confirm Password:</strong>
                            <input formControlName="confirmPassword" type="password" />
                        </label>
                    </div>
                    <div id="errorContainer" *ngIf="logIn.error"  class="bg-danger">
                        <strong>{{logIn.error}}</strong>
                    </div>
                    <button type="submit" class="btn btn-primary btn-block" [disabled]="!createAccountForm.valid">Submit</button>
                    <div id="noAccount">
                        <strong>Already have an account?<br />Sign in <a href="./#/sign-in">here.</a></strong>
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
        label span.radio_span{
            width:30px;
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
        #playerList{
            list-style:none;
        }
        #playerList li{
            margin:10px 0px;
            cursor:pointer;
        }
        #playerList li img{
            opacity:.6;
        }
        #playerList li.selected img{
            opacity:1;
        }
    `]
})

export class CreateAccountComponent implements OnInit{
    createAccountForm : FormGroup;
    user : {signedIn, isAdmin, email, uid} = {
        signedIn : false,
        isAdmin : false,
        email : "",
        uid : ""
    };
    logIn = {
        error : ""
    };


    constructor( private fb: FormBuilder, private af : AngularFire, private authService : AuthService) { 

    }

    ngOnInit(){
       this.createAccountForm = this.fb.group({
            email :['',Validators.compose([Validators.required])],
            password :['',Validators.compose([Validators.required])],
            confirmPassword :['',Validators.compose([Validators.required])]
       });
       

       this.authService.watch()
        .subscribe(user =>{
            console.log('USER',user);
            this.user = user;
        });

       
      
    }

    onSubmit(form){
        console.log('form',form);
        
        // If password has been confirmed
        if(form.value.password === form.value.confirmPassword){
            this.authService.createAccount({email : form.value.email, password : form.value.password})
            .subscribe(activity =>{
                console.log('acc',activity);
                if(activity.error){
                    this.logIn.error = activity.error.message;
                }else{
                    this.logIn.error = "";
                }
            });
        }else{
            alert('Password mismatch');
        }
        
    }

    signOut(){
        this.authService.signOut();
        this.createAccountForm = this.fb.group({
            email :['',Validators.compose([Validators.required])],
            password :['',Validators.compose([Validators.required])],
            confirmPassword :['',Validators.compose([Validators.required])]
       });
    }
}