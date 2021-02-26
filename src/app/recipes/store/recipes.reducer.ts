import { Recipe } from "../recipe.model";
import * as RecipesActions from "./recipes.actions";

export interface recipeState {
    recipes: Recipe[],
    selectedRecipeIndex: number

}
const initialState:recipeState = {
    recipes:[],
    selectedRecipeIndex: -1
}
export function recipesReducer(state=initialState, 
                               action:RecipesActions.RecipesActions){
    switch(action.type) {
        case RecipesActions.REPLACE_RECIPES:
            console.log("replace recipes");
            return {...state,
                    recipes: [...action.payload]
            };
        case RecipesActions.UPDATE_RECIPE:
            let index = state.selectedRecipeIndex;
            const recipe = state.recipes[index];
            const upRecipe = {...recipe,...action.payload};
            const copyRecipes = [...state.recipes];
            copyRecipes[index] = upRecipe;

            return {...state,
                recipes: copyRecipes
             }; 
        case RecipesActions.SELECTED_RECIPE:
            return {...state,
                    selectedRecipeIndex: action.payload

            };                    
        
        case RecipesActions.ADD_RECIPE:
            return {...state,
                recipes: [...state.recipes, action.payload],
                selectedRecipeIndex: state.recipes.length
            };    
        case RecipesActions.DELETE_RECIPE:
            let selection = state.selectedRecipeIndex;
            
            return {...state,
                        recipes: state.recipes.filter((recipe, index)=>{
                                        return (index !== selection);
                                    }),
                        selectedRecipeIndex: -1
            };             
        default:
            return state;     

    }    
}