# Merge risk scores on to national census tract shapefile, split into 4 regional shapefiles for Mapbox upload
# Hannah Recht, 01-09-16

library(rgdal)
library(dplyr)

########################################################################################################
# Read in data, process, and join to shapefile
########################################################################################################
# State-level identifiers 
states <- read.csv("data/stateinfo.csv", stringsAsFactors = F)
# Read risk in directly from model repo (https://github.com/home-fire-risk/smoke_alarm_models) to get latest data
risk <- read.csv("https://raw.githubusercontent.com/home-fire-risk/smoke_alarm_models/master/aggregate_risk/data/risk_tract.csv", stringsAsFactors = F, colClasses = c("tract_geoid" = "character"))
# National Census tract shapefile - available at https://drive.google.com/folderview?id=0B9WCc5VMDAquajlzSG5QcW5DcDg&usp=drive_web&tid=0Bxt-Sxy6HRaxZzhyeFRkUVRvckE
ustracts <- readOGR("shapefiles/national","ustracts")

# Assign Puerto Rico to the South for shapefile creation
states$division[states$statefip==72] <- 6
states$region[states$statefip==72] <- 2

risk <- left_join(risk, states, by=c("state"="statefip"))

# Select variables needed for shapefile, merge
riskmerge <- risk %>% select(tract_geoid,risk,division)
risktracts <- merge(ustracts, riskmerge, by.x="GEOID", by.y="tract_geoid", all.x=T)

# Remove some unneeded attribute columns
risktracts@data <- risktracts@data[,c("GEOID", "NAME", "division", "risk")]

# Summarize risk score
temp <- risktracts@data
summary(temp$risk)

########################################################################################################
# Write national shapefile and regional shapefiles
# Divide country by census region/division due to Mapbox zipped shapefile upload size limit - 260MB
# Region definitions: http://www2.census.gov/geo/docs/maps-data/maps/reg_div.txt
# East: use northeast region and Puerto Rico and South Atlantic division (otherwise South region is too big to upload)
# To upload to Mapbox: zip files for each region, upload .zip as a replacement of existing
########################################################################################################

# Write national risk tract-level shapefile
writeOGR(risktracts, dsn="shapefiles/riskshp", layer="riskshp", driver="ESRI Shapefile", overwrite_layer = T)

# Define 4 regions by Census division
regions <- list(east = c(1,2,5), midwest = c(3,4), south = c(6,7), west = c(8,9))

# Filter and save regional shapefiles and .zip
regionalShp <- function(region) {
	print(regions[[region]])
	# Make spatial polygons data frame
	shp <- risktracts[(risktracts$division %in% regions[[region]]),]
	# Save to computer
	writeOGR(shp, dsn="shapefiles/riskshp", layer=region, driver="ESRI Shapefile", overwrite_layer = T)
	# Zip files for upload to Mapbox
	regionpath <- paste("shapefiles/riskshp/", region, sep ="")
	zipcmd <- paste("zip -j ", regionpath, ".zip ", regionpath, ".dbf ", regionpath, ".prj ", regionpath, ".shp ", regionpath, ".shx", sep="")
	print(zipcmd)
	system(zipcmd)
	# Return the data frame
	shp <- shp
}
east <- regionalShp("east")
midwest <- regionalShp("midwest")
south <- regionalShp("south")
west <- regionalShp("west")