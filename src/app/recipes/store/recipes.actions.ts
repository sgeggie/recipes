import { Action } from "@ngrx/store";
import { Recipe } from "../recipe.model";

export const FETCH_RECIPES_API_REQUEST='[Recipes] Fetch Recipes';
export const SAVE_RECIPES_API_REQUEST='[Recipes] Save Recipes';
export const GET_RECIPES='[Recipes] Get Recipes';
export const GET_RECIPE='[Recipes] Get Recipe';
export const ADD_RECIPE='[Recipes] Add Recipe';
export const UPDATE_RECIPE='[Recipes] Update Recipe';
export const DELETE_RECIPE='[Recipes] Delete Recipe';
export const REPLACE_RECIPES='[Recipes] Replace Recipes';
export const SELECTED_RECIPE='[Recipes] Selected a Recipe';

 export class FetchRecipes implements Action {
     readonly type = FETCH_RECIPES_API_REQUEST;
 }
export class SaveRecipes implements Action {
    readonly type = SAVE_RECIPES_API_REQUEST;
}
export class GetRecipes implements Action {
    readonly type = GET_RECIPES;
}
export class GetRecipe implements Action {
    readonly type = GET_RECIPE;
    constructor(public payload: number){};
}
export class AddRecipe implements Action {
    readonly type = ADD_RECIPE;
    constructor(public payload: Recipe){};
}
export class UpdateRecipe implements Action {
    readonly type = UPDATE_RECIPE;
    constructor(public payload: Recipe){};
}
export class DeleteRecipe implements Action {
    readonly type = DELETE_RECIPE;
    
}
export class ReplaceRecipes implements Action {
    readonly type = REPLACE_RECIPES;
    constructor(public payload:Recipe[]){};
}
export class SelectedRecipe implements Action {
    readonly type = SELECTED_RECIPE;
    constructor(public payload:number){};
}
export type RecipesActions =
    FetchRecipes | 
    SaveRecipes |
    GetRecipes |
    GetRecipe |
    AddRecipe |
    UpdateRecipe |
    DeleteRecipe |
    SelectedRecipe |
    ReplaceRecipes;