# American Red Cross Smoke Alarm Project

### Big picture
Help Red Cross Home Fire Preparedness Campaign target areas for smoke alarm installs.  Check out the repo [wiki](https://github.com/home-fire-risk/smoke_alarm_map/wiki) for more background information.

### Sketch of requirements for visualization (working doc)
* [Visualization requirements](https://docs.google.com/document/d/1K8WiLrH4ex72GTG7o_q8MVZE2zGCPyv8voxk1IVYZ2U)

**Note:** the structure of this repo was simply initalized as it is now.  Improvements and structural enhancements/shifts as the project progresses are welcomed!

**Note:** This is the current viz repo which was formerly [here](https://github.com/brooksandrew/arc_smoke_alarm).

[model scoping working doc]: https://docs.google.com/document/d/1oJN-QwLVqFHOvrRNtW2KEAkNZ-PuFiqTwa8y3iXx1Sg/edit

### Visualizations
* [index.html](index.html) - GL map built on [mapbox gl js](https://www.mapbox.com/mapbox-gl-js/api/)

* [simplemap.html](simplemap.html) - incredibly simple map of risk scores by tract built with Tilemill and [mapbox.js](https://www.mapbox.com/mapbox.js/api/v2.2.3/). For fast tile export/development purposes, currently showing the lower 48 states up to zoom level 11.

* [esri-leaflet-test.html](esri-leaflet-test.html) - quick test of the [esri-leaflet](https://github.com/Esri/esri-leaflet) plugin using Red Cross ArcGIS Online division, region, and chapter boundary feature layers, plus HFPC home visits. Esri layers are stored as geojson, not tiles, would need to be tiled or significantly simplified to be fast enough, or use local json instead.

### Census tract shapefile
To build a national shapefile of census tracts, download the [state-level files](ftp://ftp2.census.gov/geo/tiger/TIGER2013/TRACT/) and then run [buildnationalshp.sh](censustracts/buildnationalshp.sh). Note: This requires [gdal](http://www.gdal.org/index.html) installation and assumes you're in a *nix system. Resulting shapefile is not saved here due to size.

For conversations/questions that are awkward to carry out using GitHub issues, send an email to DataKind Red Cross core volunteers Hannah Recht (hrecht2@gmail.com) and Andrew Brooks (andrewbrooksct@gmail.com) and one of us will follow up with you.
