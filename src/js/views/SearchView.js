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

export const renderResults = recipes => {
  recipes.forEach(renderRecipe);
}