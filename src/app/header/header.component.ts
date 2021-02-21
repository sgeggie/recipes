import { Component, OnInit,OnDestroy} from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';
import * as fromApp from '../store/app.reducer';


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

  constructor(private dsService: DataStorageService,
              private authService: AuthService,
              private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    //this.userSubscription = this.authService.user.subscribe(user =>
    this.userSubscription = this.store.select('auth').subscribe( authState =>
      {
        let user = authState.user;
        this.isAuthenticated = user?true:false;
      });
  }
  
  onSaveData(){
    this.dsService.storeRecipes();
  }
  onFetchData(){
    this.dsService.fetchRecipes().subscribe();
    
  }
  onLogout(){
    this.authService.logout();
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
