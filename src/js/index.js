import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/SearchView';
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

    //4. Search for recipes
    await state.search.getResults();

    //5. Render results on UI
    clearLoader();
    searchView.renderResults(state.search.result);
  }
}

DOMobjects.searchForm.addEventListener('submit', event => {
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
  console.log(id);

  if (id) {
    //Prepare UI for changes

    //Create new recipe object
    state.recipe = new Recipe(id);
    //Get recipe data
    await state.recipe.getRecipe();
    //Calculate servings and time
    state.recipe.calcTime();
    state.recipe.calcServings();
    //Render recipe
    console.log(state.recipe);
  }
};

window.addEventListener('hashchange', controlRecipe);