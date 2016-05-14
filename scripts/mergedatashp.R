# Merge risk scores on to national census tract shapefile, split into 4 regional shapefiles & county file for Mapbox upload

library(rgdal)
library(dplyr)

# Read risk in directly from model repo (https://github.com/home-fire-risk/smoke_alarm_models) to get latest data
risk <- read.csv("https://raw.githubusercontent.com/home-fire-risk/smoke_alarm_models/master/aggregate_risk/data/risk_tract.csv", stringsAsFactors = F, colClasses = c("tract_geoid" = "character", "state" = "character","cnty" = "character","tract" = "character"))

# ACS data, from scripts/retrieveCensus.R
acscounties <- read.csv("data/acscounties.csv", stringsAsFactors = F, colClasses = c("fips_county" = "character"))
acstracts <- read.csv("data/acstracts.csv", stringsAsFactors = F, colClasses = c("fips_tract" = "character"))

# Clean up some mostly-missing tracts (included in one model but no others, other territories)
risk <- risk %>% filter(!is.na(state))

# Table number of tracts by region for RC request
tr <- as.data.frame(table(risk$region_name))
write.csv(tr, "data/tractsbyregion.csv", row.names=F)

# National counties shapefile
counties <- readOGR("shapefiles/cb_2014_us_county_500k/","cb_2014_us_county_500k")

# National Census tract shapefile - available at https://drive.google.com/drive/folders/0B9WCc5VMDAquajlzSG5QcW5DcDg
# Clipped to water boundaries in https://github.com/home-fire-risk/smoke_alarm_map/issues/7
tracts <- readOGR("shapefiles/ustracts_clipped","ustracts_clipped")

# State-level identifiers 
states <- read.csv("data/stateinfo.csv", stringsAsFactors = F)
# Assign Puerto Rico to the South for shapefile creation
states$statefip <- sprintf("%02s", states$statefip)
states$division[states$statefip==72] <- 6
states$region[states$statefip==72] <- 2
states <- states %>% select(-region)

########################################################################################################
# Make counties dataset and save merged shapefile .zip
########################################################################################################

countyData <- function(risk) {
	# Select variables needed for shapefile, merge, rename for .shp colname limit
	riskc <- risk %>% filter(!is.na(state)) %>%
		mutate(fips_county = paste(state, cnty, sep="")) %>%
		group_by(fips_county, county_name_long, chapter_name, region_name) %>%
		summarize(risk = mean(risk_cnty)) %>%
		rename(chapter = chapter_name, region = region_name, county = county_name_long)
	
	# Rank counties by risk (highest = 1) within RC regions
	riskc <- riskc %>% 
		arrange(region, -risk) %>%
		group_by(region) %>%
		mutate(rank=row_number(), rankn = n_distinct(fips_county))
	
	# Add quantile groups for mapping
	riskc$riskgroup <- as.integer(cut(riskc$risk, quantile(riskc$risk, probs=0:6/6), include.lowest=TRUE))
	
	# Merge to ACS data
	riskc <- left_join(riskc, acscounties, by="fips_county")
	
	# ogr2ogr does not like the extra attributes created in group_by & summarize functions
	riskc <- as.data.frame(riskc)
}

riskc <- countyData(risk)
summary(riskc$risk)

# Join to shapefile
riskcounties <- merge(counties, riskc, by.x="GEOID", by.y="fips_county", all.x=T)

# Remove some unneeded attribute columns
head(riskcounties@data)
riskcounties@data <- riskcounties@data[,c("GEOID", "risk", "riskgroup", "county", "chapter", "region", "rank", "rankn", "population", "households", "medianinc_hh", "medianage")]

# Write county shapefile and zip for Mapbox upload
writeOGR(riskcounties, dsn="shapefiles/riskshp", layer="counties", driver="ESRI Shapefile", overwrite_layer = T)
system("zip -j shapefiles/riskshp/counties.zip shapefiles/riskshp/counties.dbf shapefiles/riskshp/counties.prj shapefiles/riskshp/counties.shp shapefiles/riskshp/counties.shx")

rm(counties, riskcounties, acscounties, riskc)

########################################################################################################
# Make tracts dataset for merge
########################################################################################################

tractData <- function(risk) {
	# Merge to ACS tract info
	riskt <- left_join(risk, acstracts, by=c("tract_geoid"="fips_tract"))
	
	# Rank tracts by risk (highest = 1) within RC regions
	riskt <- riskt %>% 
		# If population/households are low we don't want to send volunteers there
		mutate(lowpop = ifelse(population < 100 | households < 20, 1, 0)) %>%
		arrange(region_code, -risk) %>%
		group_by(region_code, lowpop) %>%
		mutate(rank = rank(desc(risk)), rankn = n_distinct(tract_geoid))
		
	riskt <- riskt %>% mutate(rank = replace(rank, lowpop==1, NA))
	
	# Saving quantiles as a categorical variable makes it easier to update the map - set the breaks in R, not Mapbox
	print(quantile(riskt$risk, c(1/6, 2/6, 3/6, 4/6, 5/6)))
	riskt$riskgroup <- as.integer(cut(riskt$risk, quantile(riskt$risk, probs=0:6/6), include.lowest=TRUE))
	
	# Rename RC names for shapefile limit
	riskt <- riskt %>% rename(chapter = chapter_name, region = region_name, county = county_name_long)
	riskt <- data.frame(riskt)
}

riskt <- tractData(risk)

# Export CSV for table view - remove lowpop tracts and risk model component scores
tablet <- riskt %>% filter(lowpop==0) %>% 
	select(-risk_1a, -risk_1b, -risk_1c, -risk_2a, -risk_2c, -risk_3a, -NAME)
write.csv(tablet, "data/tabletracts.csv", row.names = F, na="")

riskt <- left_join(riskt, states, by=c("state"="statefip"))
# Select variables needed for shapefile, merge, rename for .shp colname limit
riskt <- riskt %>% select(tract_geoid, risk, riskgroup, division, chapter, region, county, rank, rankn, population, households, lowpop, medianinc_hh, medianage, risk_1agg, risk_2agg, risk_3agg)

risktracts <- merge(tracts, riskt, by.x="GEOID", by.y="tract_geoid")

# Remove some unneeded attribute columns
head(risktracts@data)
risktracts@data <- risktracts@data[,c("GEOID", "NAME", "division", "risk", "riskgroup", "county", "chapter", "region", "rank", "rankn", "population", "households", "lowpop", "medianinc_hh", "medianage", "risk_1agg", "risk_2agg", "risk_3agg")]
summary(risktracts@data$risk)

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
	# shp <- shp
}
east <- regionalShp("east")
midwest <- regionalShp("midwest")
south <- regionalShp("south")
west <- regionalShp("west")