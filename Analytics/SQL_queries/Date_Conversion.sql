-- SELECT dayofservice FROM leavetimes LIMIT 10;

-- Select all months from string;
-- SELECT distinct REPLACE(RIGHT(LEFT(dayofservice,6),3),'DEC','12') FROM vehicles LIMIT 50;
-- SELECT count(*) FROM vehicles WHERE RIGHT(LEFT(dayofservice,6),3) = 'DEC';
-- SELECT REPLACE(dayofservice,'-','/') FROM leavetimes LIMIT 10;

-- Changing the date format to actual datetime object.
UPDATE leavetimes
SET dayofservice = 
TO_DATE(
	LEFT(
	REPLACE(
	REPLACE(
	REPLACE(
	REPLACE(
	REPLACE(
	REPLACE(
	REPLACE(
	REPLACE(
	REPLACE(
	REPLACE(
	REPLACE(
	REPLACE(
	REPLACE(dayofservice,
	'JAN','01'),
	'FEB','02'),
	'MAR','03'),
	'APR','04'),
	'MAY','05'),
	'JUN','06'),
	'JUL','07'),
	'AUG','08'),
	'SEP','09'),
	'OCT','10'),
	'NOV','11'),
	'DEC','12'),
	'-','/'),
	9),
'DD/MM/YY');