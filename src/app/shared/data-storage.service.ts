import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map,tap,take} from "rxjs/operators";
import { AuthService } from "../auth/auth.service";
import { User } from "../auth/user.model";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";
import { ShoppingListService } from "../shopping-list/shopping-list.service";


@Injectable({providedIn: 'root'})
export class DataStorageService {
    constructor(private http: HttpClient,
                private recipeService: RecipeService,
                private slService: ShoppingListService,
                private authService: AuthService){}

    storeRecipes() {
        let token = null;
        this.authService.user.pipe(take(1)).subscribe( user=>
            {
                    token = user.token;
            });
        const recipes = this.recipeService.getRecipes();
        this.http.put('https://recipes-4e188-default-rtdb.firebaseio.com/recipes.json',
                       recipes,
                        {
                            params: new HttpParams().set('auth',token)
                        }

                    ).subscribe( response =>
                        {
                            console.log(response);
                        }

                       );

    }
    fetchRecipes() {
        //user is a BehaviorSubject, so unsubscribe after we get the first user (pipe(take(1)))
        let token = null;
        this.authService.user.pipe(take(1)).subscribe( user=>
            {
                    token = user.token;
            });
        return this.http
            .get<Recipe[]>('https://recipes-4e188-default-rtdb.firebaseio.com/recipes.json',
                {
                    params: new HttpParams().set('auth',token)
                }
            )
            .pipe(
                map(responseRecipes =>
                {
                    return responseRecipes.map(recipe =>{ 
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