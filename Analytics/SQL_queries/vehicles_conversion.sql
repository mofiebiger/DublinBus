select * from vehicles limit 10;
-- select * from vehicles where dayofservice='DAYOFSERVICE';

--Changing the date format to actual datetime object.
-- UPDATE vehicles
-- SET dayofservice = 
-- TO_DATE(
-- 	LEFT(
-- 	REPLACE(
-- 	REPLACE(
-- 	REPLACE(
-- 	REPLACE(
-- 	REPLACE(
-- 	REPLACE(
-- 	REPLACE(
-- 	REPLACE(
-- 	REPLACE(
-- 	REPLACE(
-- 	REPLACE(
-- 	REPLACE(
-- 	REPLACE(dayofservice,
-- 	'JAN','01'),
-- 	'FEB','02'),
-- 	'MAR','03'),
-- 	'APR','04'),
-- 	'MAY','05'),
-- 	'JUN','06'),
-- 	'JUL','07'),
-- 	'AUG','08'),
-- 	'SEP','09'),
-- 	'OCT','10'),
-- 	'NOV','11'),
-- 	'DEC','12'),
-- 	'-','/'),
-- 	9),
-- 'DD/MM/YY');