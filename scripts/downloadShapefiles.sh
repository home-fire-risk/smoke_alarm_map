# Download shapefile .zips needed for map

if [ ! -d shapefiles ]; then
  mkdir shapefiles
fi

# Directory for files that will be joined with data in scripts/mergedatashp.R
if [ ! -d shapefiles/riskshp ]; then
  mkdir shapefiles/riskshp
fi

# Red Cross region boundaries
# This doesn't get altered, no need to unzip, uploaded to Mapbox as is
echo downloading Red Cross regions
curl -o shapefiles/RC_Regions.zip http://maps.redcross.org/website/Services/Data/RC_All_REG.zip

# Census county cartographic boundary shapefile
# Note: these are clipped to water boundaries, great for visualizing at far scale, but bad for analysis or small scale
# We'll use this for the far zoom county layer
if [ ! -d shapefiles/cb_2014_us_county_500k/ ]; then
  mkdir shapefiles/cb_2014_us_county_500k/
fi
echo downloading counties
curl -o shapefiles/cb_2014_us_county_500k.zip http://www2.census.gov/geo/tiger/GENZ2014/shp/cb_2014_us_county_500k.zip
unzip shapefiles/cb_2014_us_county_500k.zip -d shapefiles/cb_2014_us_county_500k/

# Census tract boundaries for main map layers
# Built from Tiger/line state-level tract files in scripts/buildnationalshp.sh
# Clipped to water boundaries for better viz in https://github.com/home-fire-risk/smoke_alarm_map/issues/7

# Download (365 MB) https://drive.google.com/open?id=0B9WCc5VMDAquLW5QOVV1Y2JmMzQ and save in shapefiles/
if [ ! -d shapefiles/ustracts_clipped/ ]; then
  mkdir shapefiles/ustracts_clipped/
fi
echo unzipping tracts
unzip shapefiles/ustracts_clipped.zip -d shapefiles/ustracts_clipped/