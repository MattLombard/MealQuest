// Base URL for TheMealDB API: https://www.themealdb.com/api.php
const baseMealDbApi = 'https://www.themealdb.com/api/json/v1/1/'
const createIngredientSearch = (ingredient) => {
	// Example: www.themealdb.com/api/json/v1/1/filter.php?i={ingredient}
	return `${baseMealDbApi}filter.php?i=${ingredient}`
}

// Base URL for the YouTube Data API: https://developers.google.com/youtube/v3/getting-started
const baseYoutubeApi = 'https://youtube.googleapis.com/youtube/v3/'
const youtubeApiKey = 'AIzaSyDcBbcACogqb1GyrMj1M7qNN4B-W9CLhhA'
const createYoutubeSearch = (query) => {
	// Example: https://youtube.googleapis.com/youtube/v3/search?maxResults=5&q=${query}&key=AIzaSyDcBbcACogqb1GyrMj1M7qNN4B-W9CLhhA
	return `${baseYoutubeApi}search?maxResults=5&q=${query}&key=${youtubeApiKey}`
}
