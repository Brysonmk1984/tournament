import { Injectable } from "@angular/core";
import { CommonModule } from '@angular/common';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {
    user = {
        signedIn : false,
        isAdmin : false,
        email : "",
        uid : ""
    };

    constructor( private af : AngularFire){}

    watch(){
        return Observable.create(observer => { 
            this.af.auth.subscribe((user)=>{
            observer.next(user);
            });
        });
    }

    getUser(){
        return this.user;
    }

    signIn(form){
        return Observable.create(observer => { 
            this.af.auth.login(
                {email : form.value.email, password: form.value.password},
                {provider: AuthProviders.Password, method: AuthMethods.Password,
            })
            .then( success =>{
                    console.log('success', success);
                    this.user.signedIn = true;
                    this.user.isAdmin = success.auth.email === "brysonmk1984@gmail.com" ? true : false;
                    this.user.email = success.auth.email;
                    this.user.uid = success.auth.uid;
                    observer.next({success});
            }).catch((error:any) =>{
                // Handle Errors here.
                observer.next({error});
            });
        });
        
    }

    createAccount(form){
        console.log(form.email, form.password);
        return Observable.create(observer =>{
            this.af.auth.createUser({
                email : form.email,
                password : form.password
            }).then( success =>{
                    //console.log('success', success);
                    this.user.signedIn = true;
                    this.user.isAdmin = success.auth.email === "brysonmk1984@gmail.com" ? true : false;
                    this.user.email = success.auth.email;
                    this.user.uid = success.auth.uid;
                    observer.next({success});
            }).catch((error:any) =>{console.log('err',error);
                // Handle Errors here.
                observer.next({error});
            });

        })

    }

    signOut(){
         this.af.auth.logout();
         this.user = {
            signedIn : false,
            isAdmin : false,
            email : "",
            uid : ""
        };
    }

}
