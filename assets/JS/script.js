// API key
var APIKey = "366a2e7bcfd3223a70d54d9bb00665b2";

// longitude, latitude of the city
var long;
var lat;
// This event will occur when the user enters a city name
// uses Geocoding API to get the latitude and longitude of the city
$("#searchCity").click(function () {
    // stores the city name into a local variable
    var city = $("#inputCity").val();
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

        getCurrDay();
    });
});

function getCurrDay() {

    var queryURL2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" 
    + long + "&units=imperial" + "&appid=" + APIKey;
    $.ajax({
        url: queryURL2,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        $("#currTemp").text("Temperature: " + response.current.temp + " \u00B0 F");
        $("#currHumidity").text("Humidity: " + response.current.humidity + "%");
        $("#currWind").text("Wind Speed: " + response.current.wind_speed + " MPH");
        $("#currUV").text("UV Index: " + response.current.uvi);

    })
}