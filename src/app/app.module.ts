import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { RecipesModule } from './recipes/recipes.module';
import { ShoppingListModule } from './shopping-list/shopping-list.module';
import { SharedModule } from './shared/shared.module';
import { AuthComponent } from './auth/auth.component';
import * as fromApp from './store/app.reducer';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { AuthEffects } from './auth/store/auth.effects';
import { environment } from '../environments/environment';
import { RecipesEffects } from './recipes/store/recipes.effects';


@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([AuthEffects, RecipesEffects]),
    StoreDevtoolsModule.instrument({logOnly: environment.production}),
    StoreRouterConnectingModule.forRoot(),
    AppRoutingModule,
    SharedModule,
    RecipesModule,
    ShoppingListModule
    ],
  providers: [
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: AuthInterceptorService,
                    multi: true
                }],
  bootstrap: [AppComponent]
})
export class AppModule { 
  
}
