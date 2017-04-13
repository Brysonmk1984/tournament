import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';

import { AuthService } from './auth.service';
@Component({
    moduleId: module.id,
    selector: 'sign-in',
    styles : [`
        input[type='text'],
        input[type='email']{
            width:200px;
        }
        button{
            margin-top:30px;
            display:block;
        }
        .input_div{
            width:275px;
        }
        label span{
            display:inline-block;
            width:70px;
            
        }
        #signedIn{
            text-align:center;
        }
        .inner_form_wrapper{
           width:275px;
           margin:0px auto;
        }
    `],
    providers : [AuthService],
    template:`
        <div class="page_wrapper">
            <div class="page_title_container">
                <h2>Admin Log In</h2>
                <span class="subheader">Email and password are required.</span>
                <br />
                <hr />
                <br />
            </div>
            <form [formGroup]="signUpForm" (ngSubmit)="onSubmit(signUpForm)">
                <div id="signedIn" class="inner_form_wrapper" *ngIf="admin.signedIn">
                    <h4>Currently Logged In : </h4>
                    <h4 class="text-muted">{{admin.email}}</h4>
                    <button type="button" class="btn btn-primary btn-block" (click)="signOut()">Log out</button>
                </div>
                <div class="inner_form_wrapper"  *ngIf="!admin.signedIn">
                    <div class="input_div">
                        <label>
                            <span>Email:</span>
                            <input formControlName="email" type="email" />
                        </label>
                    </div>
                    <div class="input_div">
                        <label>
                            <span>Password:</span>
                            <input formControlName="password" type="text" />
                        </label>
                    </div>
                    <div id="errorContainer" *ngIf="logIn.error"  class="bg-danger">
                        <strong>{{logIn.error}}</strong>
                    </div>
                    <button type="submit" class="btn btn-primary btn-block" [disabled]="!signUpForm.valid">Submit</button>
                </div>
                
            </form>
        </div>
    `
})

export class SignInComponent implements OnInit {
    signUpForm : FormGroup;
    admin : {signedIn, email} = {
        signedIn : false,
        email : ""
    };
    logIn = {
        error : ""
    };
    constructor( private fb: FormBuilder, private af : AngularFire, private authService : AuthService) { }

    ngOnInit(){
       this.signUpForm = this.fb.group({
            email :['',Validators.compose([Validators.required])],
            password :['',Validators.compose([Validators.required])]
       });

       this.authService.watch()
        .subscribe(user =>{
            console.log('USER',user);
           if(user){
             this.admin.email = user.auth.email;
             this.admin.signedIn = true;
           }else{
               this.admin.email = "";
               this.admin.signedIn = false;
           }
        });

    }

    onSubmit(form){
       this.authService.submit(form)
       .subscribe((obs)=>{
           console.log('OBS!', obs);
           if(obs.hasOwnProperty("error")){
                this.logIn.error = obs.error;
           }else{ this.logIn.error = ""; }
           
            
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