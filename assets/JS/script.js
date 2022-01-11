// API key
var APIKey = "366a2e7bcfd3223a70d54d9bb00665b2";

// longitude, latitude of the city
var long;
var lat;
var city;

// This event will occur when the user enters a city name
// uses Geocoding API to get the latitude and longitude of the city
$("#searchCity").click(function () {
    // stores the city name into a local variable
    city = $("#inputCity").val();

    // API used: https://openweathermap.org/api/geocoding-api
    // appends the query parameters to make a query URL
    var queryURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + APIKey;


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
        // checks for any errors
        console.log(long);
        console.log(lat);
        // This function will get the weather statistics of the current day
        getWeather();
    });
});

// Function retrieves the current weather statistics of the city and displays it on the DOM
// Also retrieves the humidity and weather icons for the next 5 days
function getWeather() {
    // One Call API used: https://openweathermap.org/api/one-call-api
    var queryURL2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" 
    + long + "&units=imperial" + "&appid=" + APIKey;
    $.ajax({
        url: queryURL2,
        method: "GET"
    }).then(function (response) {
        console.log(response);

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