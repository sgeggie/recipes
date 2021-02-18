
import { Subject } from 'rxjs';
import {Ingredient} from '../shared/ingredient.model';

export class ShoppingListService {
  //  recipeIngredientsAdded = new EventEmitter<Ingredient[]>();
    ingredientsChanged = new Subject<Ingredient[]>();
    ingredientSelected = new Subject<number>();
    
 
    private ingredients:Ingredient[] = [
        new Ingredient("apples", 5),
        new Ingredient("tomatoes", 10)];
    
        getIngredients(){
            return this.ingredients.slice();   //return a shallow copy rather reference of the array
        } 
        getSelectedIngredient(index: number){
            return this.ingredients[index];   
        } 
        addIngredient(ingredient: Ingredient){
            this.ingredients.push(ingredient);
            this.ingredientsChanged.next(this.ingredients.slice());
        } 
        addIngredientList(ingredientList: Ingredient[]){
            this.ingredients.push(...ingredientList);
            this.ingredientsChanged.next(this.ingredients.slice());
        }
        updateIngredient(ingredient: Ingredient, index: number){
            this.ingredients[index] = ingredient;
            this.ingredientsChanged.next(this.ingredients.slice());
        }
        deleteIngredient(index: number){
            this.ingredients.splice(index, 1);
            this.ingredientsChanged.next(this.ingredients.slice());

        }      
}