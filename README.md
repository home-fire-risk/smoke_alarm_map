# American Red Cross Smoke Alarm Map Tool

## Big picture
Goal: help the Red Cross Home Fire Preparedness Campaign target areas for smoke alarm installs. Check out the repo [wiki](https://github.com/home-fire-risk/smoke_alarm_map/wiki) for more background information.
### Sketch of requirements for visualization (working doc)
* [Visualization requirements](https://docs.google.com/document/d/1K8WiLrH4ex72GTG7o_q8MVZE2zGCPyv8voxk1IVYZ2U)
* [model scoping working doc](https://docs.google.com/document/d/1oJN-QwLVqFHOvrRNtW2KEAkNZ-PuFiqTwa8y3iXx1Sg/edit)


## How to contribute
### Skills needed
* DESIGN!: designing the map itself (mainly Mapbox Studio) as well as general UI/UX design for the tool
* General mapping and data visualization skills 
* Front-end development: HTML, CS, JS for general functionality and appearance and [mapbox gl js](https://www.mapbox.com/mapbox-gl-js/api/) for interacting with the map
* General data munging: joining data to shapefiles, clipping and filtering, saving as .zip files, making csv crosswalks, eventually getting and saving Census tract demographic information

### Tasks
We're currently building out our issues list - see [issues](https://github.com/home-fire-risk/smoke_alarm_map/issues) to view tasks that need help. If you'd like to tackle an issue, assign yourself. Please feel free to comment with any questions.
### Mapbox contributions
We're building the map itself in Mapbox Studio and hosting the map data in our Mapbox account. If you have data to add to the map, save shapefiles as a .zip in Google Drive and [Hannah](https://github.com/hrecht) will upload them. If you're interested in designing the map's appearance and have experience with Studio contact us to talk further.
 
### Create and edit shapefiles
To build a national shapefile of census tracts, download the [state-level files](ftp://ftp2.census.gov/geo/tiger/TIGER2013/TRACT/) and then run [buildnationalshp.sh](scripts/buildnationalshp.sh). Note: This requires [gdal](http://www.gdal.org/index.html) installation and assumes you're in a *nix system. The shapefile .zip is saved on [Google Drive](https://drive.google.com/folderview?id=0B9WCc5VMDAquajlzSG5QcW5DcDg&usp=drive_web&tid=0Bxt-Sxy6HRaxZzhyeFRkUVRvckE). The [model results](https://github.com/home-fire-risk/smoke_alarm_models/blob/master/aggregate_risk/data/risk_tract.csv) are merged to the resulting shapefile and split into regional files with [mergedatashp.R](scripts/mergedatashp.R)
* Red Cross shapefiles and boundary definitions [source](http://maps.redcross.org/website/Services/ARC_Services.html)
 * [Chapter boundaries shapefile .zip](http://maps.redcross.org/website/Services/Data/RC_All.zip)
 * [Region boundaries shapefile .zip](http://maps.redcross.org/website/Services/Data/RC_All_REG.zip)

For conversations/questions that are awkward to carry out using GitHub issues, send an email to DataKind Red Cross core volunteers Hannah Recht (hrecht2@gmail.com) and Andrew Brooks (andrewbrooksct@gmail.com) and one of us will follow up with you.

* Other tested options:
 * [esri-leaflet-test.html](esri-leaflet-test.html) - quick test of the [esri-leaflet](https://github.com/Esri/esri-leaflet) plugin using Red Cross ArcGIS Online division, region, and chapter boundary feature layers, plus HFPC home visits. Esri layers are stored as geojson, not tiles, would need to be tiled or significantly simplified to be fast enough, or use local json instead.

**Note:** This is the current viz repo which was formerly [here](https://github.com/brooksandrew/arc_smoke_alarm).
