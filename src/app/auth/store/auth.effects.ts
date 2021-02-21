import { registerLocaleData } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

//Actions provides access to all dispatched actions.
//An effect class will allow you to respond to any action that does not change the state
//(unlike a reducer, which does change state)

import * as AuthActions from './auth.actions';

//From firebase auth API reference
export interface AuthResponseData {
    kind: string,
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    registered?: boolean

}

//Helper Functions
const handleAuthentication = (respData)=>{
    const expDate = new Date(new Date().getTime() + +respData.expiresIn * 1000);
    return new AuthActions.Login({
        email: respData.email,
        id: respData.localId,
        token: respData.idToken,
        tokenExpDate: expDate
        });

}
const handleErrors = (errorResp)=>{
    console.log(errorResp);
    let errorMsg = 'unknown error occurred!';
    if(!errorResp.error || !errorResp.error.error) {
        return of(new AuthActions.LoginFail(errorMsg));
    }
    switch (errorResp.error.error.message) {
        case 'INVALID_PASSWORD':errorMsg='The password is not correct!';
        break;
        case 'EMAIL_NOT_FOUND': errorMsg='The email is not found.   Please register.';
        break;
        case 'USER_DISABLED': errorMsg='The user has been diabled.';
        break;
        case 'EMAIL_EXISTS' : errorMsg='this user has already been registered';
        break;
    }
    return of(new AuthActions.LoginFail(errorMsg));
}

@Injectable()
export class AuthEffects {

    //    authLogin$ =  this.actions$.pipe(
      
    authLogin$ =  createEffect(() => this.actions$.pipe(
                    ofType(AuthActions.LOGIN_API_REQUEST),
                    switchMap( 
                        (authData: AuthActions.LoginAPIRequest) => {
                            return this.http.post<AuthResponseData>(
                            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.fireBaseAPIKey,
                            {
                                email: authData.payload.email,
                                password: authData.payload.password,
                                returnSecureToken: true
                            }
                            ).pipe( 
                                map( respData => {
                                    return handleAuthentication(respData);
                                    }),
                                catchError( errorResp => {
                                    return handleErrors(errorResp);
                                    })
                                )          
                            }
                        )
                    )
                );        
       //only this action will trigger the effect.

    authSuccess$ =  createEffect(() => 
    this.actions$.pipe(
        ofType(AuthActions.LOGIN),
        tap(()=>
            {
                this.router.navigate(['/']);
            }
        )
    )    
   ,{dispatch: false});
   
   regRequest$ = createEffect(() => 
   this.actions$.pipe(
       ofType(AuthActions.REGISTRATION_API_REQUEST),
       switchMap(((regData: AuthActions.RegistrationAPIRequest) => {
           //Firebase signup RESTful API using my Firebase API key
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='+environment.fireBaseAPIKey,
                {
                    email: regData.payload.email,
                    password: regData.payload.password,
                    returnSecureToken:true
                }
            ).pipe(
                map( respData => {
                    return handleAuthentication(respData);
                    }),
                catchError( errorResp => {
                    return handleErrors(errorResp);
                    })
                )
            })
        )   
    )
   );      
  
    constructor(private actions$: Actions,
                private http: HttpClient,
                private router: Router){};

}