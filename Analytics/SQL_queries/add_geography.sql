-- select * from stop_information;

-- Make a new column of type geography
alter table stop_information add column stop_location geography;

-- fill the column with the lat, lng pairs. [stored as (lng,lat)]
UPDATE stop_information SET stop_location = ST_SetSRID(ST_MakePoint(stop_lon, stop_lat), 4326)::geography

-- [TEST] Select only the stops within a km your location [need to get your location (js -> python -> postgis)]
select * 
from stop_information 
order by stop_location <-> ST_SetSRID(ST_MakePoint(-6.1619, 53.2738 ), 4326)::geography 
limit 5; 