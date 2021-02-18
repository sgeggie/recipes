import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit,OnDestroy {
  id: number;
  editMode = false;
  recipeForm: FormGroup;
  subscribe: Subscription;

  constructor(private route:  ActivatedRoute,
              private router: Router,
              private recipeService:  RecipeService) { }

  ngOnInit(){
    this.subscribe = this.route.params.subscribe(
      (params: Params) => {
          this.id = +params['id'];
          this.editMode = params['id']!= null;
          this.initForm();
        
      }
    )
  }
  onSubmit(){
    let recipe: Recipe;
    recipe = this.parseForm();
        
    if (this.editMode){
      this.recipeService.updateRecipe(recipe,this.id);
    }
    else {
      this.recipeService.addRecipe(recipe);
    }
  }
  onCancel(){
    this.router.navigate(['/recipes/new']);
  }
  private parseForm():Recipe {
    let sName = this.recipeForm.get('name').value;
    let sImgPath = this.recipeForm.get('imgPath').value;;
    let sDescr = this.recipeForm.get('description').value;;
    let sIngreds: Ingredient[]=[];
    let iArray = this.recipeForm.controls['ingredients'].value;
    for (let ingred of iArray){
        sIngreds.push(new Ingredient(ingred.name, ingred.amount))
    }

    return new Recipe(sName,sDescr,sImgPath,sIngreds);
  }
  private initForm(){
    
    let recipeName = '';
    let recipeImgUrl = '';
    let recipeDesc = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      const recipe = this.recipeService.getRecipe(this.id);
      recipeName=recipe.name;
      recipeImgUrl=recipe.imagePath;
      recipeDesc=recipe.description;
      if (recipe['ingredients']){
        for (let ingredient of recipe.ingredients){
          recipeIngredients.push(
            new FormGroup({
              'name': new FormControl(ingredient.name,Validators.required),
              'amount': new FormControl(ingredient.amount,[
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/)])
            })
          );
        }
      }
    }
    this.recipeForm = new FormGroup(
      {
        'name':  new FormControl(recipeName,Validators.required),
        'imgPath':  new FormControl(recipeImgUrl,Validators.required),
        'description': new FormControl(recipeDesc,Validators.required),
        'ingredients': recipeIngredients
      });

  }
  get controls(){
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onAddIngredient(){
    (<FormArray>this.recipeForm.get('ingredients')).push(new FormGroup({
      'name': new FormControl(null,Validators.required),
      'amount': new FormControl(null,[Validators.required,
                                Validators.pattern(/^[1-9]+[0-9]*$/)])
    }));
  }

  onDeleteIngredient(i: number){
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(i);

  }
ngOnDestroy(){
  this.subscribe.unsubscribe();
}
}
