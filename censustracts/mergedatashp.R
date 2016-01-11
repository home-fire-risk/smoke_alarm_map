# Merge risk scores on to national census tract shapefile, split into 4 regional shapefiles for Mapbox upload
# Hannah Recht, 01-09-16

library(rgdal)
library(dplyr)

states <- read.csv("data/stateinfo.csv", stringsAsFactors = F)
# Assign Puerto Rico to the South for shapefile creation
states$division[states$statefip==72] <- 6
states$region[states$statefip==72] <- 2

risk <- read.csv("data/risk_tract.csv", stringsAsFactors = F)
risk <- left_join(risk, states, by=c("state"="statefip"))

# Need strings for geoid because of necessary leading 0s
risk$tract_geoid <- as.character(risk$tract_geoid)
risk$GEOID <- sprintf("%011s", risk$tract_geoid)
risk <- risk %>% select(GEOID,risk,division)

ustracts <- readOGR("censustracts/ustracts","ustracts")
risktracts <- merge(ustracts, risk , by="GEOID", all.x=T)

# Remove some unneeded attribute columns
risktracts <- risktracts[,c("GEOID", "NAME", "division", "risk")]

writeOGR(risktracts, dsn="censustracts/riskshp", layer="riskshp", driver="ESRI Shapefile", overwrite_layer = T)

# Divide country by census region due to Mapbox zipped shapefile upload size limit - 260MB
# http://www2.census.gov/geo/docs/maps-data/maps/reg_div.txt
# East: northeast region and Puerto Rico and South Atlantic division (otherwise South region is too big to upload)
eastf <- c(1,2,5)
midwestf <-c(3,4)
southf <- c(6,7)
westf <- c(8,9)

east <- risktracts[(risktracts$division %in% eastf),]
midwest <- risktracts[(risktracts$division %in% midwestf),]
south <- risktracts[(risktracts$division %in% southf),]
west <- risktracts[(risktracts$division %in% westf),]

writeOGR(east, dsn="censustracts/riskshp", layer="east", driver="ESRI Shapefile", overwrite_layer = T)
writeOGR(midwest, dsn="censustracts/riskshp", layer="midwest", driver="ESRI Shapefile", overwrite_layer = T)
writeOGR(south, dsn="censustracts/riskshp", layer="south", driver="ESRI Shapefile", overwrite_layer = T)
writeOGR(west, dsn="censustracts/riskshp", layer="west", driver="ESRI Shapefile", overwrite_layer = T)