import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { switchMap, map, tap, catchError, withLatestFrom } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Recipe } from '../recipe.model';

import * as RecipesActions from './recipes.actions';
import * as fromApp from '../../store/app.reducer';

@Injectable()
export class RecipesEffects{
    constructor(private http: HttpClient,
                private actions$: Actions<RecipesActions.FetchRecipes|RecipesActions.SaveRecipes>,
                private store: Store<fromApp.AppState>){};

    fetchRecipes$ = createEffect(() => 
    this.actions$.pipe(
        ofType(RecipesActions.FETCH_RECIPES_API_REQUEST),
        switchMap(() => {
          console.log("fetch data from effect");  
          return this.http.get<Recipe[]>(
            'https://recipes-4e188-default-rtdb.firebaseio.com/recipes.json'
          );
        }),
        map(recipes => {
          return recipes.map(recipe => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : []
            };
          });
        }),
        map(recipes => {
          return new RecipesActions.ReplaceRecipes(recipes);
        })
      )
    );
    saveRecipes$ = createEffect(() => 
    this.actions$.pipe(
        ofType(RecipesActions.SAVE_RECIPES_API_REQUEST), //returns action
        withLatestFrom(this.store.select('recipes')),    //returns state 
        switchMap(([action, state]) => {  //NGRX provides an array output from previous steps in the stream (ofType, state)
            let recipes = state.recipes;
            return this.http.put(
                'https://recipes-4e188-default-rtdb.firebaseio.com/recipes.json',
                recipes);
        })
       )
    ,{dispatch:false});       //we are not dispatching any actions, which is normally expected by default
}
