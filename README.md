# American Red Cross Smoke Alarm Map Tool

## Big picture
Goal: help the Red Cross Home Fire Preparedness Campaign target areas for smoke alarm installs. Read more about the models in the [documentation](https://docs.google.com/document/d/1oJN-QwLVqFHOvrRNtW2KEAkNZ-PuFiqTwa8y3iXx1Sg/edit?pref=2&pli=1). Check out the repo [wiki](https://github.com/home-fire-risk/smoke_alarm_map/wiki) for more resources.
### Sketch of requirements for visualization (working doc)
* [Visualization requirements](https://docs.google.com/document/d/1K8WiLrH4ex72GTG7o_q8MVZE2zGCPyv8voxk1IVYZ2U)
* Current build of map: http://home-fire-risk.github.io/smoke_alarm_map/  

## How to contribute
Join the [DataKind DC meetup group](http://www.meetup.com/DataKind-DC/) to find out about work sessions. Or, contribute whenever you can.
### Skills needed
* DESIGN!: designing the map itself (mainly Mapbox Studio) as well as general UI/UX design for the tool
* General mapping and data visualization skills 
* Front-end development: HTML, CS, JS for general functionality and appearance and [mapbox gl js](https://www.mapbox.com/mapbox-gl-js/api/) for interacting with the map
* General data munging: joining data to shapefiles, clipping and filtering, saving as .zip files, making csv crosswalks, eventually getting and saving Census tract demographic information

### Tasks
See [issues](https://github.com/home-fire-risk/smoke_alarm_map/issues) to view tasks that need help. Please feel free to comment with any questions.
### Mapbox contributions
We're building the map itself in Mapbox Studio and hosting the map data in our Mapbox account. If you have data to add to the map, save shapefiles as a .zip in Google Drive and [Hannah](https://github.com/hrecht) will upload them. If you're interested in designing the map's appearance and have experience with Studio contact us to talk further.
 
### Create and edit shapefiles
To build a national shapefile of census tracts, download the [state-level files](ftp://ftp2.census.gov/geo/tiger/TIGER2013/TRACT/) and then run [buildnationalshp.sh](scripts/buildnationalshp.sh). Note: This requires [gdal](http://www.gdal.org/index.html) installation and assumes you're in a *nix system. The shapefile .zip is saved on [Google Drive](https://drive.google.com/folderview?id=0B9WCc5VMDAquajlzSG5QcW5DcDg&usp=drive_web&tid=0Bxt-Sxy6HRaxZzhyeFRkUVRvckE). The [model results](https://github.com/home-fire-risk/smoke_alarm_models/blob/master/aggregate_risk/data/risk_tract.csv) are merged to the resulting shapefile and split into regional files with [mergedatashp.R](scripts/mergedatashp.R)
* Red Cross shapefiles and boundary definitions [source](http://maps.redcross.org/website/Services/ARC_Services.html)
 * [Chapter boundaries shapefile .zip](http://maps.redcross.org/website/Services/Data/RC_All.zip)
 * [Region boundaries shapefile .zip](http://maps.redcross.org/website/Services/Data/RC_All_REG.zip)

For conversations/questions that are awkward to carry out using GitHub issues, send an email to DataKind Red Cross core volunteers Hannah Recht (hrecht2@gmail.com) and Andrew Brooks (andrewbrooksct@gmail.com) and one of us will follow up with you.
