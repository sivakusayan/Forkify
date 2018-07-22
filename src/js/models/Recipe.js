import axios from 'axios';
import { key, proxy } from '../config';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(`${proxy}http://food2fork.com/api/get?key=${key}&rId=${this.id}`);
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.imgURL = res.data.recipe.image_url;
      this.srcURL = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
    } catch(error) {
      alert(error);
    }
  }

  calcTime() {
    //Assuming we need 15 min for each 3 ingredients
    const numIngredients = this.ingredients.length;
    const periods = Math.ceil(numIngredients / 3);
    this.time = periods * 15;
  }

  calcServings() {
    this.servings = 4;
  }
}