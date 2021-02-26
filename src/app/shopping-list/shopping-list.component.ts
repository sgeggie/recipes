import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import * as ShoppingListActions from './store/shopping-list.actions';
import * as fromShoppingList from './store/shopping-list.reducer';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ingredients:Ingredient[]}>;
  ingredientsSubscription: Subscription;
  
  constructor(private store: Store<fromApp.AppState> ) {}

  ngOnInit(){

    //ingredients updated whenver there is change in state.
    this.ingredients = this.store.select('shoppingList');

  }
  
  addToIngredientList(newIngredient:Ingredient){
    this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));

  }
  onPrint(){
    window.print();

  }
  ngOnDestroy(){
  }
  onSelect(i: number){
      this.store.dispatch(new ShoppingListActions.SelectedIngredient(i));
    
  }
}
