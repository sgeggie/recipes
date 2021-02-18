import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit,OnDestroy {
  recipes:  Recipe[];
  recipeSubscription: Subscription;
 
  constructor(private recipeService: RecipeService,
              private router: Router,
              private route: ActivatedRoute) {

   }

  ngOnInit(){
    this.recipes = this.recipeService.getRecipes();
    this.recipeSubscription =  this.recipeService.recipeListChanged.subscribe(
      (recipeList: Recipe[]) => {
        this.recipes = recipeList;
      }
    );
  }
  onNewRecipe(){
     this.router.navigate(['new'], {relativeTo: this.route});
      
  }
  ngOnDestroy(){
    this.recipeSubscription.unsubscribe();
  }
}
