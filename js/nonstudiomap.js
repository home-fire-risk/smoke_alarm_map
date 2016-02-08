//customize your choropleth
var URLS = ['mapbox://datakinddc.04hkadfo', 'mapbox://datakinddc.2b90vyhy', 'mapbox://datakinddc.b0ujw98l', 'mapbox://datakinddc.cao4jei0'],
    METRIC = 'risk', //shapefile attribute to map - in this case, land area of census tract
    COLORS = ['#fef0d9', '#fdd49e', '#fdbb84', '#fc8d59', '#e34a33', '#b30000'], //colors to use in choropleth
    BREAKS = [0, 30, 40, 50, 60, 70], //breaks to use
    REGIONS = ['east', 'south', 'midwest', 'west'], //regions to add - saved in separate mapbox files due to upload limit
    FILTERUSE;

mapboxgl.accessToken = 'pk.eyJ1IjoiZGF0YWtpbmRkYyIsImEiOiJjaWppcmZtMHcwMnZ2dHlsdDlzenN0MnRqIn0.FsB8WZ_HKhb3mPa1MPXxdw';
//create a map using the Mapbox Light theme, zoomed in to DC
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v8',
    zoom: 10,
    center: [-77.014576, 38.899396]
});

map.on('style.load', function () {
    //add a source for each region
    for (r = 0; r < REGIONS.length; r++) {
        map.addSource(REGIONS[r] + 'src', {
            type: 'vector',
            url: URLS[r]
        });
        //add a choropleth layer for each source
        for (i = 0; i < COLORS.length; i++) {
            if (i < COLORS.length - 1) {
                // BREAK[i] <= METRIC < BREAK[i+1]
                FILTERUSE = ['all', ['>=', METRIC, BREAKS[i]], ['<', METRIC, BREAKS[i + 1]]];
            } else {
                //for last layer, METRIC >= BREAK[i]
                FILTERUSE = ['>=', METRIC, BREAKS[i]];
            }
            map.addLayer({
                id: REGIONS[r] + i,
                type: 'fill',
                source: REGIONS[r] + 'src',
                interactive: true,
                'source-layer': REGIONS[r],
                layout: {
                    visibility: 'visible'
                },
                filter: FILTERUSE,
                paint: {
                    //'fill-outline-color': "#ffffff",
                    'fill-color': COLORS[i],
                    'fill-opacity': 0.5
                }
            });
        }
        //add a border layer to be used on hover
        map.addLayer({
            id: REGIONS[r] + 'hover',
            type: 'line',
            source: REGIONS[r] + 'src',
            'source-layer': REGIONS[r],
            layout: {
                visibility: 'visible'
            },
            paint: {
                'line-color': '#000000',
                'line-width': 2
            },
            filter: ['==', 'GEOID', '']
        });
    }
});

//on hover, use the properties of the features below the mouse to update sidebar tooltip and hover
map.on("mousemove", function (e) {
    map.featuresAt(e.point, {
        radius: 5
            //layers: 'NAMES'
    }, function (err, features) {
        if (!err && features.length) {
            //show name and value in sidebar
            document.getElementById('tooltip').innerHTML = "Tract: " + features[0].properties.GEOID + "<br />Risk: " + Math.round(features[0].properties.risk);
            //show the border on hover
            for (r = 0; r < REGIONS.length; r++) {
                map.setFilter(REGIONS[r] + 'hover', ["==", "GEOID", features[0].properties.GEOID]);
            }
        } else {
            //if not hovering over a feature, remove hover border and set tooltip to empty
            document.getElementById('tooltip').innerHTML = "";
            for (r = 0; r < REGIONS.length; r++) {
                map.setFilter(REGIONS[r] + 'hover', ["==", "GEOID", ""]);
            }
        }
    });
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.Navigation());