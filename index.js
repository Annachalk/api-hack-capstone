'use strict'

const searchUrl = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s='
const newsApiKey = "4c7b0c19e9d74afe982d773604074e2f"
const newsUrl = "https://newsapi.org/v2/everything?q=cocktails&language=en";
const videosUrl = 'https://www.googleapis.com/youtube/v3/videos'
const videoApiKey = "AIzaSyAKGQo-ob44h9u7PIs5UCx2lgkoIFVVIdw"


//function to get news related to cocktails
function newsSection() {
    const options = {
        headers: new Headers({
            "X-Api-Key": newsApiKey
        })
    };
    fetch(newsUrl, options)
        .then(response => response.json())
        .then(responseJson => console.log(responseJson));
};

//format the data
function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function displayResults(responseJson) {
    //responseJson.drinks.length
    $('#results').empty();
    // const preparedData = responseJson.drinks[0].

    console.log(responseJson)
    for (let i = 0; i < 5; i++) {

        //prepare ingredients
        const ingredients = [];

        //preprare measure
        const measureKeys = [];

        //get all the object properties
        const objKeys = Object.keys(responseJson.drinks[i]);

        for (let j = 0; j < objKeys.length; j++) {

            if (objKeys[j].includes('strIngredient') && responseJson.drinks[i][objKeys[j]] != null) {
                ingredients.push(responseJson.drinks[i][objKeys[j]])
            }
        }
        console.log(ingredients);
        for (let j = 0; j < objKeys.length; j++) {

            if (objKeys[j].includes('strMeasure') && responseJson.drinks[i][objKeys[j]] != null) {
                measureKeys.push(responseJson.drinks[i][objKeys[j]])
            }
        }
        console.log(measureKeys);
        $('#results').append(
            `<div>
                <ul class="results-list1">
                    <li><h3>Cocktail Name: </h3><p>${responseJson.drinks[i].strDrink}</p></li>
                    <li><h3>Instructions: </h3><p>${responseJson.drinks[i].strInstructions}</p></li>
                    <li><img src="${responseJson.drinks[i].strDrinkThumb}" height="100" width="100" alt = "picture of a cocktail"></img></li>
                    <li><h4>Ingredients: </h3><p>${ingredients}</p></li>
                    <li><h4></h3><p>${measureKeys}</p></li>
                    </ul>
            </div>`
        )
    }
    $('#results').removeClass('hidden');
}

//function to get the recipe
function getRecipe(searchTerm) {
    const recipeSearch = searchUrl + searchTerm
    console.log(recipeSearch)
    fetch(recipeSearch)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });

};

function displayVideos(responseJson) {

    // $('#results').empty();

    for (let i = 0; i < responseJson.items.length; i++) {
        $('#results').append(
            `<div class = "videos">
                <ul class="result-list2">
                    <li><h3>Full name: </h3><p class="result-header">${responseJson.items[i]}</p></li>
                    <li><h3>Description: </h3><p>${responseJson.items[i]}</p></li>
                    <li><h3>Website URL: </h3><a href="${responseJson.items[i]}"></a></li>
                </ul>
            </div>`
        )
    }

    $('#results').removeClass('hidden');
}

//function to get youtube videos 
function getVideos(searchTerm) {
    const params = {
        key: videoApiKey,
        part: 'snippet',
        maxResults: 5,
        chart: 'mostPopular',
        q: searchTerm,
        type: 'video',
        relevanceLanguage: 'en'
    };
    const queryString = formatQueryParams(params)
    const urlYoutube = videosUrl + '?' + queryString;
    console.log('delete', urlYoutube);

    fetch(urlYoutube)
        .then(response => response.json())
        .then(responseJson => displayVideos(responseJson));
};

//event listener 
function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        this.searchTerm = $('#js-search-term').val();
        getVideos(this.searchTerm);
        newsSection();
        getRecipe(this.searchTerm);
    });
}
$(watchForm);

