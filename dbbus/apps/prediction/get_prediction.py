import config
import json 
import numpy as np
import pandas as pd
import xgboost as xgb
import requests
import holidays as hol  
import threading
from time import sleep
from datetime import date, time, datetime
ie_holidays = hol.Ireland()

from datetime import date, time, datetime

def prediction_weather_funct():
    """
    Pull weather forecast data from dark sky api
    """

    weathercall = requests.get(f"https://api.darksky.net/forecast/{config.darksky_api}/53.3498,-6.2603").content
    weather = json.loads(weathercall)
    return {'hourly':weather['hourly']['data'], 'daily':weather['daily']['data']}

full_weather = prediction_weather_funct()

class Weatherforecast():

    global full_weather
    """ 
    Pull forecast information hourly in background to reduce overhead of prediction functions. 
    """

    def __init__(self, interval):
        """ Constructor: Make a background job whihch automatically updates the weather infomration.
        (int) Interval: time to sleep after running update function
        """
        self.interval = interval
        thread = threading.Thread(target=self.update_information, args=())
        thread.setDaemon(True)
        thread.start()

    def update_information(self):
        """ Method that runs in background updating global variable weatherinformation """

        while True:

            full_weather = prediction_weather_funct()

            print(f"####  Updating Weather Information @ {datetime.now()}  ####")

            # set weather forecast information as an attribute of weather instance.
            self.update = Weatherforecast

            #sleep for set interval (~ 30min/ 1hr)
            sleep(self.interval)

# Access forecast information via Weather.update
Weatherforecast(3600)

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
    
def find_closest_(weather):
    """
    find the weather data closest to the current time stamp
    """
    
    Now = datetime.now()
    
    server_time_fault = 1565867883 - 1565863997
    
    current_timestamp = datetime.timestamp(Now) + server_time_fault

    stamps = []
    for t in weather:
        stamps.append(t['time'])
        
    min_val = 100000000000000000
    min_idx = 0
    
    for idx, val in enumerate(stamps):
        
        if ((val - current_timestamp) < min_val):
            min_val = val - current_timestamp
            min_idx = idx
            
    return weather[min_idx]
        
def prediction_route(StopA, StopB, PDate, PTime):
    """
    Return an estimate of travel time, in seconds, for a given journey. 
    
    inputs:
    ---------------------------------------
    (str) PDate:            YYYY-MM-DD
    (str) PTime:            HH:MM
    
    (str) StopA:            Start Stop
    (str) StopB:            End Stop
    
    Outputs:
    ---------------------------------------
    (int) Travel Time:          Seconds
    """
    
    # =========================== Import Model ========================= #
    
    model = xgb.Booster()
    model.load_model(f"static/ModelFiles/StopModels/{StopA}_{StopB}.model")

    # ====================== Dateand Time objects ====================== #
    
    ddate = date(int(PDate[:4]), int(PDate[5:7]), int(PDate[-2:]))
    dtime = time(int(PTime[:2]), int(PTime[-2:]))
    
    # ========================== Weather Data ========================== # 

    Now = datetime.now()
    
    day_diff  = ddate.day - Now.day
    hour_diff = dtime.hour - Now.hour
     
    if day_diff > 2:
        weather = full_weather['daily']
        weather = find_closest_(weather)
         
    else:
        weather = full_weather['hourly']
        weather = find_closest_(weather)
    
    # ======================== Inputs DataFrame ======================== #
    
    predictors = ['temperature','humidity', 'windSpeed', 'rain', 'hour', 'holiday', 'weekend',
                  'month','season_Winter','season_Autumn','season_Summer','season_Spring',
                  'icon_clear-day', 'icon_clear-night', 'icon_cloudy', 'icon_fog',
                  'icon_partly-cloudy-day', 'icon_partly-cloudy-night', 'icon_rain','icon_wind']  
    
    # Make dataframe of inputs. 
    inputs = pd.DataFrame(np.zeros(len(predictors))).T
    inputs.columns = predictors
    
    inputs.hour = dtime.hour
    inputs.month= ddate.month  
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
    
    # ========================= Returning Data ========================= #
    
    return int(round(estimate.tolist()[0],0))
