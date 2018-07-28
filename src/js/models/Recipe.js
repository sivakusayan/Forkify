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

  parseIngredients() {
    const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds', 'kilograms', 'kilogram', 'grams', 'gram'];
    const unitsShort = ['tbsps', 'tbsp', 'oz', 'oz', 'tsps', 'tsp', 'cup', 'pound', 'kg', 'kg', 'g', 'g'];

    const newIngredients = this.ingredients.map(cur => {
      // Uniform units
      let ingredient = cur.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]);
      }) 
      // Remove parentheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

      //Pare ingredients into count, unit, and ingredient
      const arrayIng = ingredient.split(' ');
      const unitIndex = arrayIng.findIndex(word => unitsShort.includes(word));
      let objIng;

      if (unitIndex > -1) {
        // 1) There is a unit
        const arrCount = arrayIng.slice(0, unitIndex);
        arrCount[0] = arrCount[0].replace('-', '+');

        objIng = {
          count: eval(arrCount.join('+')),
          unit: arrayIng[unitIndex],
          ingredient: arrayIng.slice(unitIndex + 1).join(' ')
        }

      } else if (parseInt(arrayIng[0])) {
        // 2) There is no unit, but first element is number
        objIng = {
          count: parseInt(arrayIng[0]),
          unit: '',
          ingredient: arrayIng.slice(1).join(' ')
        }
      } else if (unitIndex === -1) {
        // 3) There is no unit or number
        objIng = {
          count: 1,
          unit: '',
          ingredient
        }
      }

      return objIng;
    });
    this.ingredients = newIngredients;
  }
}