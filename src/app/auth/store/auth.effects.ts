import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../user.model';
import { AuthService } from '../auth.service';

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
const handleAuthentication = (userData)=>{
    const expDate = new Date(new Date().getTime() + +userData.expiresIn * 1000);
    const user = new User(
        userData.email,
        userData.localId,
        userData.idToken,
        expDate
    );
    localStorage.setItem('userData',JSON.stringify(user));
    
    //update state   
    return new AuthActions.Login({
            email: userData.email,
            id: userData.localId,
            token: userData.idToken,
            tokenExpDate: expDate,
            redirect: true
        });   //this means login was successful..
}
const handleErrors = (errorResp)=>{
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
                    tap((respData)=>{
                        
                        this.authService.setLogoutTimer(+respData.expiresIn * 1000);
                    }),
                    map( respData => {
                        const userData = {
                            email: respData.email,
                            localId: respData.localId,
                            idToken: respData.idToken,
                            expiresIn: respData.expiresIn
                        };                        
                        return handleAuthentication(userData);
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
        tap((authActionsLogin:AuthActions.Login)=>
            {
                if (authActionsLogin.payload.redirect){
                    this.router.navigate(['/']);
                }    
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
                tap((respData)=>{
                    this.authService.setLogoutTimer(+respData.expiresIn * 1000)
                }),
                map( respData => {
                    const userData = {
                        email: respData.email,
                        localId: respData.localId,
                        idToken: respData.idToken,
                        expiresIn:respData.expiresIn
                    }; 
                    return handleAuthentication(userData);
                    }),
                catchError( errorResp => {
                    return handleErrors(errorResp);
                    })
                )
            })
        )   
    )
   );      
   autoLogin$ =  createEffect(() => 
    this.actions$.pipe(
        ofType(AuthActions.AUTO_LOGIN),
        map(()=> {
                const localUserData: {
                    email: string;
                    id: string;
                    _token: string;
                    _tokenExpirationDate: string;
                } = JSON.parse(localStorage.getItem('userData'));
               
                if(!localUserData){
                    return {type: "DUMMY"};
                }
                const localExpDate = new Date(localUserData._tokenExpirationDate);
                const expiresIn = localExpDate.getTime() - new Date().getTime();
                this.authService.setLogoutTimer(expiresIn);

                const loadedUser = new User(
                    localUserData.email,
                    localUserData.id,
                    localUserData._token,
                    localExpDate
                );

                if(localUserData._token){
                    return new AuthActions.Login({
                        email:loadedUser.email,
                        id: loadedUser.id,
                        token: loadedUser.token,
                        tokenExpDate: localExpDate,
                        redirect: false
                    });
                }
                else {
                    return {type: "DUMMY"};
                }
            })
      )  
   );

   authLogout$ =  createEffect(() => 
   this.actions$.pipe(
       ofType(AuthActions.LOGOUT),
       tap(()=>
           {
            localStorage.removeItem('userData');
            this.authService.clearLogoutTimer();
            this.router.navigate(['/login']);
           }
       )
   )    
  ,{dispatch: false});

    constructor(private actions$: Actions,
                private http: HttpClient,
                private router: Router,
                private authService: AuthService){};

}