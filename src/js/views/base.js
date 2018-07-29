export const DOMobjects = {
  searchForm: document.querySelector('.search'),
  searchInput: document.querySelector('.search__field'),
  searchResultContainer: document.querySelector('.results'),
  searchResultList: document.querySelector('.results__list'),
  searchResultPages: document.querySelector('.results__pages'),
  recipe: document.querySelector('.recipe'),
  shopping: document.querySelector('.shopping__list')
};

export const dynamicObjectStrings = {
  loader: 'loader'
}

export const renderLoader = parent => {
  const loaderHTML = `
    <div class="${dynamicObjectStrings.loader}">
      <svg>
        <use href="img/icons.svg#icon-cw"></use>
      </svg
    </div>
  `

  parent.insertAdjacentHTML('afterbegin', loaderHTML);
};

export const clearLoader = () => {
  const loader = document.querySelector(`.${dynamicObjectStrings.loader}`);
  if (loader) {
    loader.parentElement.removeChild(loader);
  }
};