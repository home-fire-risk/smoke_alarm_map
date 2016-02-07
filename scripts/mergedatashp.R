# Merge risk scores on to national census tract shapefile, split into 4 regional shapefiles for Mapbox upload
# Hannah Recht, 01-09-16

library(rgdal)
library(dplyr)

# State-level identifiers 
states <- read.csv("data/stateinfo.csv", stringsAsFactors = F)
# Read risk in directly from model repo (https://github.com/home-fire-risk/smoke_alarm_models) to get latest data
risk <- read.csv("https://raw.githubusercontent.com/home-fire-risk/smoke_alarm_models/master/aggregate_risk/data/risk_tract.csv", stringsAsFactors = F, colClasses = c("tract_geoid" = "character", "state" = "character","cnty" = "character","tract" = "character"))

# National Census tract shapefile - available at https://drive.google.com/folderview?id=0B9WCc5VMDAquajlzSG5QcW5DcDg&usp=drive_web&tid=0Bxt-Sxy6HRaxZzhyeFRkUVRvckE
tracts <- readOGR("shapefiles/national","ustracts")

# National counties shapefile
download.file("http://www2.census.gov/geo/tiger/GENZ2014/shp/cb_2014_us_county_500k.zip", "shapefiles/cb_2014_us_county_500k.zip")
unzip("shapefiles/cb_2014_us_county_500k.zip", exdir="shapefiles/cb_2014_us_county_500k/")
counties <- readOGR("shapefiles/cb_2014_us_county_500k/","cb_2014_us_county_500k")

# Help choose color breaks - do approx quantiles for now
quantile(risk$risk, c(1/6, 2/6, 3/6, 4/6, 5/6))
# 02-07-16 breaks: 34, 38, 41, 43, 46

########################################################################################################
# Make counties dataset and save merged shapefile .zip
########################################################################################################

# Select variables needed for shapefile, merge, rename for .shp colname limit
riskc <- risk %>% filter(!is.na(state)) %>%
	mutate(fips_county = paste(state, cnty, sep="")) %>%
	group_by(fips_county, county_name_long, chapter_name, region_name) %>%
	summarize(risk = mean(risk_cnty)) %>%
	rename(chapter = chapter_name, region = region_name, county = county_name_long)
# ogr2ogr does not like the extra attributes created in group_by & summarize functions
riskc <- as.data.frame(riskc)
summary(riskc$risk)
head(counties@data)

riskcounties <- merge(counties, riskc, by.x="GEOID", by.y="fips_county", all.x=T)
# Remove some unneeded attribute columns
head(riskcounties@data)
riskcounties@data <- riskcounties@data[,c("GEOID", "risk", "county", "chapter", "region")]

########################################################################################################
# Make tracts dataset for merge
########################################################################################################

# Assign Puerto Rico to the South for shapefile creation
states$statefip <- sprintf("%02s", states$statefip)
states$division[states$statefip==72] <- 6
states$region[states$statefip==72] <- 2

riskt <- left_join(risk, states, by=c("state"="statefip"))

# Select variables needed for shapefile, merge, rename for .shp colname limit
riskt <- riskt %>% select(tract_geoid, risk, division, chapter_name, region_name, county_name_long) %>%
	rename(chapter = chapter_name, region = region_name, county = county_name_long)
risktracts <- merge(tracts, riskt, by.x="GEOID", by.y="tract_geoid", all.x=T)

# Remove some unneeded attribute columns
head(risktracts@data)
risktracts@data <- risktracts@data[,c("GEOID", "NAME", "division", "risk", "county", "chapter", "region")]
summary(risktracts@data$risk)

# Write shapefile and zip for Mapbox upload
writeOGR(riskcounties, dsn="shapefiles/riskshp", layer="counties", driver="ESRI Shapefile", overwrite_layer = T)
system("zip -j shapefiles/riskshp/counties.zip shapefiles/riskshp/counties.dbf shapefiles/riskshp/counties.prj shapefiles/riskshp/counties.shp shapefiles/riskshp/counties.shx")

########################################################################################################
# Write national tract-level shapefile and regional shapefiles
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
	system(zipcmd)
	# Return the data frame
	shp <- shp
}
east <- regionalShp("east")
midwest <- regionalShp("midwest")
south <- regionalShp("south")
west <- regionalShp("west")