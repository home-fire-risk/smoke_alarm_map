# Hannah Recht, 01-09-16
# Compile a national census tract shapefile
# Download all files from ftp://ftp2.census.gov/geo/tiger/TIGER2013/TRACT/ 
# (On Mac, fastest to cmd-K and enter the ftp address, then drag the files to your machine)

cd original-files

# Unzip all the shapefiles
unzip \*.zip -d shp

# Merge shapefiles and list names in terminal to verify
cd ../
mkdir -p ustracts
for f in original-files/shp/*.shp; 
do ogr2ogr -update -append ustracts/ustracts.shp $f -f "ESRI Shapefile"; 
echo $f;
done;
