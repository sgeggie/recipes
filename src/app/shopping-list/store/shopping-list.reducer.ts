import { Ingredient } from "../../shared/ingredient.model";
import * as ShoppingListActions from "./shopping-list.actions";

export interface slState {
    ingredients: Ingredient[],
    selectedIngredient: Ingredient,
    selectedIngredientIndex: number
}
const initialState: slState = {
    ingredients:[
        new Ingredient("apples", 5),
        new Ingredient("tomatoes", 10)],
    selectedIngredient: null,
    selectedIngredientIndex: -1    
}
export function shoppingListReducer(state:slState=initialState, action: ShoppingListActions.ShoppingListActions){

    switch(action.type){
        //treat the state as "immutable" copies....
        
        case ShoppingListActions.ADD_INGREDIENT:
            //payload is a single ingredient added to the array
            return { ...state,
                ingredients: [...state.ingredients, action.payload],
                selectedIngredient: null,
                selectedIngredientIndex: -1
            }
        case ShoppingListActions.ADD_INGREDIENTS:
            //payload is an array of ingredients that must be joined with exisitng array
            return { ...state,
                ingredients: [...state.ingredients, ...action.payload],
                selectedIngredient: null,
                selectedIngredientIndex: -1
            }
        case ShoppingListActions.UPDATE_INGREDIENT:
            //payload is an ingredient and an index into the array of ingredients
            {   let index = state.selectedIngredientIndex; 
                const ingredient = state.ingredients[index];
                //replace properties of the state ingredient with payload ingredient
                const updatedIngredient = {
                    ...ingredient, 
                    ...action.payload
                }
                const updatedIngredients = [...state.ingredients]; //deep copy of state ingredients
                updatedIngredients[index] = updatedIngredient;

                //return a replicata of state, replacing the updated ingredients    
                return { ...state,
                    ingredients: updatedIngredients,
                    selectedIngredient: null,
                    selectedIngredientIndex: -1
                }
            }
        case ShoppingListActions.DELETE_INGREDIENT:
            //payload is an ingredient and an index into the array of ingredients
            {   let index = state.selectedIngredientIndex; 
                
                return { ...state,
                    ingredients: state.ingredients.filter((ingred, ingredIndex) =>
                        {
                            return index !== ingredIndex;                
                        })
                }
            }                                
        case ShoppingListActions.SELECTED_INGREDIENT:
            //payload is an ingredient and an index into the array of ingredients
            {   let index = action.payload; 
                               
                //return a replicata of state, replacing the updated ingredients    
                return { ...state,
                    selectedIngredient: {...state.ingredients[index]},
                    selectedIngredientIndex: index
                }
            }
        case ShoppingListActions.CLEAR_INGREDIENT:
            return {...state,
                selectedIngredient: null,
                selectedIngredientIndex: -1
            }    
        default:
        return state;    


    }
}