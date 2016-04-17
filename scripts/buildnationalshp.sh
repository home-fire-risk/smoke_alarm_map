# Compile a national census tract shapefile
# First, download zipped state-level files from ftp://ftp2.census.gov/geo/tiger/TIGER2013/TRACT/ - states 1-56 and 72 (Puerto Rico)
# (On Mac, fastest to cmd-K and enter the ftp address, then drag the files to your machine)
# Put .zip files in directory structure: shapefiles/zips/
# Then, script unzips to shapefiles/state-level/ and puts the created national file in shapefiles/tracts/national/ with name ustracts.shp

# Unzip all the shapefiles
mkdir -p shapefiles/state-level
unzip shapefiles/zips/\*.zip -d shapefiles/state-level/

# Merge shapefiles and list names in terminal to verify
mkdir -p shapefiles/national
for f in shapefiles/state-level/*.shp; 
do ogr2ogr -update -append shapefiles/national/ustracts.shp $f -f "ESRI Shapefile"; 
echo $f;
done;
