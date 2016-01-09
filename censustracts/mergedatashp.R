# Merge risk scores on to shapefile
# Hannah Recht, 01-09-16

library(rgdal)
library(dplyr)

risk <- read.csv("data/risk_tract.csv", stringsAsFactors = F)

# Need strings for geoid because of necessary leading 0s
risk$tract_geoid <- as.character(risk$tract_geoid)
risk$GEOID <- sprintf("%011s", risk$tract_geoid)
risk <- risk %>% select(GEOID,risk)

ustracts <- readOGR("censustracts/ustracts","ustracts")
risktracts <- merge(ustracts, risk , by="GEOID", all.x=T)

# See non merges - verify just territories
temp <- risktracts@data
table(subset(temp, is.na(risk), select=STATEFP))

writeOGR(risktracts, dsn="censustracts/riskshp", layer="riskshp", driver="ESRI Shapefile")