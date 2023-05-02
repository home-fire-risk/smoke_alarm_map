# American Red Cross Smoke Alarm Map Tool
[View current build](https://home-fire-risk.github.io/smoke_alarm_map/)

## NOTE
This project is no longer under active development. See [In the Spirit of Continuous Improvement: Revisiting the American Red Cross Fire Risk Map ](https://www.datakind.org/blog/in-the-spirit-of-continuous-improvement-revisiting-the-american-red-cross-fire-risk-map) for information about the 2020 update.

## Big picture
This is the front-end of an open-source project maintained by [DataKind DC](http://www.datakind.org/chapters/datakind-dc) in partnership with the [Red Cross Home Fire Preparedness Campaign](http://www.redcross.org/home-fire-lp2). See the [modeling repo](https://github.com/home-fire-risk/smoke_alarm_models) for more information on the data used here. This web tool presents risk scores at the Census tract level in an interactive map and table for download to help Red Cross employees and volunteers target areas for smoke alarm installs.

Read more about the models in the [documentation](https://docs.google.com/document/d/1oJN-QwLVqFHOvrRNtW2KEAkNZ-PuFiqTwa8y3iXx1Sg/edit?pref=2&pli=1).

### Tasks
See [issues](https://github.com/home-fire-risk/smoke_alarm_map/issues) to view tasks that need help. Please feel free to comment with any questions.

## How to contribute
Interested in helping? Issues or pull requests are welcome! See below for email addresses to message us directly. Join the [DataKind DC meetup group](http://www.meetup.com/DataKind-DC/) to find out about work sessions and new projects.

### Skills needed
* DESIGN!: designing the map itself (mainly Mapbox Studio) as well as general UI/UX design for the tool
* General mapping and data visualization skills 
* Front-end development: HTML, CS, JS for general functionality and appearance and [mapbox gl js](https://www.mapbox.com/mapbox-gl-js/api/) for interacting with the map
* General data munging: joining data to shapefiles, clipping and filtering, saving as .zip files, making csv crosswalks, eventually getting and saving Census tract demographic information
 
## Map files setup and update
### Download shapefiles
* Shapefiles are saved in the shapefiles/ directory, which is gitignored due to size
* Download [national tract-level shapefile, clipped to water boundaries](https://drive.google.com/folderview?id=0B9WCc5VMDAquajlzSG5QcW5DcDg&usp=drive_web&tid=0Bxt-Sxy6HRaxZzhyeFRkUVRvckE) and save .zip in shapefiles/ directory
* Then, run [scripts/downloadShapefiles.sh](scripts/downloadShapefiles.sh) to set up the directory, download Red Cross regions, counties, and unzip shapefiles as needed
```bash
$ bash scripts/downloadShapefiles.sh
```
* More Red Cross shapefiles and boundary definitions [source](http://maps.redcross.org/website/Services/ARC_Services.html)

### Getting and updating data
* Run [scripts/retrieveCensus.R](scripts/retrieveCensus.R) to download Census county & tract-level data from the [American Community Survey API](http://www.census.gov/data/developers/data-sets/acs-survey-5-year-data.html)
* Run [scripts/mergedatashp.R](scripts/mergedatashp.R) to read latest risk scores directly from [the modeling repo](https://raw.githubusercontent.com/home-fire-risk/smoke_alarm_models/master/aggregate_risk/data/risk_tract.csv), format, join to ACS data and shapefiles, and export new shapefiles & .zips
* Replace files in Mapbox using the Mapbox [upload library](https://github.com/mapbox/mapbox-upload) CLI - this requires you to have a secret auth token with upload access
```bash
$ npm install --global mapbox-upload
$ bash scripts/updateMapbox.sh
```
 * Alternatively, you can update the files from the Mapbox website by manually replacing them

