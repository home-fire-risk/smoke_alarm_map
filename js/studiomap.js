//build choropleth layers in Studio rather than js for speed

var RISKLAYERS = ['east1', 'east2', 'east3', 'east4', 'east5', 'east6', 'south1', 'south2', 'south3', 'south4', 'south5', 'south6', 'midwest1', 'midwest2', 'midwest3', 'midwest4', 'midwest5', 'midwest6', 'west1', 'west2', 'west3', 'west4', 'west5', 'west6', 'counties1', 'counties2', 'counties3', 'counties4', 'counties5', 'counties6'];
//URLS = ['mapbox://datakinddc.04hkadfo', 'mapbox://datakinddc.2b90vyhy', 'mapbox://datakinddc.b0ujw98l', 'mapbox://datakinddc.cao4jei0'],
REGIONS = ['east', 'south', 'midwest', 'west']; //regions to add - saved in separate mapbox files due to upload limit

mapboxgl.accessToken = 'pk.eyJ1IjoiZGF0YWtpbmRkYyIsImEiOiJjaWppcmZtMHcwMnZ2dHlsdDlzenN0MnRqIn0.FsB8WZ_HKhb3mPa1MPXxdw';

//create a map using the Mapbox Light theme, zoomed in to DC
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/datakinddc/cijisuzms004z8wlxb9m6zh0y',
    zoom: 9,
    center: [-77.014576, 38.899396],
    minZoom: 3
});

//names of risk layers

map.on('style.load', function () {
    //add a source for each region
    /*    for (r = 0; r < REGIONS.length; r++) {
            map.addSource(REGIONS[r] + 'src', {
                type: 'vector',
                url: URLS[r]
            });
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
        }*/

    map.on("mousemove", function (e) {
        map.featuresAt(e.point, {
            radius: 1,
            layer: RISKLAYERS
        }, function (err, features) {
            if (!err && features.length) {
                //show name and value in sidebar
                document.getElementById('tooltip').innerHTML = ("Risk: " + Math.round(features[0].properties.risk) + "<br />" + features[0].properties.county + "<br />" + features[0].properties.chapter);
                //for troubleshooting - show complete features info
                //document.getElementById('tooltip').innerHTML = JSON.stringify(features, null, 2);
                //show the border on hover
                /*                for (r = 0; r < REGIONS.length; r++) {
                                    map.setFilter(REGIONS[r] + 'hover', ["==", "GEOID", features[0].properties.GEOID]);
                                }*/
            } else {
                //if not hovering over a feature, remove hover border and set tooltip to empty
                document.getElementById('tooltip').innerHTML = "";
                /*                for (r = 0; r < REGIONS.length; r++) {
                                    map.setFilter(REGIONS[r] + 'hover', ["==", "GEOID", ""]);
                                }*/
            }
        });
    });
});

// Hide areas in groups 1-5 (low risk)
document.getElementById('toggle').onclick = function (e) {
    e.preventDefault();
    e.stopPropagation();
    for (i = 1; i < 6; i++) {
        var visibility = map.getLayoutProperty('counties' + i, 'visibility');
        if (visibility === 'visible') {
            map.setLayoutProperty('counties' + i, 'visibility', 'none');
            this.className = '';
        } else {
            this.className = 'active';
            map.setLayoutProperty('counties' + i, 'visibility', 'visible');
        }
        for (r = 0; r < REGIONS.length; r++) {
            var visibility = map.getLayoutProperty(REGIONS[r] + i, 'visibility');
            if (visibility === 'visible') {
                map.setLayoutProperty(REGIONS[r] + i, 'visibility', 'none');
                this.className = '';
            } else {
                this.className = 'active';
                map.setLayoutProperty(REGIONS[r] + i, 'visibility', 'visible');
            }
        }
    }
};

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.Navigation());