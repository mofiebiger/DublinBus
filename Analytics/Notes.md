# Data Analytics Documentation

Table of contents for all Data analytics files/ documents.
Basic findings from analysis.  

**config.py [Not to be uploaded to repo]**
Contains all login and connection information required to connect to the database. 
To access each piece of data use config."information_name", e.g.
- config.Database = Database name
- config.pswd = password
- config.host = host address
- config.user = Username
- config.port = Access port 
- config.TunnelPort = SSH Tunnel port
- config.TunnelHost = SSH Tunnel Host
- DarkSkyKeys =  API key for Dark Sky 

**BusEnvReq.txt**
Environment requirements list. Must install requirements for accompanying files. 

## Analysis Report

**Null Values and Missing Data**
**rt_trips**
- There are 2182637 rows in trips between 01/01/18 and 31/12/18.
- There are 289270 incomplete rows. (approx. 1 in 6)
- Data is missing from the actualtime_arr and actualtime_dep fields. 
- The plannedtime_arr, plannedtime_dep, tripid, dayofservice, direction, lineid and routeid fields are complete. 
- Columns in trips table 

    - **plannedtime_arr**  
        Description: 

    - **plannedtime_dep**  
        Description: 

    - **tripid**  
        Description: 

    - **dayofservice**  
        Description: 

    - **direction**  
        Description: 

    - **lineid** 
        Description: 

    - **routeid** 
        Description: 

    - **actualtime_arr**  
        Description: 

    - **actualtime_dep** 
        Description: 

**rt_leavetimes**
116949113


included routes: "51X", "7A", "67X", "41C", "116", "79", "184", "25", "14C", "69", "33E", "4", "38", "40B", "54A", "17A", "38A", "161", "68", "43", "47", "65", "32", "39A", "66X", "41A", "75", "77A", "27A", "76", "66", "70", "16C", "15A", "25A", "15D", "114", "68X", "65B", "7B", "84X", "45A", "145", "16", "40", "104", "38B", "142", "31A", "150", "185", "84A", "33D", "31D", "33X", "83A", "69X", "27", "13", "70D", "29A", "7", "51D", "15", "42", "9", "18", "140", "76A", "41D", "17", "41X", "32X", "39X", "42D", "66A", "33B", "46A", "238", "111", "79A", "27B", "67", "63", "38D", "151", "239", "40E", "26", "44B", "31", "56A", "41", "41B", "130", "66B", "27X", "53", "120", "7D", "25B", "31B", "33", "236", "59", "37", "102", "25D", "270", "123", "49", "11", "46E", "68A", "220", "118", "61", "122", "44", "40D", "39", "16D", "15B", "1", "77X", "14", "25X", "83", "84", "33A"