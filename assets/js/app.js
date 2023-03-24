// Base URL for TheMealDB API: https://www.themealdb.com/api.php
const baseMealDbApi = 'https://www.themealdb.com/api/json/v1/1/';
const mealDbApiRandom = `${baseMealDbApi}random.php`;
const createIngredientSearch = (ingredient) => {
  // Example: www.themealdb.com/api/json/v1/1/filter.php?i={ingredient}
  return `${baseMealDbApi}filter.php?i=${ingredient}`;
};

// Base URL for the YouTube Data API: https://developers.google.com/youtube/v3/getting-started
const baseYoutubeApi = 'https://youtube.googleapis.com/youtube/v3/';
const youtubeApiKey = 'AIzaSyBHBGlan35SJCnaKo6_4TdLPObUAbrEcNg';
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
  fetch(mealDbApiRandom).then(toJSON).then(mealToHTML).catch(console.log);
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

      // After getting a random meal id, get more information on the meal
      const mealByIdUrl = baseMealDbApi + 'lookup.php?i=' + randomMeal.idMeal;
      fetch(mealByIdUrl).then(toJSON).then(mealToHTML).catch(console.log);
    })
    .catch(console.log);
};

var displayhistory = () => {
  $('#history-ul').text('');
  var mealhistory = localStorage.getItem('mealHistory');
  if (!mealhistory) {
    return;
  } else {
    mealhistory = JSON.parse(mealhistory);
  }
  for (const mealid in mealhistory) {
    var mealli = $('<li>').addClass('w-4/5 mx-auto');
    var mealButton = $('<button>').text(mealhistory[mealid]).addClass('p-2 rounded hover:bg-blue-400 bg-blue-300 m-1 w-full');
    mealButton.click(() => {
      var mealidurl = baseMealDbApi + 'lookup.php?i=' + mealid;
      fetch(mealidurl).then(toJSON).then(mealToHTML).catch(console.log);
    });
    $('#history-ul').append(mealli);
    mealli.append(mealButton);
  }
};

var saveMeal = (mealid, mealname) => {
  var mealhistory = localStorage.getItem('mealHistory');
  if (!mealhistory) {
    mealhistory = {};
  } else {
    mealhistory = JSON.parse(mealhistory);
  }
  mealhistory[mealid] = mealname;
  localStorage.setItem('mealHistory', JSON.stringify(mealhistory));
  displayhistory();
};

var mealToHTML = (meal) => {
  meal = meal.meals[0];
  saveMeal(meal.idMeal, meal.strMeal);
  // Make elements to put on HTML
  var outerDiv = $('<div>').addClass('flex flex-row flex-wrap');

  // Column 1: Title/Instructions
  var titleInstructionDiv = $('<div>').addClass('basis-full lg:basis-1/2 p-4');
  var title = $('<h3>').text(meal.strMeal).addClass('text-2xl');
  var instructions = $('<p>').text(meal.strInstructions).addClass('mt-5');
  titleInstructionDiv.append(title, instructions);

  // Column 2: Image
  var imgDiv = $('<div>').addClass('basis-full lg:basis-1/2 p-4');
  var mealImg = $('<img>').attr('src', meal.strMealThumb);
  imgDiv.append(mealImg);

  // Column 3: Ingredients
  var ingredientsObject = mealIngredientsToObject(meal);
  var ingredientsDiv = $('<div>').addClass('basis-full p-4');
  var ingredientsHeader = $('<h4>').addClass('text-xl mb-2').text('Ingredients');
  var ingredientsUl = $('<ul>');
  ingredientsDiv.append(ingredientsHeader, ingredientsUl);
  // Make an li for each ingredient
  var ingredientArray = Object.keys(ingredientsObject);
  for (let i = 0; i < ingredientArray.length; i++) {
    const ingredientLi = $('<li>');
    const ingredient = ingredientArray[i];
    ingredientLi.text(`${ingredient}: ${ingredientsObject[ingredient].toLowerCase()}`);
    ingredientsUl.append(ingredientLi);
  }
  // Column 4 YT
  var youtubeDiv = $('<div>').addClass('basis-full p-4 flex flex-row flex-wrap gap-5');
  var youtubeHeader = $('<h4>').text(`YouTube videos about ${meal.strMeal}`);
  youtubeHeader.addClass('basis-full text-xl border-t-4 pt-2 border-gray-600');
  youtubeDiv.append(youtubeHeader);
  var youtubeURL = createYoutubeSearch(meal.strMeal);
  fetch(youtubeURL)
    .then(toJSON)
    .then((data) => {
      for (let videoObject of data.items) {
        var youtubeIframe = $('<iframe>');
        const videoId = videoObject.id.videoId;
        youtubeIframe.attr('src', 'https://www.youtube.com/embed/' + videoId);
        youtubeIframe.attr('allowfullscreen', 'true');
        youtubeDiv.append(youtubeIframe);
      }
    });
  // Clear the results
  $('#search-results').text('');
  // Append elements to HTML
  $('#search-results').append(outerDiv);
  outerDiv.append(titleInstructionDiv, imgDiv, ingredientsDiv, youtubeDiv);
};

var mealIngredientsToObject = (meal) => {
  var toReturn = {};
  const ingredientBase = 'strIngredient';
  const measureBase = 'strMeasure';
  for (let i = 1; i <= 20; i++) {
    let currentIngredient = ingredientBase + i;
    let currentMeasure = measureBase + i;
    if (meal[currentIngredient] && meal[currentMeasure]) {
      toReturn[meal[currentIngredient]] = meal[currentMeasure];
    } else {
      break;
    }
  }
  return toReturn;
};

const clearHistory = () => {
  localStorage.removeItem('mealHistory');
  displayhistory();
};

// Event handlers
$('#search-form').on('submit', handleSearch);
$('#history-clear').click(clearHistory);

// On page load
$(() => {
  // Show the history on page load and get random meal
  getRandomMeal();
  displayhistory();
});
