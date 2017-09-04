import { Injectable } from "@angular/core";
import { CommonModule } from '@angular/common';
import { AngularFireAuth } from 'angularfire2/auth';
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

    constructor(private afauth : AngularFireAuth /*private af : AngularFire*/){ }


    

    watch(){
        return Observable.create(observer => { 
            this.afauth.authState.subscribe((user)=>{
                if(user){
                    this.userDetails.signedIn = true;
                    this.userDetails.isAdmin = user.email === "brysonmk1984@gmail.com" ? true : false;
                    this.userDetails.email = user.email;
                    this.userDetails.uid = user.uid;
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
            this.afauth.auth.signInWithEmailAndPassword(
                form.value.email, form.value.password
                /*{provider: AuthProviders.Password, method: AuthMethods.Password,*/
            )
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
            this.afauth.auth.createUserWithEmailAndPassword(
                form.email,
                form.password
            ).then( success =>{
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
         this.afauth.auth.signOut();
         this.userDetails = {
            signedIn : false,
            isAdmin : false,
            email : "",
            uid : ""
        };
    }

}
