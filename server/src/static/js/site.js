
var layerControl = false

var map = L.map('map', {attributionControl: false}).setView([60.1878901, 24.8330465], 16);

var selected = null;
var select_marker = null;
var sent = null;
var locations = null;

var latest_location = null;
var latest_message = null;

var dotIcon = L.icon({
    					iconUrl: 'static/dot.png',
    					iconSize:     [10, 10], // size of the icon
    					iconAnchor:   [5, 5], // point of the icon which will correspond to marker's location
    					popupAnchor:  [0, -10]
					});

L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia3Vya2VsIiwiYSI6ImNpeGY1YXk1dDAwMDEydHBkcGw1ZjJmNnIifQ.Xt-UgMQXkOxTnldPe8HOPA', {
    maxZoom: 20,
}).addTo(map);
newMarkerGroup = new L.LayerGroup();
map.on('click', addMarker);
getMessages();
getLocation();

setInterval(function(){ getMessages(latest_message); }, 15000);
setInterval(function(){ getLocation(latest_location); }, 15000);

function getLocation(time) {
	var url = 'admin/get_location';
	if (time) {
		url = url + '?time=' + time;
	}
	$.get(url, function (reply) {
		if(reply.length > 0) {
			if (locations) {
				map.removeLayer(locations);
	    		layerControl.removeLayer(locations);
			} else {
				locations = L.layerGroup()
			}
			var first = null;
			for(var i in reply) {
				var marker;
				latest_location = (reply[i].time > latest_location || !latest_location) ? reply[i].time : latest_location;
				l = JSON.parse(reply[i].location);
				if(i==="0") {
					marker = L.marker([l.lat, l.lng], {icon:dotIcon});
					first = marker;
				} else {
					marker = L.marker([l.lat, l.lng], {icon:dotIcon});
				}
				marker.bindPopup(reply[i].time);
				locations.addLayer(marker);
			}
			locations.addTo(map);
			if (!layerControl) {
				layerControl=L.control.layers().addTo(map);
			}
			layerControl.addOverlay(locations, "User locations");
			if (first) {
				$('.circle').removeClass('circle')
				L.DomUtil.addClass(first._icon, 'circle');
			}
		}
	});
}

function getMessages(time) {
	var url = 'get_messages'
	if (time) {
		url = url + '?time=' + time;
	}
	$.get(url, function (reply) {
		if(reply.length > 0) {
			if (sent) {
				map.removeLayer(sent);
	    		layerControl.removeLayer(sent);
			} else {
				sent = L.layerGroup()				
			}

			for(var i in reply) {
				var marker;
				latest_message = (reply[i].time > latest_message || !latest_message) ? reply[i].time : latest_message;

				if (reply[i].location) {
					if (reply[i].message) {
						l = JSON.parse(reply[i].location)
						var ic = reply[i].icon || "000";
						ic = ic + '.png';
						var mIcon = L.icon({
	    					iconUrl: 'static/pokemons/'+ic,
	    					iconSize:     [58, 58], // size of the icon
	    					iconAnchor:   [29, 58], // point of the icon which will correspond to marker's location
	    					popupAnchor:  [0, -58]
						});

						marker = L.marker([l.lat, l.lng], {icon:mIcon}).bindPopup(reply[i].message);
					}
					sent.addLayer(marker);
				} else {			
					$('#messages').append(`<div class="message"><p>${reply[i].message}</p><p class="time">${reply[i].time}</div><hr>`);
				}
			}
			sent.addTo(map);
			if (!layerControl) {
				layerControl=L.control.layers().addTo(map);
			}
			layerControl.addOverlay(sent, "Sent");
		}
	})
}

function cleanSelected() {
	if (selected && layerControl) {
		map.removeLayer(selected);
		layerControl.removeLayer(selected);
	}
	selected = null;
	select_marker = null;
}

function addMarker(e){
    // Add marker to map at click location; add popup window
    if (!layerControl) {
    	layerControl = L.control.layers().addTo(map);
    }
    if (selected && layerControl) {
    	cleanSelected();
    }
    var marker = L.marker(e.latlng);
    selected = L.layerGroup().addLayer(marker).addTo(map);
    select_marker = marker;
    layerControl.addOverlay(selected, "Target");

}

function send() {
	var payload = {};
	var text = $("#textbox").val();
	var pokemon = $("#pokemon").val();
	if (select_marker) {
		var loc = select_marker._latlng
		var res = {lat:null, lng:null};
		res.lat = loc.lat;
		res.lng = loc.lng;
		payload["location"] = JSON.stringify(res);
	}
	if(pokemon) {
		payload["pokemon"] = pokemon;
	}
	if (text) {
		payload["message"] = text;
		postMessage(payload);
	} else {
		alert("Add text");
	}
}

function postMessage(data) {
	$.post({
			url: 'admin/location_message',
			data: data
		});
}
