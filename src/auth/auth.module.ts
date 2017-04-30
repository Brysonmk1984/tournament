import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { SignInComponent } from './signIn.component';
import { CreateAccountComponent } from './createAccount.component';

@NgModule({
    imports : [
        ReactiveFormsModule,
        FormsModule,
        CommonModule
    ],
    declarations : [
        SignInComponent,
        CreateAccountComponent
    ],
    providers : [AuthService]
})
export class AuthModule { }