// API key
var APIKey = "366a2e7bcfd3223a70d54d9bb00665b2";

// longitude, latitude of the city
var long;
var lat;
var city;
var state;
// This event will occur when the user enters a city name and presses submit
// uses Geocoding API to get the latitude and longitude of the city, will be used for the second ajax request
$("#searchCity").click(function () {
    // stores the city name into a local variable
    city = $("#inputCity").val();


    // API used: https://openweathermap.org/api/geocoding-api
    // appends the query parameters to make a query URL
    var queryURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + APIKey;

    // sends a request to the api to retrieve the data we want
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        // necessary to view the received data and work around its structure
        console.log(response);

        // assign the received data into usable variables
        // This is necessary for the other API calls to function
        long = response[0].lon;
        lat = response[0].lat;

        // This will enable proper capitalization of city name by taking the stored name from the API
        // user can submit a city name in all lower case, and the output would be capitalized
        city = response[0].name;
        // assigns the city's state to a variable
        state = response[0].state;
        // changes the location title to the city and state
        $("#currCity").text(city + ", " + state);

        appendList();
        // checks for any errors
        console.log(long);
        console.log(lat);

        // This function will get the weather statistics of the current day
        getWeather();
    });
});

// Function retrieves the current weather statistics of the city and displays it on the DOM
// Retrieves the humidity, temperature and weather icons for the next 5 days
function getWeather() {
    // One Call API used: https://openweathermap.org/api/one-call-api
    var queryURL2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" 
    + long + "&units=imperial" + "&appid=" + APIKey;

    // Sends a request to the api to retrieve the data we want
    $.ajax({
        url: queryURL2,
        method: "GET"
    }).then(function (response) {
        // Displays the contents in our console
        console.log(response);

        // Replaces the today title with the current date and time
        var todayReplace = moment().format('dddd, MMMM Do, YYYY, h:mm:ss a');

        // Takes the Unix timestamp at the 'daytime' of that day from retrieved data and assign it to a variable
        var dayOneReplace = response.daily[1].dt;
        var dayTwoReplace = response.daily[2].dt;
        var dayThreeReplace = response.daily[3].dt;
        var dayFourReplace = response.daily[4].dt;
        var dayFiveReplace = response.daily[5].dt;

        // Checks if at least one variable works
        console.log(dayOneReplace);

        // Formats the Unix timestamp into a readable format
        dayOneReplace = moment(dayOneReplace, "X").format('dddd, MMM Do');
        dayTwoReplace = moment(dayTwoReplace, "X").format('dddd, MMM Do');
        dayThreeReplace = moment(dayThreeReplace, "X").format('dddd, MMM Do');
        dayFourReplace = moment(dayFourReplace, "X").format('dddd, MMM Do');
        dayFiveReplace = moment(dayFiveReplace, "X").format('dddd, MMM Do');

        // Replaces all of the title text with the formatted time
        $("#currentDay").text(todayReplace);
        $("#dayOne").text(dayOneReplace);
        $("#dayTwo").text(dayTwoReplace);
        $("#dayThree").text(dayThreeReplace);
        $("#dayFour").text(dayFourReplace);
        $("#dayFive").text(dayFiveReplace);

        // assigns the current day's temperatures found in the response to the corresponding html element
        $("#currTemp").text("Temperature: " + response.current.temp + " \u00B0 F");
        $("#currHumidity").text("Humidity: " + response.current.humidity + "%");
        $("#currWind").text("Wind Speed: " + response.current.wind_speed + " MPH");
        $("#currUV").text("UV Index: " + response.current.uvi);

        // assigns the temperature of the next 5 days to the cards
        $("#cardOneTemp").text("Temp: " + response.daily[0].feels_like.day + " \u00B0 F");
        $("#cardTwoTemp").text("Temp: " + response.daily[1].feels_like.day + " \u00B0 F");
        $("#cardThreeTemp").text("Temp: " + response.daily[2].feels_like.day + " \u00B0 F");
        $("#cardFourTemp").text("Temp: " + response.daily[3].feels_like.day + " \u00B0 F");
        $("#cardFiveTemp").text("Temp: " + response.daily[4].feels_like.day + " \u00B0 F");

        // assigns weather icons based on the type of weather
        /*
        $("#cardOneIcon").attr("src", response.daily[0].weather[0].icon + ".png");
        $("#cardTwoIcon").attr("src", response.daily[0].weather[0].icon + ".png");
        $("#cardThreeIcon").attr("src", response.daily[0].weather[0].icon + ".png");
        $("#cardFourIcon").attr("src", response.daily[0].weather[0].icon + ".png");
        $("#cardFiveIcon").attr("src", response.daily[0].weather[0].icon + ".png");
        */

        // assigns the humidity of the next 5 days to the cards
        $("#cardOneHumidity").text("Humidity: " + response.daily[0].humidity + "%");
        $("#cardTwoHumidity").text("Humidity: " + response.daily[1].humidity + "%");
        $("#cardThreeHumidity").text("Humidity: " + response.daily[2].humidity + "%");
        $("#cardFourHumidity").text("Humidity: " + response.daily[3].humidity + "%");
        $("#cardFiveHumidity").text("Humidity: " + response.daily[4].humidity + "%");

    })
};

function appendList() {
    var newListItem = document.createElement("LI");
    newListItem.innerHTML = city + ", " + state;
    newListItem.className = "list-group-item";
    $("#previousCities").prepend(newListItem);
}