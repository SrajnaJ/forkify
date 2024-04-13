import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import AddRecipeView from './views/addRecipeView.js';

// import icons from 'url:../img/icons.svg';

import 'core-js/stable'; // for polyfilling everything else
import 'regenerator-runtime/runtime'; //for polyfilling async-await
import fracty from 'fracty';
import addRecipeView from './views/addRecipeView.js';
// console.log(icons);

if (module.hot) {
  module.hot.accept();
}

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// console.log(fracty(0.5));

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // updating results view(preview__link--active class):
    resultsView.update(model.getSearchResultsPage());

    // updating bookmarks view:
    bookmarkView.update(model.state.bookmarks);

    // loading recipe:
    await model.loadRecipe(id);
    // const { recipe } = model.state;

    // Rendering recipe (by calling RecipeView class's fn recipeView  on model module's data)
    recipeView.render(model.state.recipe);

    //TEST
    // controlServings();
  } catch (err) {
    // alert(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1.get search query
    const query = searchView._getQuery();
    if (!query) return;

    // 2. load search results
    await model.loadSearchResults(query);

    //3. render results
    // console.log(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // Render pagination:
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // Render new results:
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Render new pagination btns:
  paginationView.render(model.state.search);
};

// window.addEventListener('hashchange', controlRecipes);

const controlServings = function (newServings) {
  // update servings(data in state):
  model.updateServings(newServings);

  // update view:
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmarks = function () {
  // Add/Remove bookmarks:
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // console.log(model.state.recipe);

  // Update recipe view:
  recipeView.update(model.state.recipe);

  // Render bookmarks:
  bookmarkView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //Show loading spinner:
    addRecipeView.renderSpinner();

    // console.log(newRecipe);

    // upload
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render recipe:
    recipeView.render(model.state.recipe);

    // Success message:
    addRecipeView.renderMessage();

    //Render bookmark view
    bookmarkView.render(model.state.bookmarks);

    // change id in url
    // window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window:
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥💥', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmarks);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  // controlServings();
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
