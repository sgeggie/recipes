import { Injectable} from '@angular/core';
import { Subject} from 'rxjs';
import { Store } from '@ngrx/store';

import { Recipe } from './recipe.model';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';
import * as fromApp from '../store/app.reducer';

@Injectable()
export class RecipeService {
    recipeListChanged = new Subject<Recipe[]>();
    
    private recipes: Recipe[] = [];
    // [
    //     new Recipe(
    //         'Super Burger', 
    //         'Best Burger Ever',
    //         'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MXx8aGFtYnVyZ2VyfGVufDB8fDB8&ixlib=rb-1.2.1&w=1000&q=80',
    //         [
    //             new Ingredient('ground beef',1),
    //             new Ingredient('Kaiser rolls',4)
    //         ]
    //     ),
    //     new Recipe(
    //         'test recipe #2', 
    //         'test description #2',
    //         'https://images.unsplash.com/photo-1593967858208-67ddb5b4c406?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    //         [
    //             new Ingredient('Eggs',4),
    //             new Ingredient('Cheese',2)
    //         ])
    // ];
    constructor(private store: Store<fromApp.AppState>){}
    
    ngOnInit(){
        
    }
    getRecipes(){
        return this.recipes.slice();   //return a copy of the array rather than a reference
    }

    getRecipe(id: number){
        return this.recipes[id];   //return a element of the array
    }

    addRecipe(recipe: Recipe){
        this.recipes.push(recipe);
        this.recipeListChanged.next(this.recipes.slice());
    }
    updateRecipe(recipe:  Recipe, id:  number){
        this.recipes[id]=recipe;
        this.recipeListChanged.next(this.recipes.slice());
    }
    deleteRecipe(id: number){
        this.recipes.splice(id,1);
        this.recipeListChanged.next(this.recipes.slice());

    }
    replaceRecipeList(recipeList: Recipe[]){
        this.recipes = recipeList;
        this.recipeListChanged.next(this.recipes.slice());
    }

        
}
