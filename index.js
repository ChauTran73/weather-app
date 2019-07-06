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

  
  function generateChart(hightempdata,lowtempdata,hourdata){
    window.chartColors = {
        red: 'rgb(255, 99, 132)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 205, 86)',
        green: 'rgb(75, 192, 192)',
        blue: 'rgb(54, 162, 235)',
        purple: 'rgb(153, 102, 255)',
        grey: 'rgb(231,233,237)'
      };
    var ctx = document.getElementById("myChart").getContext("2d");
    var myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: hourdata,
            datasets: [
            {
              label: 'High temp',
              borderColor: window.chartColors.blue,
              borderWidth: 2,
              fill: false,
              data: hightempdata
            },
            {
                label: 'Low temp',
                borderColor: window.chartColors.red,
                borderWidth: 2,
                fill: true,
                data: lowtempdata
              },
        ]
        },
        
    })
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
      response.json().then(function(responseJson) {
        var condition = responseJson.currently.summary;
        $("#condition").html(condition);
        var icon = responseJson.currently.icon;
        var skycons = new Skycons({"color": "black"});
        console.log(responseJson)
        skycons.add(document.getElementById("icon"), icon);
        skycons.play();
        var temp = responseJson.currently.temperature;
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
      var dewPoint = responseJson.currently.dewPoint;
      var humidity = responseJson.currently.humidity;
      var windSpeed = responseJson.currently.windSpeed;
      $("div .subinfo").html( "Humidity: "+ Math.round(humidity*100) + "%" + "  " + "Wind Speed: "+ windSpeed + "m/s")

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
    $("form").on("click", "#search",function(e){
        e.preventDefault();
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