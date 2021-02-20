// Retrieve data set vis URL of JSON file
var alleqUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

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
    var eq = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature
    });
    
    // Sending our earthquakes layer to the createMap function
    createImageBitmap(eq);
}

function createMap(eq) {

    // Define variables for tile layers
    var satelliteMap

    var greyscaleMap

    var outdoorMap  
}
