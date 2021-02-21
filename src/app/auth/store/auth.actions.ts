import { Action } from "@ngrx/store";

export const LOGIN_API_REQUEST='[Auth] Login API Request';
export const REGISTRATION_API_REQUEST='[Auth] Registration API Request';
export const LOGIN='[Auth] Login';
export const LOGOUT='[Auth] Logout';
export const LOGIN_FAIL='[Auth] Login Fail';

export class Login implements Action {
    readonly type = LOGIN;

    constructor(public payload:{
        email: string,
        id: string,
        token: string,
        tokenExpDate: Date 
    }) {};
}
export class Logout implements Action {
    readonly type = LOGOUT;

}

export class LoginAPIRequest implements Action {
    readonly type = LOGIN_API_REQUEST;

    constructor(public payload:{
        email: string,
        password: string
    }) {};

}
export class LoginFail implements Action {
    readonly type = LOGIN_FAIL;
    constructor(public payload: string){};

}
export class RegistrationAPIRequest implements Action {
    readonly type = REGISTRATION_API_REQUEST;
    constructor(public payload:{
        email: string,
        password: string
    }) {};
}
export type authActions =
    Login |
    Logout |
    LoginAPIRequest |
    LoginFail |
    RegistrationAPIRequest;
