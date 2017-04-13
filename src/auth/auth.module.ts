import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';


//import { authRouting } from './auth.routing';
import { SignInComponent } from './signIn.component';

@NgModule({
    imports : [
        ReactiveFormsModule,
        FormsModule,
        CommonModule
    ],
    declarations : [
        SignInComponent
    ]
})
export class AuthModule { }