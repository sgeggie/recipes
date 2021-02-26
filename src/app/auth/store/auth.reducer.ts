import { User } from "../user.model";
import * as AuthActions from "./auth.actions";

export interface authState {
    user: User;
    authError: string;
    isLoading: boolean;
}
const initialState:authState = {
    user: null,
    authError: null,
    isLoading: false,
}
export function authReducer (state=initialState, action: AuthActions.authActions ){
    
    switch (action.type){
        case AuthActions.LOGIN:
            const user = new User(action.payload.email,
                                   action.payload.id,
                                   action.payload.token,
                                   action.payload.tokenExpDate);
            return {...state, 
                    user: user,
                    authError:null,
                    isLoading:false
                };
        case AuthActions.LOGOUT:
            return {...state,
                    user: null,
                    authError:null,
                    isLoading: false
                };
        case AuthActions.LOGIN_API_REQUEST:
                    return {...state,
                        authError:null,
                        isLoading:true
                    };
        case AuthActions.LOGIN_FAIL:
            return {...state,
                    user: null,
                    authError: action.payload,
                    isLoading:false
            } 

        default:
            return state;    
    }

    

}