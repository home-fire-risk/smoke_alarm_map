//build choropleth layers in Studio rather than js for speed

var RISKLAYERS = ['east1', 'east2', 'east3', 'east4', 'east5', 'east6', 'south1', 'south2', 'south3', 'south4', 'south5', 'south6', 'midwest1', 'midwest2', 'midwest3', 'midwest4', 'midwest5', 'midwest6', 'west1', 'west2', 'west3', 'west4', 'west5', 'west6', 'counties1', 'counties2', 'counties3', 'counties4', 'counties5', 'counties6'];
var REGIONS = ['east', 'south', 'midwest', 'west']; //regions to add - saved in separate mapbox files due to upload limit
//URLS of regional datasets
var URLS = ['datakinddc.04hkadfo', 'datakinddc.2b90vyhy', 'datakinddc.b0ujw98l', 'datakinddc.cao4jei0'];
mapboxgl.accessToken = 'pk.eyJ1IjoiZGF0YWtpbmRkYyIsImEiOiJjaWppcmZtMHcwMnZ2dHlsdDlzenN0MnRqIn0.FsB8WZ_HKhb3mPa1MPXxdw';

//create map zoomed in to DC
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/datakinddc/cijisuzms004z8wlxb9m6zh0y',
    zoom: 9,
    center: [-77.014576, 38.899396],
    minZoom: 3
});

map.on('style.load', function () {
    //add layers for top rank filtering
    for (r = 0; r < REGIONS.length; r++) {
        map.addSource(REGIONS[r] + 'src', {
            type: 'vector',
            url: 'mapbox://' + URLS[r]
        });
        //add a border layer to be used on hover
        map.addLayer({
            id: REGIONS[r] + 'top',
            type: 'fill',
            source: REGIONS[r] + 'src',
            'source-layer': REGIONS[r],
            layout: {
                visibility: 'none'
            },
            paint: {
                'fill-outline-color': "#ffffff",
                'fill-color': "#000000",
                'fill-opacity': 0.5
            },
            filter: ['<=', "rank", 50]
        });
    }

    map.on("mousemove", function (e) {
        map.featuresAt(e.point, {
            radius: 1,
            layer: ['east1', 'east2', 'east3', 'east4', 'east5', 'east6', 'south1', 'south2', 'south3', 'south4', 'south5', 'south6', 'midwest1', 'midwest2', 'midwest3', 'midwest4', 'midwest5', 'midwest6', 'west1', 'west2', 'west3', 'west4', 'west5', 'west6', 'counties1', 'counties2', 'counties3', 'counties4', 'counties5', 'counties6', 'easttop', 'southtop', 'midwesttop', 'westtop']
        }, function (err, features) {
            if (!err && features.length) {
                //show name and value in sidebar
                document.getElementById('tooltip-risk').innerHTML = Math.round(features[0].properties.risk);
                document.getElementById('tooltip-rank').innerHTML = features[0].properties.rank + "/" + features[0].properties.rankn;
                document.getElementById('tooltip-households').innerHTML = d3.format(",d")(features[0].properties.hoshlds);
                document.getElementById('tooltip-income').innerHTML = d3.format("$,d")(features[0].properties.mdnnc_h);
                if (features[0].properties.NAME != undefined) {
                    document.getElementById('tooltip-tract').innerHTML = "Tract " + features[0].properties.NAME;
                }
                document.getElementById('tooltip-name').innerHTML = features[0].properties.county + "<br />" + features[0].properties.chapter;

                //for troubleshooting - show complete features info
                //document.getElementById('tooltip-name').innerHTML = JSON.stringify(features, null, 2);
            } else {
                //if not hovering over a feature set tooltip to empty
                document.getElementById('tooltip-risk').innerHTML = "";
                document.getElementById('tooltip-rank').innerHTML = "";
                document.getElementById('tooltip-households').innerHTML = "";
                document.getElementById('tooltip-income').innerHTML = "";
                document.getElementById('tooltip-tract').innerHTML = "";
                document.getElementById('tooltip-name').innerHTML = "";
            }
        });
    });
});

// Hide areas in groups 1-5 (low risk)
document.getElementById('toggle').onclick = function (e) {
    e.preventDefault();
    e.stopPropagation();
    //loop over risk groups 1-5
    for (i = 1; i < 6; i++) {
        var visibility = map.getLayoutProperty('counties' + i, 'visibility');
        if (visibility === 'visible') {
            map.setLayoutProperty('counties' + i, 'visibility', 'none');
            this.className = '';
        } else {
            this.className = 'active';
            map.setLayoutProperty('counties' + i, 'visibility', 'visible');
        }
        //loop over all regions (tract level)
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



// show top N tracts in region
document.getElementById('toptracts').onclick = function (e) {
    e.preventDefault();
    e.stopPropagation();
    //turn off existing layers
    for (i = 1; i < 7; i++) {
        var visibility = map.getLayoutProperty('counties' + i, 'visibility');
        if (visibility === 'visible') {
            map.setLayoutProperty('counties' + i, 'visibility', 'none');
            this.className = '';
        } else {
            this.className = 'active';
            map.setLayoutProperty('counties' + i, 'visibility', 'visible');
        }
        //loop over all regions (tract level)
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
    //add a source for each region
    for (r = 0; r < REGIONS.length; r++) {
        var visibility = map.getLayoutProperty(REGIONS[r] + 'top', 'visibility');

        if (visibility === 'visible') {
            map.setLayoutProperty(REGIONS[r] + 'top', 'visibility', 'none');
            this.className = '';
        } else {
            this.className = 'active';
            map.setLayoutProperty(REGIONS[r] + 'top', 'visibility', 'visible');
        }
    }
};



// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.Navigation());