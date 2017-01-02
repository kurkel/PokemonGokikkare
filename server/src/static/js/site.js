
var map = L.map('map').setView([60.1878901, 24.8330465], 16);

L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia3Vya2VsIiwiYSI6ImNpeGY1YXk1dDAwMDEydHBkcGw1ZjJmNnIifQ.Xt-UgMQXkOxTnldPe8HOPA', {
    maxZoom: 20,
}).addTo(map);