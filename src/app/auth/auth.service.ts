import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Injectable({providedIn: 'root'})
export class AuthService {
    //BehaviorSubject provides access before, during, after changes have occurred.  not just when.
   // user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;
    constructor(private store: Store<fromApp.AppState>){}
    
   
    setLogoutTimer(expirationDuration: number){
        this.tokenExpirationTimer = setTimeout(()=>
            {
                this.store.dispatch(new AuthActions.Logout);  
            },
            expirationDuration);
    }
    clearLogoutTimer(){
        console.log('clearing logout timer');
        if(this.tokenExpirationTimer){
            clearTimeout(this.tokenExpirationTimer);
            this.tokenExpirationTimer = null;
        }

    }

}