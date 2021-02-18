import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscriber, Subscription } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[];
  ingredientsSubscription: Subscription;
  
  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit(){
    this.ingredients = this.shoppingListService.getIngredients();
    
    this.ingredientsSubscription = this.shoppingListService.ingredientsChanged.subscribe(
      (ingreds: Ingredient[]) => {
        this.ingredients = ingreds;
      }
    );
    // this.shoppingListService.recipeIngredientsAdded.subscribe(
    //   (ingreds: Ingredient[]) => {
    //     console.log(ingreds);
    //     this.shoppingListService.addIngredientList(ingreds);
    //   }
    // );
  }
  
  addToIngredientList(newIngredient:Ingredient){
    this.shoppingListService.addIngredient(newIngredient);

  }
  onPrint(){
    window.print();

  }
  ngOnDestroy(){
    this.ingredientsSubscription.unsubscribe();
  }
  onSelect(i: number){
    this.shoppingListService.ingredientSelected.next(i);
    
  }
}
