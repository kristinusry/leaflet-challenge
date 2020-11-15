// API for All Earthquakes from the Past 7 Days
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Creating map object
var myMap = L.map("mapid", {
    center: [37.7749, -122.4194],
    zoom: 4
});
  
// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);


// Load in the API JSON
d3.json(queryUrl, function(data) {
  
    // Loop through each earthquake
    for (var i = 0; i < data.features.length; i++) {
 
        // Store the magnitude
        earthquakeMag = data.features[i].properties.mag
        earthquakeMag = +earthquakeMag
  
        // Store the coordinates
        cords = data.features[i].geometry.coordinates
        cords[0] = +cords[0];
        cords[1] = +cords[1];
  
        // Store the depth
        depth = data.features[i].geometry.coordinates
        depth[2] = +depth[2];

        // Radius of marker
        markerRadius = markerSize(earthquakeMag)
        markerRaidus = +markerRadius
  
        // Plot the marker
        var circle = L.circle([cords[1], cords[0]], {
            fillOpacity: 0.75,
            radius: markerRadius,
            color: "white",
            fillColor: markerColor(depth[2]),
        })
  
        // Pop up for markers
        circle.bindPopup(
            "<h2>" + data.features[i].properties.title + "</h2>" +
            "<p>" + "Time: " + new Date(data.features[i].properties.time) + "</p>" +
            "<p>" + "Depth: "+ data.features[i].geometry.coordinates[2] + " kilometers</p>"      
        ).addTo(myMap);               
    }
  });

// Function to determine size of marker (based on magnitude)
function markerSize(earthquakeMag) {
    return earthquakeMag * 50000;
}

// Function to determine color of marker (based on depth)
function markerColor(depth) {
    switch (true) {
    case depth >= 90:
        return "#ff5f65";
    case depth >= 70:
        return "#fca35d";
    case depth >= 50:
        return "#fdb72a";
    case depth >= 30:
        return "#f7db11";
    case depth >= 10:
        return "#dcf400";
    default:
        return "#a3f600";
    }
  }