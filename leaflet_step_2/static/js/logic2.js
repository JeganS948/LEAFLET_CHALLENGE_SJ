// Retrieve data set vis URL of JSON file
var alleqUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var tectonicPlates = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

// Initialize & Create Two Separate LayerGroups: earthquakes & tectonicPlates
var earthquakes = new L.LayerGroup();
var tectonicPlates = new L.LayerGroup();

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

    // Function to Determine Size of Marker Based on the Magnitude of the Earthquake
    function markerSize(magnitude) {
        if (magnitude === 0) {
          return 1;
        }
        return magnitude * 3;
    }

    // Function to Determine Style of Marker Based on the Magnitude of the Earthquake
    function styleInfo(feature) {
        return {
          opacity: 1,
          fillOpacity: 1,
          fillColor: chooseColor(feature.properties.mag),
          color: "#000000",
          radius: markerSize(feature.properties.mag),
          stroke: true,
          weight: 0.5
        };
    }

    // Define function to set the circle color based on the magnitude
    function circleColor(magnitude) {
        if (magnitude < 1) {
        return "#ccff33"
        }
        else if (magnitude < 2) {
        return "#ffff33"
        }
        else if (magnitude < 3) {
        return "#ffcc33"
        }
        else if (magnitude < 4) {
        return "#ff9933"
        }
        else if (magnitude < 5) {
        return "#ff6633"
        }
        else {
        return "#ff3333"
        }
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
    var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });

    var grayscaleMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });
    
    var outdoorsMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.outdoors",
        accessToken: API_KEY
    });

    // Define baseMaps object to hold our base layers
    var baseMaps = {
        "Satellite": satelliteMap,
        "Grayscale": grayscaleMap,
        "Outdoors": outdoorsMap
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        "earthquakes": earthquakes,
        "tectonicPlates": tectonicPlates
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

    // Create the faultlines and add them to the faultline layer
    d3.json(faultlinequery, function(data) {
        L.geoJSON(data, {
        style: function() {
            return {color: "orange", fillOpacity: 0}
        }
        }).addTo(faultLine)
    })

    // color function to be used when creating the legend
    function getColor(d) {
        return d > 5 ? '#ff3333' :
            d > 4  ? '#ff6633' :
            d > 3  ? '#ff9933' :
            d > 2  ? '#ffcc33' :
            d > 1  ? '#ffff33' :
                        '#ccff33';
    }
    
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
