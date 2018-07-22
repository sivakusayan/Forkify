import Search from './models/Search';
import * as searchView from './views/SearchView';
import { DOMobjects, renderLoader, clearLoader } from './views/base';

/*Global state of the app
--Search Object
--Curent recipe object
--Shopping list object
--Liked recipes
*/

const state = {};

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