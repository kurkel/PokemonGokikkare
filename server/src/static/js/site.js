
var layerControl = false

var map = L.map('map', {attributionControl: false}).setView([60.1878901, 24.8330465], 16);

var selected = null;
var select_marker = null;
var sent = null;

var redIcon = L.icon({
    iconUrl: 'static/red-pin.png',
    iconSize:     [38, 38], // size of the icon
    iconAnchor:   [19, 38], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -38]
});


L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia3Vya2VsIiwiYSI6ImNpeGY1YXk1dDAwMDEydHBkcGw1ZjJmNnIifQ.Xt-UgMQXkOxTnldPe8HOPA', {
    maxZoom: 20,
}).addTo(map);
newMarkerGroup = new L.LayerGroup();
map.on('click', addMarker);
getMessages();

function getMessages() {
	$.get('get_messages', function (reply) {
		if (sent) {
			map.removeLayer(sent);
    		layerControl.removeLayer(sent);
		} else {
			sent = L.layerGroup()				
		}

		for(var i in reply) {
			var marker;
			if (reply[i].location) {
				console.log(reply[i].location, reply[i].message)
				if (reply[i].message) {
					l = JSON.parse(reply[i].location)
					marker = L.marker([l.lat, l.lng], {icon:redIcon}).bindPopup(reply[i].message);
				}
				sent.addLayer(marker);
			} else {
				console.log(reply[i].message);				
				$('#messages').append(`<div class="message"><p>${reply[i].message}</p><p class="time">${reply[i].time}</div><hr>`);
			}
		}
		sent.addTo(map);
		if (!layerControl) {
			layerControl=L.control.layers().addTo(map);
		}
		layerControl.addOverlay(sent, "Sent");
	})
}

function cleanSelected() {
	if (selected && layerControl) {
		map.removeLayer(selected);
		layerControl.removeLayer(selected);
	}
	selected = null;
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
	if (select_marker && text) {
		var loc = select_marker._latlng
		var res = {lat:null, lng:null};
		res.lat = loc.lat;
		res.lng = loc.lng;
		payload["location"] = res;
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