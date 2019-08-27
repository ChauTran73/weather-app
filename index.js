'use strict';
const GOOGLE_KEY ='AIzaSyCuHlSt7CFmuGXVSUTFcJ1iaRaVgOXM7tw';
const DARKSKY_KEY = '835bf47b005187b101cb02bccea176a5';
const googlemap_url = 'https://maps.googleapis.com/maps/api/geocode/json?';
const darksky_url = 'https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/';


function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${key}=${params[key]}`)
    return queryItems.join('&');
}


function getWeatherData(lat,long){
  const params = {
    units: 'si',
  };
  const queryString = formatQueryParams(params)
  const weather_url = darksky_url + DARKSKY_KEY + '/' + lat + ','+ long + '?' + queryString;
  const options = {
    method: 'GET'
  };
  fetch(weather_url,options)
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  })
  .then(responseJson => {displayWeather(responseJson); disPlayTime(responseJson)})
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
 }

 function displayWeather(responseJson){
    $('#results').empty();
    $('#results').append(
      `<div>
      <h2>${disPlayTime(responseJson)}</h2>
      <h2>${responseJson.currently.summary}</h2>
      <canvas id="icon" width="100" height="100"></canvas>
      <h2 id="temp">Temperature: ${Math.round(responseJson.currently.temperature*9/5+32)} °F </h2>
      <span>Humidity: ${responseJson.currently.humidity*100} %</span>
      <span>Windspeed: ${responseJson.currently.windSpeed} m/h</span>
      </div>`
      
    )
        var icon = responseJson.currently.icon;
        var skycons = new Skycons({"color": "black"});
        skycons.add(document.getElementById("icon"), icon);
        skycons.play();
      
       
     
       $("#results").removeClass("hidden");
   
  }
  function disPlayTime(responseJson){
    
    var date = moment.unix(responseJson.currently.time).format('YYYY-MM-DD HH:mm')
    var b = moment(date).tz(responseJson.timezone).format('dddd, MMMM Do, YYYY h:mm a');
    
    return b;

  }
function getCurrentLocation(){
    navigator.geolocation.getCurrentPosition(function(position){
        var lng = position.coords.longitude;
        var lat = position.coords.latitude;
        const params = 
        {
            latlng: [lat,lng]
        }
        const queryString = formatQueryParams(params)
        const url = googlemap_url + queryString + '&key=' + GOOGLE_KEY;
        fetch(url)
        .then(response => response.json())
        .then(responseJson => $("#location").html(responseJson.results[5].formatted_address))//displayLocation function
        .catch(function(err) {
            console.log('Fetch Location Error :-S', err);
          });
        getWeatherData(lat,lng);
    });
}

function getSearchLocation(){
    $("form").on("click", "#search",function(e){
        e.preventDefault();
        var searchLocation = $("#searchTerm").val();
        const params = 
        {
            address: searchLocation
        } 
        const queryString = formatQueryParams(params);
        const url = googlemap_url + queryString + '&key=' + GOOGLE_KEY;
        console.log("searchurl:", url)
        fetch(url)
        .then(response => response.json())
        .then(function(responseJson){
            $("#location").html(responseJson.results[0].formatted_address);
          const lat = responseJson.results[0].geometry.location.lat;
          const long = responseJson.results[0].geometry.location.lng;
          getWeatherData(lat,long);
        })
        .catch(function(err) {
            console.log('Fetch Location Error :-S', err);
          });
          
          
    })
}



function init(){
  getCurrentLocation();
  getSearchLocation();
  
}

$(init());