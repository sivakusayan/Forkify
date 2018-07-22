import { DOMobjects } from './base';

export const getInput = () => DOMobjects.searchInput.value;

export const clearInput = () => {
  DOMobjects.searchInput.value = '';
}

const limitRecipeTitle = (title, limit = 17) => {
  if (title.length > limit) {
    const newTitle = [];

    title.split(' ').reduce((acc, word) => {
      if (acc + word.length <= limit) {
        newTitle.push(word);
        return acc + word.length;
      }
    }, 0);

    return newTitle.join(' ') + ' ...';
  }
  return title;
}

export const clearResults = () => {
  DOMobjects.searchResultList.innerHTML = '';
  DOMobjects.searchResultPages.innerHTML = '';
}

const renderRecipe = recipe => {
  const recipeHTML = `
    <li>
      <a class="results__link" href="#${recipe.recipe_id}">
        <figure class="results__fig">
          <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
        <div class="results__data">
          <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
          <p class="results__author">${recipe.publisher}</p>
        </div>
      </a>
    </li>
  `;

  DOMobjects.searchResultList.insertAdjacentHTML('beforeend', recipeHTML);
}

//type: 'prev' or 'next'
const createButton = (page, type) => `
  <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
    <svg class="search__icon">
      <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
    </svg>
    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
  </button>
`;

const renderButtons = (page, numResults, resultsPerPage) => {
  const numPages = Math.ceil(numResults / resultsPerPage);
  let button;

  if (page === 1 && numPages > 1) {
    //Button to go to next page
    button = createButton(page, 'next');
  } else if (page < numPages) {
    button = `
      ${createButton(page, 'prev')}
      ${createButton(page, 'next')}
    `
  } else if (page === numPages && numPages > 1) {
    //Button to go to last page
    button = createButton(page, 'prev');
  }

  DOMobjects.searchResultPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resultsPerPage = 10) => {
  //Render results of current page
  const start = resultsPerPage * (page - 1);
  const end = resultsPerPage * (page);
  recipes.slice(start, end).forEach(renderRecipe);

  //Render pagination buttons
  renderButtons(page, recipes.length, resultsPerPage);
}