TO DO:
1. Decide what data needs to be included in leavetimes. 
2. Delete leavetimes table to save space. 
3. Remake the leavetimes table with the new columns and data formatted correctly before entry to avoid  later issues with updates/storage
4. Look at the geolocation capabilities of postgis and how it can be used to find the distance between two stops.
5. consider making a table where each column is a trip id and each entry is a stop id and the index is progrnumber.
    [note null values will appear here as trips have different lenghts. 
6. Alter the trips information table to remove superfluous data.
7. Take any useful information from vehicles and delete if there is none. 
8. Integrate new changes with the original scripts for analysis. 

## Useful columns

Lineid [trips]
times* [trips/leavetimes]


## Changes to make to columns
- Changing the direction to bool will reduce the size of the table. bool [1 byte]; smallint [2 byte]