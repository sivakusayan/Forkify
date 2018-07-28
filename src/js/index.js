import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/SearchView';
import * as recipeView from './views/RecipeView';
import { DOMobjects, renderLoader, clearLoader } from './views/base';

/*Global state of the app
--Search Object
--Curent recipe object
--Shopping list object
--Liked recipes
*/

const state = {};

/*-------------------------------------------*/
/* SEARCH CONTROLLER */
/*-------------------------------------------*/
const controlSearch = async () => {
  //1. Get query from view
  const query = searchView.getInput();
  
  if (query) {
    //2. New search object and set to state
    state.search = new Search(query);

    //3. Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(DOMobjects.searchResultContainer);

    try {
      //4. Search for recipes
      await state.search.getResults();

      //5. Render results on UI
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch (error) {
      clearLoader();
      alert('Something is wrong with the search...')
    }
  }
}

DOMobjects.searchForm.addEventListener('submit', event => {
  event.preventDefault();
  controlSearch();
});

window.addEventListener('load', event => {
  event.preventDefault();
  controlSearch();
});

DOMobjects.searchResultPages.addEventListener('click', event => {
  const btn = event.target.closest('.btn-inline');
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
})

/*-------------------------------------------*/
/* RECIPE CONTROLLER */
/*-------------------------------------------*/

const controlRecipe = async () => {
  const id = window.location.hash.replace('#', '');

  if (id) {
    //Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(DOMobjects.recipe);

    //Highlight selected search item
    if (state.search) searchView.highlightSelected(id);

    //Create new recipe object
    state.recipe = new Recipe(id);
    window.r = state.recipe;
    //Get recipe data and parseIngredients
    try {
      await state.recipe.getRecipe();
      //Calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();
      state.recipe.parseIngredients();
      
      //Render recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe);
    } catch (error) {
      console.log(error);
      alert('Error processing recipe!');
    }
  }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

//Handling recipe button clicks
DOMobjects.recipe.addEventListener('click', event => {
  if (event.target.matches('.btn-decrease, .btn-decrease *') && state.recipe.servings > 1) {
    // Decrease button is clicked
    state.recipe.updateServings('dec');
  } else if (event.target.matches('.btn-increase, .btn-increase *')) {
    // Increase button is clicked
    state.recipe.updateServings('inc');
  }
  recipeView.updateServingsIngredients(state.recipe);
})