import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription} from 'rxjs';
import { map } from 'rxjs/operators';
import { Recipe } from '../recipe.model';
import * as RecipesActions from '../store/recipes.actions';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit,OnDestroy {
  recipes:  Recipe[];
  recipeSubscription: Subscription;
 
  constructor(private router: Router,
              private route: ActivatedRoute,
              private store: Store<fromApp.AppState>) {}

  ngOnInit(){
    this.route.params.subscribe(
      (params:Params) => {
          this.store.dispatch(new RecipesActions.SelectedRecipe(+params['id']));
      });   

    let count = 0;
    this.recipeSubscription =  
        this.store.select('recipes')
            .pipe(map((recipeState) => recipeState.recipes))
            .subscribe((recipes: Recipe[]) => 
              {
                this.recipes = recipes;
                console.log('recipe state changed: '+count++);
              });
  }
  onNewRecipe(){
     this.router.navigate(['new'], {relativeTo: this.route});
      
  }
  onSelectedRecipe(index:number){
    this.store.dispatch(new RecipesActions.SelectedRecipe(index));
     
 }
  ngOnDestroy(){
    this.recipeSubscription.unsubscribe();
  }
}
