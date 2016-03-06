//build choropleth layers in Studio rather than js for speed

var RISKLAYERS = ['east1', 'east2', 'east3', 'east4', 'east5', 'east6', 'south1', 'south2', 'south3', 'south4', 'south5', 'south6', 'midwest1', 'midwest2', 'midwest3', 'midwest4', 'midwest5', 'midwest6', 'west1', 'west2', 'west3', 'west4', 'west5', 'west6', 'counties1', 'counties2', 'counties3', 'counties4', 'counties5', 'counties6'];
var REGIONS = ['east', 'south', 'midwest', 'west']; //regions to add - saved in separate mapbox files due to upload limit
//URLS of regional datasets
var URLS = ['datakinddc.04hkadfo', 'datakinddc.2b90vyhy', 'datakinddc.b0ujw98l', 'datakinddc.cao4jei0'];
mapboxgl.accessToken = 'pk.eyJ1IjoiZGF0YWtpbmRkYyIsImEiOiJjaWppcmZtMHcwMnZ2dHlsdDlzenN0MnRqIn0.FsB8WZ_HKhb3mPa1MPXxdw';

//buttons for riskiest tract views
var topOpts = ["All", 10, 25, 50, 100, 200];

//make the radio buttons dynamically
function makebtns() {

    var labels = d3.select("#statbtns").selectAll("label")
        .data(topOpts)
        .enter()
        .append("label")
        .attr("class", "button")
        .attr("value", function (d) {
            return d;
        })
        .text(function (d) {
            return d;
        })
        .insert("input")
        .attr({
            type: "radio",
            name: "outcome",
            value: function (d) {
                return d;
            }
        });

    //Our default view is all the tracts, so give that button the "selected" class
    d3.select('label[value="All"]')
        .classed("selected", true);
};

function tooltips(layers) {
    map.on("mousemove", function (e) {
        map.featuresAt(e.point, {
            radius: 1,
            layer: layers
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
}

makebtns();

//create map zoomed in to DC
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/datakinddc/cijisuzms004z8wlxb9m6zh0y',
    zoom: 9,
    center: [-77.014576, 38.899396],
    minZoom: 3
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.Navigation());

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
                visibility: 'visible'
            },
            paint: {
                'fill-outline-color': "#ffffff",
                'fill-color': "#b30000",
                'fill-opacity': 0.5
            },
            //no tracts should match
            filter: ['<', "rank", 0]
        });
    }

    tooltips(['east1', 'east2', 'east3', 'east4', 'east5', 'east6', 'south1', 'south2', 'south3', 'south4', 'south5', 'south6', 'midwest1', 'midwest2', 'midwest3', 'midwest4', 'midwest5', 'midwest6', 'west1', 'west2', 'west3', 'west4', 'west5', 'west6', 'counties1', 'counties2', 'counties3', 'counties4', 'counties5', 'counties6', 'easttop', 'southtop', 'midwesttop', 'westtop']);

});

//on clicking the buttons, turn the other layers off and view just the highest ranked N tracts in each region
$('#statbtns input:radio').click(function (e) {

    //remove previous selected classes
    d3.selectAll(".selected")
        .classed("selected", false);

    e.preventDefault();
    e.stopPropagation();

    var selected = $(this).val();

    //apply selected class to selected button
    d3.select('label[value="' + $(this).val() + '"]')
        .classed("selected", true);

    //turn on the main choropleth layers if choosing All
    if (selected == "All") {
        for (i = 1; i < 7; i++) {
            map.setLayoutProperty('counties' + i, 'visibility', 'visible');
            //loop over all regions (tract level)
            for (r = 0; r < REGIONS.length; r++) {
                map.setLayoutProperty(REGIONS[r] + i, 'visibility', 'visible');
            }
        }
        //change filter
        for (r = 0; r < REGIONS.length; r++) {
            map.setFilter(REGIONS[r] + 'top', ['<', "rank", 0]);
        }
    } else {
        //Only show top n tracts otherwise
        var n = parseInt(selected);
        //turn off the main layers
        for (i = 1; i < 7; i++) {
            map.setLayoutProperty('counties' + i, 'visibility', 'none');
            //loop over all regions (tract level)
            for (r = 0; r < REGIONS.length; r++) {
                map.setLayoutProperty(REGIONS[r] + i, 'visibility', 'none');
            }
        }
        //change filter to top n, based on rank attribute in data (ranked within Red Cross regions)
        for (r = 0; r < REGIONS.length; r++) {
            var filtertype = map.getFilter(REGIONS[r] + 'top');
            map.setFilter(REGIONS[r] + 'top', ['<=', "rank", n]);

        }        
    }
});

// Hide areas in groups 1-5 (low risk)
/*document.getElementById('toggle').onclick = function (e) {
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
};*/