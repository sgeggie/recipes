import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { map,tap,take} from "rxjs/operators";
import { AuthService } from "../auth/auth.service";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";
import * as fromApp from "../store/app.reducer";


@Injectable({providedIn: 'root'})
export class DataStorageService {
    constructor(private http: HttpClient,
                private recipeService: RecipeService,
                private authService: AuthService,
                private store: Store<fromApp.AppState>){}

    storeRecipes() {

        //the auth token will be added to the http request via authinterceptor
                  
        const recipes = this.recipeService.getRecipes();
        this.http.put('https://recipes-4e188-default-rtdb.firebaseio.com/recipes.json',
                       recipes
                    ).subscribe( response =>
                        {
                            console.log(response);
                        });
    }
    fetchRecipes() {
        //the auth token will be added to the http request via authinterceptor

        return this.http
            .get<Recipe[]>('https://recipes-4e188-default-rtdb.firebaseio.com/recipes.json')
            .pipe(
                map(responseRecipes =>   //this is the ngrx map fuctions for use with pipes
                {
                    return responseRecipes.map(recipe =>{   //this is the map function used with arrays.
                          return  {
                              ...recipe, 
                              ingredients: recipe.ingredients?recipe.ingredients:[]
                            };
                    });
                }),
                tap(responseRecipes => 
                {
                    this.recipeService.replaceRecipeList(responseRecipes);
                })
            );
    }       
}