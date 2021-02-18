import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthComponent } from './auth/auth.component';


const appRoutes: Routes = [
    {path:  '', redirectTo: '/recipes', pathMatch: 'full'},
    {path:  'recipes', loadChildren: './recipes/recipes.module#RecipesModule'},
    {path:  'shopping-list', loadChildren: './shopping-list/shopping-list.module#ShoppingListModule'},
    {path:  'auth', component: AuthComponent },

];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})],
    exports: [RouterModule]
})
export class AppRoutingModule {

}