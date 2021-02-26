import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { Recipe } from '../recipe.model';
import * as RecipeActions from 'src/app/recipes/store/recipes.actions';
import * as fromApp from '../../store/app.reducer';

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
              private store: Store<fromApp.AppState>) { }

  ngOnInit(){

    //route is an observable that we subscribe to....when it changes, it fires here.
    //appState has nested observables, so we need to select the recipes....
    //using the pipe, return an observable (via map) for recipe state that we subscribe to.
    //when recipe state index changes, it fires....returning the recipe to the component.
    //bam!
    this.route.params.subscribe(
      (params:Params) => {
          this.id = +params['id'];
          this.store.select('recipes')
            .pipe(
              map(recipesState =>{
                    console.log(this.id);
                    return recipesState.recipes
                            .find(
                              (recipe, index)=> {return this.id === index})
          })).subscribe(recipe => {this.recipe = recipe});

        //  this.recipe = this.recipeService.getRecipe(this.id);
      }
    );
  }
  toShoppingList(){
 //   this.slStore.dispatch(new ShoppingListActions.AddIngredients(this.recipe.ingredients.slice()));
    this.router.navigate(['/shopping-list'],{relativeTo: this.route.parent})
  }
  onEditRecipe(){
    this.router.navigate(['edit'],{relativeTo: this.route})
  }
  onDeleteRecipe(){
 //   this.recipeService.deleteRecipe(this.id);
    this.store.dispatch(new RecipeActions.DeleteRecipe());
    this.router.navigate(['/recipes']);
  } 

 }
