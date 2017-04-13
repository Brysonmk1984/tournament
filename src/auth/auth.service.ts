import { Injectable } from "@angular/core";
import { CommonModule } from '@angular/common';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {
  constructor( private af : AngularFire){}

  watch(){
    return Observable.create(observer => { 
        this.af.auth.subscribe((user)=>{
          observer.next(user);
        });
    });
  }

   submit(form){
        return Observable.create(observer => { 
            this.af.auth.login(
                {email : form.value.email, password: form.value.password},
                {provider: AuthProviders.Password, method: AuthMethods.Password,
            })
            .then( success =>{
                    console.log('success', success);
                    observer.next({success});
            }).catch((error:any) =>{
                // Handle Errors here.
                observer.next({error});
            });
        });
        
    }

    signOut(){
         this.af.auth.logout();
    }

}
