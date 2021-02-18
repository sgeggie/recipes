import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { removeSummaryDuplicates } from "@angular/compiler";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { User } from "./user.model";
import { environment } from "../../environments/environment";

export interface AuthResponseData {
    kind: string,
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    registered?: boolean

}
@Injectable({providedIn: 'root'})
export class AuthService {
    //BehaviorSubject provides access before, during, after changes have occurred.  not just when.
    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;
    constructor(private http: HttpClient,
                private router: Router){}
    
    register(email: string, password: string){
        //Firebase signup RESTful API using my Firebase API key
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key'+environment.fireBaseAPIKey,
            {email: email,
            password: password,
            returnSecureToken:true
            }
        ).pipe(catchError(this.handleError), tap( respData => 
            {
               this.handleAuthentication(respData.email, respData.localId, respData.idToken, +respData.expiresIn);
            
            }));

    }
    login(email: string, password: string){
        return this.http.post<AuthResponseData>(
              'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='+environment.fireBaseAPIKey,
              {email: email,
                password: password,
                returnSecureToken:true
             }  
            ).pipe(catchError(this.handleError), tap( respData => 
                {
                   this.handleAuthentication(respData.email, respData.localId, respData.idToken, +respData.expiresIn);
                
                }));
    }
    logout(){
        this.user.next(null);
        localStorage.removeItem('userData');
        if(this.tokenExpirationTimer){
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
        this.router.navigate(['/auth']);

    }

    autoLogin(){
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));

        if(userData){
            const loadedUser = new User(userData.email,
                                        userData.id,
                                        userData._token,
                                        new Date(userData._tokenExpirationDate));
            if(loadedUser.token){
                let expirationDuration = loadedUser.tokenExpirationDate.getTime() - new Date().getTime();
                this.user.next(loadedUser); 
                this.autoLogout(expirationDuration);
            }
            else{
                this.user.next(null);
            }    
        }
        else {
            this.user.next(null);
        }
        
    }
    autoLogout(expirationDuration: number){
        this.tokenExpirationTimer = setTimeout(()=>
            {
                this.logout();        
            },
            expirationDuration);
    }

    private handleAuthentication(email: string, id: string, token: string, expiresIn: number){
        const expDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(
            email,
            id,
            token,
            expDate);
        
        this.user.next(user);
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData',JSON.stringify(user));
    }
    private handleError(errorResp:  HttpErrorResponse){
        let errorMsg = 'unknown error occurred!';
        if(!errorResp.error || !errorResp.error.error) {
            throwError(errorMsg);
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
        return throwError(errorMsg);
    }
}