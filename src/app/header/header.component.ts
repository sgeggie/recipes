import { Component, OnInit,OnDestroy} from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipesActions from '../recipes/store/recipes.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  collapsed = true;
  isAuthenticated = false;
  navbarOpen = false;

  private userSubscription: Subscription;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    //this.userSubscription = this.authService.user.subscribe(user =>
    this.userSubscription = this.store.select('auth').subscribe( authState =>
      {
        let user = authState.user;
        this.isAuthenticated = user?true:false;
      });
  }
  
  onSaveData(){
   this.store.dispatch(new RecipesActions.SaveRecipes());
  }
  onFetchData(){
   this.store.dispatch( new RecipesActions.FetchRecipes());
    
  }
  onLogout(){
    this.store.dispatch(new AuthActions.Logout());
    this.isAuthenticated = false;
  }
  ngOnDestroy(){
    this.userSubscription.unsubscribe();
  }
  toggleMyNavbar() {
    this.navbarOpen = !this.navbarOpen;
    console.log('toggle');
    }
}
