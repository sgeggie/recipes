import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable} from "rxjs";
import { AuthService } from "./auth.service";
import { AuthResponseData} from "./auth.service";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent {
    loginMode = true;
    isLoading = false;
    error:  string = null;
    constructor(private authService: AuthService,
                private router: Router){}

    toggleMode(){
        this.loginMode = !this.loginMode;
    }
    onSubmit(authForm: NgForm){
        const email = authForm.value.email;
        const password  = authForm.value.password;
        let authObserver: Observable<AuthResponseData>;
        
        this.isLoading = true;
        if (this.loginMode){
            authObserver = this.authService.login(email, password);
        }
        else{
            authObserver = this.authService.register(email, password);
        }
        authObserver.subscribe(
            resData => {
                console.log(resData);
                this.isLoading = false;
                this.error = null; 
                this.router.navigate(['/recipes']);
            },
            errorMsg => {
                this.error = errorMsg;
                this.isLoading = false;
            }
        );
        authForm.reset();
    }

}