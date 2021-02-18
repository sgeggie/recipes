import { Component, OnDestroy, OnInit } from '@angular/core';
//import { Subscription } from 'rxjs';
//import { ShoppingListService } from '../shopping-list/shopping-list.service';
//import { Recipe } from './recipe.model';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
  
})
export class RecipesComponent implements OnInit,OnDestroy {
  
  ngOnInit(){
    // this.recipeSubscription = this.recipeService.recipeSelected.subscribe((recipe: Recipe) => {
    //   this.selectedRecipe = recipe;
    // }); 

  }
  ngOnDestroy(){
   // this.recipeSubscription.unsubscribe();
  }

}
