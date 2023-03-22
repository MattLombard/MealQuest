// Base URL for TheMealDB API: https://www.themealdb.com/api.php
const baseMealDbApi = 'https://www.themealdb.com/api/json/v1/1/';
const mealDbApiRandom = `${baseMealDbApi}random.php`;
const createIngredientSearch = (ingredient) => {
  // Example: www.themealdb.com/api/json/v1/1/filter.php?i={ingredient}
  return `${baseMealDbApi}filter.php?i=${ingredient}`;
};

// Base URL for the YouTube Data API: https://developers.google.com/youtube/v3/getting-started
const baseYoutubeApi = 'https://youtube.googleapis.com/youtube/v3/';
const youtubeApiKey = 'AIzaSyDcBbcACogqb1GyrMj1M7qNN4B-W9CLhhA';
const createYoutubeSearch = (query) => {
  // Example: https://youtube.googleapis.com/youtube/v3/search?maxResults=5&q=${query}&key=AIzaSyDcBbcACogqb1GyrMj1M7qNN4B-W9CLhhA
  return `${baseYoutubeApi}search?maxResults=5&q=${query}&key=${youtubeApiKey}`;
};

// A utility function that converts responses to JSON
const toJSON = (response) => {
  return response.json();
};

// Function that fetches a random meal
const getRandomMeal = () => {
  fetch(mealDbApiRandom)
    .then(toJSON)
    .then((data) => {
      // TODO: Populate the HTML page with the random meal
    })
    .catch(console.log);
};

var handleSearch = (event) => {
  event.preventDefault();

  var qInput = $('#search-bar');
  var searchBar = qInput.val().trim();

  if (!searchBar) {
    return;
  }

  var apiURL = baseMealDbApi + 'filter.php?i=' + searchBar;

  fetch(apiURL)
    .then(toJSON)
    .then((data) => {
      const randomNumber = Math.floor(Math.random() * data.meals.length);
      const randomMeal = data.meals[randomNumber];
      console.log(randomMeal);

      // After getting a random meal id, get more information on the meal
      const mealByIdUrl = baseMealDbApi + 'lookup.php?i=' + randomMeal.idMeal;
      fetch(mealByIdUrl).then(toJSON).then(mealToHTML).catch(console.log);
    })
    .catch(console.log);
};

var mealToHTML = (meal) => {
  meal = meal.meals[0];

  // Make elements to put on HTML
  var title = $('<h3>').text(meal.strMeal);
  var mealImg = $('<img>').attr('src', meal.strMealThumb);
  var instructions = $('<p>').text(meal.strInstructions);

  // Clear the results
  $('#search-results').text('');
  // Append elements to HTML
  $('#search-results').append(title, mealImg, instructions);
};

// Event handlers
$('#search-form').on('submit', handleSearch);
