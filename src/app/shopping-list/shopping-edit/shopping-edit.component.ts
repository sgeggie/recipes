import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromShoppingList from '../store/shopping-list.reducer';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit,OnDestroy {
  @ViewChild('f') slForm:NgForm;
  selectSubscription: Subscription;
  forUpdateOnly: boolean = false;
  
  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit(){
      this.selectSubscription = this.store.select('shoppingList').subscribe(stateData => 
        {
          if (stateData.selectedIngredientIndex > -1){
            this.forUpdateOnly = true;
            this.slForm.setValue(
              { name: stateData.selectedIngredient.name,
                amount: stateData.selectedIngredient.amount});
              
          }
          else {
            this.forUpdateOnly = false;
          }
        })
  }

  addIngredient(name: string, amount: number) {
      this.store.dispatch(new ShoppingListActions.AddIngredient(new Ingredient(name, amount)));
  }
  onAddItem(f: NgForm){
    const value = f.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    f.reset();


  }
  updateIngredient(f: NgForm) {
    const value = f.value;
    const upIngredient = new Ingredient(value.name, value.amount);
    
    this.store.dispatch(new ShoppingListActions.UpdateIngredient(upIngredient));
   
    f.reset();
    this.forUpdateOnly = false;

    
  }
  deleteIngredient(f: NgForm){
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    f.reset();
    this.forUpdateOnly = false;

  }
  clearForm(f: NgForm){
    this.store.dispatch( new ShoppingListActions.ClearIngredient());
    f.reset();
    this.forUpdateOnly = false;

  }
  ngOnDestroy(){
    this.selectSubscription.unsubscribe();
    this.store.dispatch( new ShoppingListActions.ClearIngredient());
    
  }
}
