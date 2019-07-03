'use strict';
const GOOGLE_KEY ='AIzaSyCuHlSt7CFmuGXVSUTFcJ1iaRaVgOXM7tw';
const DARKSKY_KEY = '835bf47b005187b101cb02bccea176a5';
const googlemap_url = 'https://maps.googleapis.com/maps/api/geocode/json?';
const darksky_url = 'https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/'

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${key}=${params[key]}`)
    return queryItems.join('&');
  }

function getWeather(lat,long){
  const params = {
    units: 'si',
  };
  const queryString = formatQueryParams(params)
  const weather_url = darksky_url + DARKSKY_KEY + '/' + lat + ','+ long + '?' + queryString;
  const options = {
    method: 'GET'
  };
  fetch(weather_url,options)
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }
      response.json().then(function(data) {
        var condition = data.currently.summary;
        $("#condition").html(condition);
        var icon = data.currently.icon;
        var skycons = new Skycons({"color": "black"});
        skycons.add(document.getElementById("icon"), icon);
        skycons.play();
        var temp = data.currently.temperature;
        var tempCelsius = Math.round(temp);
        var tempFah = Math.round(temp*9/5+32);
       var celsius = true;
       $("#temperature").html(tempCelsius + ' °C');
      $("#temperature").click(function(){
      if (celsius) {
    	$(".toggle").html(tempCelsius + ' °C');
    } 
      else {
      $("#temperature").html(tempFah + ' °F');
    }
    celsius = !celsius;
      });

    }
  )})
  .catch(function(err) {
    console.log('Fetch Weather Error :-S', err);
  })
  
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
        .then(responseJson => $("#location").html(responseJson.results[5].formatted_address))
        .catch(function(err) {
            console.log('Fetch Location Error :-S', err);
          });
        getWeather(lat,lng);
    });
}

function getSearchLocation(){
    $("#search").on("click",function(){
        var searchLocation = $("#searchTerm").val();
        const params = 
        {
            address: searchLocation
        }
        const queryString = formatQueryParams(params);
        const url = googlemap_url + queryString + '&key=' + GOOGLE_KEY;
        fetch(url)
        .then(response => response.json())
        .then(function(responseJson){
            $("#location").html(responseJson.results[0].formatted_address);
            const lat = responseJson.results[0].geometry.location.lat;
          const long = responseJson.results[0].geometry.location.lng;
          getWeather(lat,long);
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