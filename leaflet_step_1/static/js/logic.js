// Retrieve data set vis URL of JSON file
var alleqUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Initialize & Create Two Separate LayerGroups: earthquakes & tectonicPlates
var earthquakes = new L.LayerGroup();

// Perform a GET request to query URL
d3.json(alleqUrl, function(data) {
    // Send data response to data.features function object to the createFeatures function
    createFeatures(data.features);
    console.log(data.features)
});

function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature (Feature, layer) {
        layer.bindPopup("<h3>" + Feature.properties.place 
        +"</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature
    });
    
    // Sending our earthquakes layer to the createMap function
    createImageBitmap(earthquakes);
}

function createMap(earthquakes) {

    // Define variables for tile layers
    var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    }).addTo(mymap);

    // Define baseMaps object to hold our base layers
    var baseMaps = {
        "Satellite": satelliteMap,
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        "earthquakes": earthquakes;
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 5,
        layers: [satelliteMap, earthquakes]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);
    
     // Set Up Legend
     var legend = L.control({ position: "bottomright" });
     legend.onAdd = function() {
         var div = L.DomUtil.create("div", "info legend"), 
         magnitudeLevels = [0, 1, 2, 3, 4, 5];
 
         div.innerHTML += "<h3>Magnitude</h3>"
 
         for (var i = 0; i < magnitudeLevels.length; i++) {
             div.innerHTML +=
                 '<i style="background: ' + chooseColor(magnitudeLevels[i] + 1) + '"></i> ' +
                 magnitudeLevels[i] + (magnitudeLevels[i + 1] ? '&ndash;' + magnitudeLevels[i + 1] + '<br>' : '+');
         }
         return div;
     };
     // Add Legend to the Map
     legend.addTo(myMap);

}
