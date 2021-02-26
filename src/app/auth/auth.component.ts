import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Store } from "@ngrx/store";
import * as fromApp from "../store/app.reducer";
import * as AuthActions from "./store/auth.actions";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy{
    loginMode = true;
    isLoading = false;
    error:  string = null;
    constructor(private store: Store<fromApp.AppState>){}

    ngOnInit(){
        this.store.select('auth').subscribe(authState => {
            this.isLoading = authState.isLoading;
            this.error = authState.authError;           
        })
    }

    toggleMode(){
        this.loginMode = !this.loginMode;
    }
    onSubmit(authForm: NgForm){
        const email = authForm.value.email;
        const password  = authForm.value.password;
        
        this.isLoading = true;
        if (this.loginMode){
            this.store.dispatch(new AuthActions.LoginAPIRequest({email: email, password:password}));
        }
        else{
            this.store.dispatch(new AuthActions.RegistrationAPIRequest({email: email, password:password}));
        }

        authForm.reset();
    }
    ngOnDestroy(){

    }
}