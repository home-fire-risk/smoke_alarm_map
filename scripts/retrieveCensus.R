# Hannah Recht, 02-21-16
# Retrieve 2010-2014 ACS data for map tool
# Note: to run, you'll need a Census API key - http://api.census.gov/data/key_signup.html

# install.packages("devtools")
# devtools::install_github("hrecht/censusapi")
library(censusapi)
library(dplyr)
library(readr)
censuskey <- read_file("/Users/Hannah/Documents/keys/censuskey.txt")

acs_2014_api <- 'http://api.census.gov/data/2014/acs5'
# vars2014 <- listCensusMetadada(acs_2014_api, "v")

# Vars: total population, median age, median household income (2014 $), number of households, race/ethnicity
vars <- c("B01001_001E", "B01002_001E", "B19013_001E", "B19001_001E", "B03002_012E", "B03002_002E", "B03002_003E", "B03002_004E", "B03002_005E", "B03002_006E", "B03002_007E", "NAME")

# Race/ethnicity: white non-Hispanic, black non-Hispanic, American Indian/Alasa Native non-Hispanic, Asian/Pacific Islander non-Hispanic, Hispanic (any race), other non-Hispanic (including multiple races)
formatCensus <- function(df) {
	df <- df %>% rename(population = B01001_001E, medianinc_hh = B19013_001E, households = B19001_001E, medianage = B01002_001E) %>%
		mutate(hispanic = B03002_012E/population, white = B03002_003E/population, black = B03002_004E/population, aian = B03002_005E/population, api = (B03002_006E + B03002_007E)/population, other = (population - (B03002_012E + B03002_003E + B03002_004E+ B03002_005E + B03002_006E + B03002_007E))/population) %>%
		select(-c(B03002_012E, B03002_002E, B03002_003E, B03002_004E, B03002_005E, B03002_006E, B03002_007E))
	return(df)
}

# Counties
acscounties <- getCensus(acs_2014_api, key=censuskey, vars=vars, region="county:*")
acscounties <- formatCensus(acscounties)
acscounties <- acscounties %>% mutate(fips_county = paste(state, county, sep="")) %>%
	select(-state, -county)
write.csv(acscounties, "data/acscounties.csv", na="", row.names = F)

# Tracts
acstracts <- NULL
# Have to get tract data for each state separately with API
for (s in fips) {
	regionget <- paste("tract:*&in=state:", s, sep="")
	temp <- getCensus(acs_2014_api, key=censuskey, vars=vars, region=regionget)
	acstracts <- rbind(acstracts, temp)
}
acstracts <- formatCensus(acstracts)
# Tract full fips codes
acstracts <- acstracts %>% mutate(fips_tract=paste(state, county, tract, sep="")) %>%
	select(-state, -county, -tract) %>%
	select(fips_tract, everything()) %>% 
	mutate(name_tract = gsub("^(.*?),.*", "\\1", acstracts$NAME))

write.csv(acstracts, "data/acstracts.csv", na="", row.names = F)