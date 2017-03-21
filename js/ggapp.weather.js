var coordinates;
var isCelcius = true;

function switchUOM() {
  var tempElem = document.getElementById("temp");
  var temp = tempElem.textContent;

  uomElem = document.getElementById("uom");

  isCelcius = !isCelcius;
  if (isCelcius) {
    temp = (temp - 32) / 9 * 5;
    uomElem.innerHTML = 'C';
  } else {
    temp = temp * 9 / 5 + 32;
    uomElem.innerHTML = 'F';
  }
  tempElem.innerHTML = temp + "°";
}

function getCity(position) {
    coordinates = position;
    $.ajax({
        url: "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude + "," + position.coords.longitude + '&sensor=false',
        success: function(result) {
            var elem = document.getElementById("city");

            if (result.status == "OK") {
                elem.innerHTML = "<h3>" + result.results[1].formatted_address; + "</h3>";
                getWeather();
            } else {
                elem.innerHTML = '<h3 class="text-danger">City not found</h3>';
            }
        }
    });
}

function convertTemp(temp) {
  // temp is in Kelvin
  if (isCelcius) {
    return temp - 273.15;
  } else {
    return (temp - 273.15 + 32) * 9 / 5;
  }
}

function getWeather() {
    $.ajax({
        url: "http://api.openweathermap.org/data/2.5/weather?lat=" + coordinates.coords.latitude + "&lon=" + coordinates.coords.longitude + "&appid=5605b945b93d5ace3a942f7eaccdb538",
        success: function(result) {
            // Tempurature
            var temp = convertTemp(result.main.temp);
            var elem = document.getElementById("temp");
            elem.innerHTML = temp.toFixed(0) + "°";
            elem = document.getElementById("uom");
            elem.innerHTML = "C";

            // Description
            var elem = document.getElementById("description");
            elem.innerHTML = result.weather[0].description;

            // Icon
            var elem = document.getElementById("weather-icon");
            var icon = result.weather[0].icon;
            elem.innerHTML = '<img src="http://openweathermap.org/img/w/' + icon + '.png">';
        }
    });

}

function init() {
  var elem;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getCity);
        elem = document.getElementById("uom");
         $("#uom").on("click", switchUOM);
    } else {
        elem = document.getElementById("description");
        elem.innerHTML = '<p class="text-danger">Geolocation is not supported by this browser.  Sorry no weather. :(';
    }
}


$(document).ready(function() {
    init();
});
