import config
import numpy as np
import pandas as pd
import xgboost as xgb
import requests as req
import holidays as hol
ie_holidays = hol.Ireland()

from datetime import date, time, datetime

def set_season(x):
    winter = [11,12,1]
    autumn = [10,9,8]
    spring = [4,3,2]

    if x in winter:
        return 'Winter'
    elif x in autumn:
        return 'Autumn'
    elif x in spring:
        return 'Spring'
    else:
        return 'Summer'
       

def prediction(PDate, Routeid, PTime, Number_Stops):
    """
    Return an estimate of travel time, in seconds, for a given journey. 
    
    inputs:
    ---------------------------------------
    (str) Date:            YYYY-MM-DD
    (str) Routeid:         lineid
    (str) Time:            HH:MM
    (int) Number_Stops:    Number of stops to be travelled
    
    
    Outpus:
    ---------------------------------------
    (int) time:            Seconds
    """
    
    # =========================== Import Model ========================= #
    
    model = xgb.Booster()
    model.load_model("static/ModelFiles/RouteModels/Route"+Routeid+".model")
    
    # ====================== Dateand Time objects ====================== #
    
    ddate = date(int(PDate[:4]), int(PDate[5:7]), int(PDate[-2:]))
    dtime = time(int(PTime[:2]), int(PTime[-2:]))
           
    if datetime.combine(ddate, dtime) < datetime.now():
        return "Please select a valid date/time. Only future values are valid."
        
    inputs.hour = dtime.hour
    inputs.month= ddate.month    
    
    # ========================== Weather Data ========================== # 
    # will need to sync this with the automated live weather updates to no waste calls. Also add forecasting option. 
    
    weathercall = req.get("https://api.darksky.net/forecast/{config.DarkSkyKeys}/53.3498,-6.2603").content
    weather = json.loads(weathercall)['currently']
    
    # ======================== Inputs DataFrame ======================== #
    
    predictors = ['temperature','humidity', 'windSpeed', 'rain', 'hour', 'holiday', 'weekend',
              'icon_clear-day', 'icon_clear-night', 'icon_cloudy', 'icon_fog',
              'icon_partly-cloudy-day', 'icon_partly-cloudy-night', 'icon_rain','icon_wind',
              'month','season_Winter','season_Autumn','season_Summer','season_Spring']    
    
    # Make dataframe of inputs. 
    inputs = pd.DataFrame(np.zeros(len(predictors))).T
    inputs.columns = predictors
    
    # ========================= Weather Columns ======================== #
    
    inputs.temperature = weather['temperature']
    inputs.humidity = weather['humidity']
    inputs.windSpeed = weather['windSpeed']
    
    # convert in inches of liquid water per hour to mm
    inputs.rain = float(weather['precipIntensity'])/0.0394
    
    # ========================= Weekday/Weekend ======================== #    
    
    if ddate.weekday() in [5,6]:
        inputs.weekday=False
    else:
        inputs.weekday=True
    
    # ===================== One Hot Encoded Columns ==================== #  
    
    inputs["icon_{0}".format(weather['icon'])]=1
    inputs["season_{0}".format(set_season(ddate.month))]=1
    
    # ========================= Applying Model ========================= #
    
    inputdata = xgb.DMatrix(inputs)
    estimate = model.predict(inputdata)
    
    # ======================= Adjust for #stops ======================== #
    
    estimate = int(estimate.tolist()[0])
    
    with open("stops_per_line.txt",'r') as f:
        stopnums = json.loads(f.readlines()[0])
    
    total_stops = stopnums[Routeid][0][0]
    
    travel_time_estimate = (Number_Stops/total_stops) * estimate
    
    # ========================= Returning Data ========================= #
    
    return travel_time_estimate
