import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ShoppingListService } from 'src/app/shopping-list/shopping-list.service';
import { Recipe } from '../recipe.model'
import { RecipeService } from '../recipe.service'

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe:  Recipe;
  id:  number;
  
  constructor(private router: Router,
              private route: ActivatedRoute,
              private recipeService: RecipeService, 
              private slService:  ShoppingListService) { }

  ngOnInit(){
    this.route.params.subscribe(
      (params:Params) => {
          this.id = +params['id'];
          this.recipe = this.recipeService.getRecipe(this.id);
      }
    );
  }
  toShoppingList(){
  //  this.slService.recipeIngredientsAdded.emit(this.recipe.ingredients);
    this.slService.addIngredientList(this.recipe.ingredients.slice());
    this.router.navigate(['/shopping-list'],{relativeTo: this.route.parent})
  }
  onEditRecipe(){
    this.router.navigate(['edit'],{relativeTo: this.route})
  }
  onDeleteRecipe(){
    this.recipeService.deleteRecipe(this.id);
    this.router.navigate(['/recipes']);
    
  }

 }
