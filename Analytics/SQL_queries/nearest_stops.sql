-- Stored procedure to find the closest N stops to a given lat. lng pair. 
-- inputs - N, lat, lng
-- outputs - List of stops (lat ,lng, name, number, )

CREATE OR REPLACE FUNCTION Nearest_stops(p_lat numeric(13,10), p_lng numeric(13,10), p_N INT)
	RETURNS TABLE (
		sopt_num INT,
		stop_name VARCHAR(45),
		lat NUMERIC(13,10),
		lng NUMERIC(13,10)
	)
AS $$
BEGIN 
	
	RETURN QUERY
		SELECT stop_id, stop_lon, stop_lat, stop_name
		FROM stop_information 
		ORDER BY stop_location <-> ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography 
		LIMIT p_N; 

END; $$

LANGUAGE 'plpgsql';