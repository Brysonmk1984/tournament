import { Injectable } from "@angular/core";
import { CommonModule } from '@angular/common';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AuthService {
    public userDetails : {signedIn, isAdmin, email, uid} = {
        signedIn : false,
        isAdmin : false,
        email : "",
        uid : ""
    };

    constructor( private af : AngularFire){ }


    

    watch(){
        return Observable.create(observer => { 
            this.af.auth.subscribe((user)=>{
                if(user && user.auth){
                    this.userDetails.signedIn = true;
                    this.userDetails.isAdmin = user.auth.email === "brysonmk1984@gmail.com" ? true : false;
                    this.userDetails.email = user.auth.email;
                    this.userDetails.uid = user.auth.uid;
                }else{
                    this.userDetails.signedIn = false;
                    this.userDetails.isAdmin = false;
                    this.userDetails.email = "";
                    this.userDetails.uid = "";
                }
                
            observer.next(this.userDetails);
            });
        });
    }


    signIn(form){
        return Observable.create(observer => { 
            this.af.auth.login(
                {email : form.value.email, password: form.value.password},
                {provider: AuthProviders.Password, method: AuthMethods.Password,
            })
            .then( success =>{
                    console.log('success', success);
                    observer.next(success);
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
                    this.userDetails.signedIn = true;
                    this.userDetails.isAdmin = success.auth.email === "brysonmk1984@gmail.com" ? true : false;
                    this.userDetails.email = success.auth.email;
                    this.userDetails.uid = success.auth.uid;
                    observer.next({success});
            }).catch((error:any) =>{console.log('err',error);
                // Handle Errors here.
                observer.next({error});
            });

        })

    }

    signOut(){
         this.af.auth.logout();
         this.userDetails = {
            signedIn : false,
            isAdmin : false,
            email : "",
            uid : ""
        };
    }

}
