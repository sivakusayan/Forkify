import { DOMobjects } from './base';
import { limitRecipeTitle } from './searchView';

export const toggleLikeBtn = isLiked => {
  const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
  document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
}

export const toggleLikeMenu = numLikes => {
  DOMobjects.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
}

export const renderLike = like => {
  const markup = `
    <li>
      <a class="likes__link" href="#${like.id}">
        <figure class="likes__fig">
          <img src="${like.imgURL}" alt="${like.title}">
        </figure>
        <div class="likes__data">
          <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
          <p class="likes__author">${like.author}</p>
        </div>
      </a>
    </li>
  `;
  DOMobjects.likesList.insertAdjacentHTML('beforeend', markup);
}

export const deleteLike = id => {
  const like = document.querySelector(`.likes__link[href="#${id}}"]`).parentElement;
  if (like) like.parentElement.removeChild(like);
}