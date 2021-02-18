import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit,OnDestroy {
  @ViewChild('f') slForm:NgForm;
  ingredientSelected: Subscription;
  index: number;
  selectedIngredient: Ingredient;
  forUpdateOnly: boolean = false;
  
  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit(){
    this.ingredientSelected = this.shoppingListService.ingredientSelected.subscribe(
      (index: number) => {
        this.index = index;
        this.forUpdateOnly=true;
        this.selectedIngredient = this.shoppingListService.getSelectedIngredient(index);
        this.slForm.setValue(
          { name: this.selectedIngredient.name,
            amount: this.selectedIngredient.amount})
        }
    );
  }

  addIngredient(name: string, amount: number) {

      this.shoppingListService.addIngredient(new Ingredient(name,amount));
  }
  onAddItem(f: NgForm){
    const value = f.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    this.shoppingListService.addIngredient(newIngredient);
    f.reset();


  }
  updateIngredient(f: NgForm) {
    const value = f.value;
    const upIngredient = new Ingredient(value.name, value.amount);
    this.shoppingListService.updateIngredient(upIngredient, this.index);
    f.reset();
    this.forUpdateOnly = false;

    
  }
  deleteIngredient(f: NgForm){
    this.shoppingListService.deleteIngredient(this.index);
    f.reset();
    this.forUpdateOnly = false;

  }
  clearForm(f: NgForm){
    f.reset();
    this.forUpdateOnly = false;

  }
  ngOnDestroy(){
    this.ingredientSelected.unsubscribe();
  }
}
