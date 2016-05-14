# American Red Cross Smoke Alarm Map Tool

## Big picture
Goal: help the Red Cross Home Fire Preparedness Campaign target areas for smoke alarm installs. Read more about the models in the [documentation](https://docs.google.com/document/d/1oJN-QwLVqFHOvrRNtW2KEAkNZ-PuFiqTwa8y3iXx1Sg/edit?pref=2&pli=1). Check out the repo [wiki](https://github.com/home-fire-risk/smoke_alarm_map/wiki) for more resources.
### Sketch of requirements for visualization (working doc)
* [Visualization requirements](https://docs.google.com/document/d/1K8WiLrH4ex72GTG7o_q8MVZE2zGCPyv8voxk1IVYZ2U)
* Current build of map: http://home-fire-risk.github.io/smoke_alarm_map/  


### Tasks
See [issues](https://github.com/home-fire-risk/smoke_alarm_map/issues) to view tasks that need help. Please feel free to comment with any questions.

## How to contribute
Join the [DataKind DC meetup group](http://www.meetup.com/DataKind-DC/) to find out about work sessions. Or, contribute whenever you can.
### Skills needed
* DESIGN!: designing the map itself (mainly Mapbox Studio) as well as general UI/UX design for the tool
* General mapping and data visualization skills 
* Front-end development: HTML, CS, JS for general functionality and appearance and [mapbox gl js](https://www.mapbox.com/mapbox-gl-js/api/) for interacting with the map
* General data munging: joining data to shapefiles, clipping and filtering, saving as .zip files, making csv crosswalks, eventually getting and saving Census tract demographic information
 
### Download shapefiles
* Shapefiles are saved in the shapefiles/ directory, which is gitignored due to size
* Download [national tract-level shapefile, clipped to water boundaries](https://drive.google.com/folderview?id=0B9WCc5VMDAquajlzSG5QcW5DcDg&usp=drive_web&tid=0Bxt-Sxy6HRaxZzhyeFRkUVRvckE) and save .zip in shapefiles/ directory
* Run [scripts/downloadShapefiles.sh](scripts/downloadShapefiles.sh) to set up the directory, download Red Cross regions, counties, and unzip shapefiles as needed
* More Red Cross shapefiles and boundary definitions [source](http://maps.redcross.org/website/Services/ARC_Services.html)

### Getting and updating data
* ACS data is obtained from the Census API in [scripts/retrieveCensus.R](scripts/retrieveCensus.R)
* Run [scripts/mergedatashp.R](scripts/mergedatashp.R) to read latest risk scores directly from [the modeling repo](https://raw.githubusercontent.com/home-fire-risk/smoke_alarm_models/master/aggregate_risk/data/risk_tract.csv), format, join to ACS data and shapefiles, and export new shapefiles & .zips
* Replace files in Mapbox using the Mapbox [upload library](https://github.com/mapbox/mapbox-upload) CLI - this requires you to have a secret auth token with upload access
```bash
$ npm install --global mapbox-upload
$ bash scripts/updateMapbox.sh
```
* Alternatively, you can update the files from the Mapbox website by manually replacing them


For conversations/questions that are awkward to carry out using GitHub issues, send an email to DataKind Red Cross core volunteers Hannah Recht (hrecht2@gmail.com) and Andrew Brooks (andrewbrooksct@gmail.com) and one of us will follow up with you.
