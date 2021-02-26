import { Injectable } from "@angular/core";
import { Resolve,ActivatedRouteSnapshot,RouterStateSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";
import { Recipe } from "./recipe.model";
import * as fromApp from "../store/app.reducer";
import * as RecipeActions from "./store/recipes.actions";
import { map, tap } from "rxjs/operators";
import { of } from "rxjs";

@Injectable({providedIn: 'root'})
export class RecipeResolverService implements Resolve<Recipe[]> {
    constructor(private store: Store<fromApp.AppState>){}
    
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        let resolvedRecipes: Recipe[]=[];
        this.store.select('recipes').pipe(
            map(recipeState => {
                return recipeState.recipes;
            })).subscribe(recipes => {
                resolvedRecipes = recipes;
            });
        
            if (resolvedRecipes.length > 0){
                console.log('return recipes in memory');
                return resolvedRecipes;
            }    
            else {
                console.log('return recipes from API');             
                  this.store.dispatch(new RecipeActions.FetchRecipes());
            }
    }    
  }