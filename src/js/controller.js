import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
// import 'core-js/stable';
// import 'regenerator-runtime';
import RecipeView from './views/recipeView.js';
import SearchView from './views/searchView.js';
import ResultsView from './views/resultsView.js';
import BookmarksView from './views/bookmarksView.js';
import PaginationView from './views/paginationView.js';
import AddRecipeView from './views/addRecipeView.js';
import addRecipeView from './views/addRecipeView.js';
import recipeView from './views/recipeView.js';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    RecipeView.renderSpinner();

    //update results view to mark selected search result
    ResultsView.update(model.getSearchResultsPage());
    BookmarksView.update(model.state.bookmarks);

    //loading recipe
    await model.loadRecipe(id);

    //rendering recipe

    RecipeView.render(model.state.recipe);
  } catch (err) {
    RecipeView.renderError();
    console.log(err);
  }
};

const controlSearchResults = async function () {
  try {
    ResultsView.renderSpinner();

    //getting query
    const query = SearchView.getQuery();
    if (!query) return;

    //loading search results based on query
    await model.loadSearchResults(query);

    //rendering search results

    // ResultsView.render(model.state.search.results);
    ResultsView.render(model.getSearchResultsPage(1));

    //render initial pagination
    PaginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //render NEW results

  ResultsView.render(model.getSearchResultsPage(goToPage));

  //render NEW pagination
  PaginationView.render(model.state.search);

  ResultsView.render(model.getSearchResultsPage(goToPage));
};

const controlServings = function (newServings) {
  //Update the recipe serving(in state)
  model.updateServings(newServings);

  //update the recipe view
  RecipeView.update(model.state.recipe);
};

const controlAddBookmarks = function () {
  //add/remove bookmarks
  if (!model.state.recipe.bookmarked) {
    model.addBookmarks(model.state.recipe);
  } else {
    model.deleteBookmarks(model.state.recipe.id);
  }
  //update recipe view
  RecipeView.update(model.state.recipe);

  //render bookmarks
  BookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  BookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //LOADING SPIINNER
    AddRecipeView.renderSpinner();
    //upload new recipe data

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //render recipe
    RecipeView.render(model.state.recipe);

    //success msg
    AddRecipeView.renderMessage();

    //render bookmark view
    BookmarksView.render(model.state.bookmarks);

    //change ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`)


    //close form window
    setTimeout(function () {
      AddRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log(err);
    AddRecipeView.renderError(err.message);
  }
};

const init = function () {
  model.restoringBookmarks();
  BookmarksView.addHandlerRender(controlBookmarks);
  RecipeView.addHandlerRender(controlRecipes);
  RecipeView.addHandlerUpdateServings(controlServings);
  RecipeView.addHandlerAddBookmarks(controlAddBookmarks);
  SearchView.addHandlerSearch(controlSearchResults);
  PaginationView.addHandlerClick(controlPagination);
  AddRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
