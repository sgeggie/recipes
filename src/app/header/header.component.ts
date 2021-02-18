import { Component, OnInit,OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  collapsed = true;
  isAuthenticated = false;
  private userSubscription: Subscription;

  constructor(private dsService: DataStorageService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.userSubscription = this.authService.user.subscribe(user =>
      {
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
}
