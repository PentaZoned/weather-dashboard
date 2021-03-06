// API key
var APIKey = "366a2e7bcfd3223a70d54d9bb00665b2";

var long;   // longitude
var lat;    // latitude
var city;   // city name

// to store cities for localstorage
var cities = {
    city: undefined,
    lat: undefined,
    long: undefined
};

var newList = [];


// This event will occur when the user enters a city name and presses submit
// uses Geocoding API to get the latitude and longitude of the city, will be used for the second ajax request
$("#searchCity").click(searching);
function searching() {
    // stores the city name into a local variable
    city = $("#inputCity").val();
    // resets input text after it has been stored
    $("#inputCity").val("");

    // checks if the user entered a city name
    // if city is null then the user will be alerted
    // if there is an input, process the ajax call
    if(!city){
        alert("Please enter a city.");
    } else {
        apiCall();
        appendList();
    };
};

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
        $("#currUV").text(" " + response.current.uvi);

        // This if statement will compare the uv index to a standard and color the background according to the levels
        // The uv index scale does not have negative numbers
        if(response.current.uvi >= 0 && response.current.uvi < 3) {
            // If the uv index is equal or greater than 0 and less than 3, apply a green background to this value
            $("#currUV").addClass("bg-success text-white p-2");
        } else if (response.current.uvi >= 3 && response.current.uvi < 8) {
            // If the uv index is equal or greater than 3 and less than 8, apply a green background to this value
            $("#currUV").className = "bg-warning text-white p-2";
        } else {
            // the remaining scenarios should be numbers equal or higher than 8
            $("#currUV").className = "bg-danger text-white p-2";
        }

        // assigns the temperature of the next 5 days to the cards
        $("#cardOneTemp").text("Temp: " + response.daily[0].feels_like.day + " \u00B0 F");
        $("#cardTwoTemp").text("Temp: " + response.daily[1].feels_like.day + " \u00B0 F");
        $("#cardThreeTemp").text("Temp: " + response.daily[2].feels_like.day + " \u00B0 F");
        $("#cardFourTemp").text("Temp: " + response.daily[3].feels_like.day + " \u00B0 F");
        $("#cardFiveTemp").text("Temp: " + response.daily[4].feels_like.day + " \u00B0 F");

        // assigns weather icons based on the type of weather
        // daily[0] actually refers to today, so we start at daily[1] to reference the day after today
        $("#currIcon").attr("src", "http://openweathermap.org/img/wn/" + response.daily[0].weather[0].icon + ".png");
        $("#cardOneIcon").attr("src", "http://openweathermap.org/img/wn/" + response.daily[1].weather[0].icon + ".png");
        $("#cardTwoIcon").attr("src", "http://openweathermap.org/img/wn/" + response.daily[2].weather[0].icon + ".png");
        $("#cardThreeIcon").attr("src", "http://openweathermap.org/img/wn/" + response.daily[3].weather[0].icon + ".png");
        $("#cardFourIcon").attr("src", "http://openweathermap.org/img/wn/" + response.daily[4].weather[0].icon + ".png");
        $("#cardFiveIcon").attr("src", "http://openweathermap.org/img/wn/" + response.daily[5].weather[0].icon + ".png");


        // assigns the humidity of the next 5 days to the cards
        $("#cardOneHumidity").text("Humidity: " + response.daily[0].humidity + "%");
        $("#cardTwoHumidity").text("Humidity: " + response.daily[1].humidity + "%");
        $("#cardThreeHumidity").text("Humidity: " + response.daily[2].humidity + "%");
        $("#cardFourHumidity").text("Humidity: " + response.daily[3].humidity + "%");
        $("#cardFiveHumidity").text("Humidity: " + response.daily[4].humidity + "%");

    })
};

// This function will create a new list element with the city and state and append it to an unordered list below the search bar
function appendList() {
    var newListItem = document.createElement("button"); // create a new variable referencing a list element
    newListItem.innerHTML = city;   // adds the contents to the list element
    newListItem.className = "list-group-item btn btn-primary";      // adds styling to each list item
    newList.push(city);
    $("#previousCities").prepend(newListItem);      // adds the new list item at the beginning of the entire list
    storeCities();
}

// Displays the previous cities at reload
function displayCities() {
    $("#previousCities").html("");
    
    for(var i = 0; i < newList.length; i++) {
        var newListing = newList[i];
        console.log("NEWLIST: " + newList);
        var li = document.createElement("button");
        li.textContent = newListing;
        li.className = "list-group-item btn btn-primary";

        $("#previousCities").prepend(li);
        storeCities();
    }
    city = newListing;
    $("button").click(apiCall);
}

function apiCall() {
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
            // The longitude and latitude is necessary for the other API calls to function
            long = response[0].lon;
            lat = response[0].lat;

            // This will enable proper capitalization of city name by taking the stored name from the API
            // user can submit a city name in all lower case, and the output would be capitalized
            city = response[0].name;
            // changes the location title to the city and state
            $("#currCity").text(city);
            
            // checks for any errors
            console.log(long);
            console.log(lat);
            console.log(city);

            // This function will get the weather statistics of the current day
            getWeather();
        })
}

// parses the stored information and sets a function to display it
function init() {
    var storedCities = JSON.parse(localStorage.getItem("newList"));

    if(storedCities !== null) {
        newList = storedCities;
    }
    displayCities();
}

// sets information into localstorage
function storeCities() {

    localStorage.setItem("newList", JSON.stringify(newList));
}

init();