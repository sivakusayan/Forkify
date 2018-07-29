import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/SearchView';
import * as recipeView from './views/RecipeView';
import * as listView from './views/ListView';
import { DOMobjects, renderLoader, clearLoader } from './views/base';

/*Global state of the app
--Search Object
--Curent recipe object
--Shopping list object
--Liked recipes
*/

const state = {};
window.state = state;

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

/*-------------------------------------------*/
/* RECIPE CONTROLLER */
/*-------------------------------------------*/

const controlList = () => {
  // Create new list if there is none yet
  if (!state.list) state.list = new List();

  // Add each ingredient to the list and UI
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  })
}

//Handle delete and update list item events
DOMobjects.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;

  //Handle delete button 
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    //Delete from state
    state.list.deleteItem(id);
    //Delete from UI
    listView.deleteItem(id);
  //Handle update button
  } else if (e.target.matches('.shopping__count-value')) {
    const val = parseFloat(e.target.value);
    state.list.updateCount(id, val);
  }
})

//Handling recipe button clicks
DOMobjects.recipe.addEventListener('click', event => {
  if (event.target.matches('.btn-decrease, .btn-decrease *') && state.recipe.servings > 1) {
    // Decrease button is clicked
    state.recipe.updateServings('dec');
    recipeView.updateServingsIngredients(state.recipe);
  } else if (event.target.matches('.btn-increase, .btn-increase *')) {
    // Increase button is clicked
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  } else if (event.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    controlList();
  }
})

window.l = new List(); 