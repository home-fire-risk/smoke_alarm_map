# Update smoke alarm shapefiles on Mapbox

cd shapefiles/riskshp/
echo replacing counties
mapbox-upload datakinddc.7c89g6hm counties.zip
echo replacing east
mapbox-upload datakinddc.04hkadfo east.zip
echo replacing south
mapbox-upload datakinddc.2b90vyhy south.zip
echo replacing midwest
mapbox-upload datakinddc.b0ujw98l midwest.zip
echo replacing west
mapbox-upload datakinddc.cao4jei0 west.zip