import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable} from "rxjs";
import { AuthService } from "./auth.service";
import { AuthResponseData} from "./auth.service";
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
    constructor(private authService: AuthService,
                private router: Router,
                private store: Store<fromApp.AppState>){}

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
        let authObserver: Observable<AuthResponseData>;
        
        this.isLoading = true;
        if (this.loginMode){
         //   authObserver = this.authService.login(email, password);
            this.store.dispatch(new AuthActions.LoginAPIRequest({email: email, password:password}));
        }
        else{
        //    authObserver = this.authService.register(email, password);
            this.store.dispatch(new AuthActions.RegistrationAPIRequest({email: email, password:password}));
        }
        // authObserver.subscribe(
        //     resData => {
        //         console.log(resData);
        //         this.isLoading = false;
        //         this.error = null; 
        //         this.router.navigate(['/recipes']);
        //     },
        //     errorMsg => {
        //         this.error = errorMsg;
        //         this.isLoading = false;
        //     }
        // );
        authForm.reset();
    }
    ngOnDestroy(){

    }
}