// Retrieve data set as a URL of JSON file
var alleqUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Initialize & Create Two Separate LayerGroups: earthquakes & tectonicPlates
var earthquakes = new L.LayerGroup();

// Perform a GET request to query URL
d3.json(alleqUrl, function(data) {
    // Send data response to data.features function object to the createFeatures function
    //createFeatures(data.features);
    console.log(data.features)
});

// Create Map
// Define variables for tile layers
var grayscaleMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/light-v10",
    accessToken: API_KEY
});

// Define baseMaps object to hold our base layers
var baseMaps = {
    "Grayscale": grayscaleMap
};

// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("mapid", {
    center: [
        37.09, -95.71
    ],
    zoom: 5,
    layers: [grayscaleMap]
});