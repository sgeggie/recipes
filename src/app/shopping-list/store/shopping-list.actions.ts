import { Action } from "@ngrx/store";
import { Ingredient } from "src/app/shared/ingredient.model";

export const ADD_INGREDIENT = '[Shopping List] Add Ingredient';
export const ADD_INGREDIENTS = '[Shopping List] Add Ingredients';
export const UPDATE_INGREDIENT = '[Shopping List] Update Ingredient';
export const DELETE_INGREDIENT = '[Shopping List] Delete Ingredient';
export const SELECTED_INGREDIENT = '[Shopping List] Selected Ingredient';
export const CLEAR_INGREDIENT = '[Shopping List] Clear Ingredient';

export class AddIngredient implements Action {
    readonly type = ADD_INGREDIENT;
    constructor(public payload: Ingredient){};
    
}
export class AddIngredients implements Action {
    readonly type = ADD_INGREDIENTS;
    constructor(public payload: Ingredient[]){};
}
export class UpdateIngredient implements Action {
    readonly type = UPDATE_INGREDIENT;
    constructor(public payload: Ingredient){};
}
export class DeleteIngredient implements Action {
    readonly type = DELETE_INGREDIENT;
    constructor(){};
}
export class SelectedIngredient implements Action {
    readonly type = SELECTED_INGREDIENT;
    constructor(public payload: number) {};
}
export class ClearIngredient implements Action {
    readonly type = CLEAR_INGREDIENT;
    constructor() {};
}
export type ShoppingListActions =   AddIngredient | 
                                    AddIngredients | 
                                    UpdateIngredient | 
                                    DeleteIngredient |
                                    SelectedIngredient |
                                    ClearIngredient;
