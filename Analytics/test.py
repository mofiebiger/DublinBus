import pandas as pd
import dask.dataframe as dd
from dask.diagnostics import ProgressBar

print('Initial setup...')
leave = dd.read_csv("data/rt_leavetimes_DB_2018.txt",sep=";")

leave = leave.drop(['DATASOURCE','VEHICLEID','PASSENGERS','PASSENGERSIN','PASSENGERSOUT','DISTANCE','SUPPRESSED', 'JUSTIFICATIONID','NOTE','LASTUPDATE'], axis=1)
leave['DAYOFSERVICE'] = dd.to_datetime(leave.DAYOFSERVICE, format="%d-%b-%y %H:%M:%S")

print('Performing computation...')
with ProgressBar():
    leavedf = leave.compute()

print('Writing to csv...')
leavedf.to_csv("leave.csv", index=False)
print('Complete')


