from django.shortcuts import render,redirect
import requests
import json
from prediction.models import StopInformation, BusRouteNumber
from django.urls import reverse
from django.http import HttpResponse, JsonResponse
from django.views.generic import TemplateView
from django.core import serializers
from django.http import QueryDict
import config
from prediction.get_prediction import prediction_route
from geopy.distance import geodesic
from django.core import serializers
import re
import threading
from time import sleep
from datetime import date, time, datetime

import numpy as np
import pandas as pd
import xgboost as xgb
import holidays as hol
ie_holidays = hol.Ireland()

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
        
def predict_time(StopA, StopB, PDate, PTime):
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

    Sample Usage:
    time = predict_time("226", "228", "2019-08-16", "15:00")

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

print("prediction test :", predict_time("226", "228", "2019-08-16", "15:00"))

class WeatherInfoView(TemplateView):
    '''This class is designed to get weather info from the darksky'''
    def get(self,request):
        #url is the darksky website
        url='https://api.darksky.net/forecast/'+ config.darksky_api +'/53.3498,-6.2603?exclude=alerts&units=si'
        object = requests.get(url)
        #transfer the content into json
        text = object.json()
        #return the current weather information
        return JsonResponse(text)



class RealTimeStopInfoView(TemplateView):

    def get(self,request,stop_id):
        if not stop_id:
            return JsonResponse({'res':0,'errmsg': 'Data is not complete'})
        url='https://data.smartdublin.ie/cgi-bin/rtpi/realtimebusinformation?stopid='+ str(stop_id) +'&format=json'
        object = requests.get(url)
        #transfer the content into json
        text = object.json()
        if text['errorcode'] == "0" :
            return JsonResponse({'res':1,'content':text})
        else:
            return JsonResponse({'res':0,'errmsg': 'The stop does not exist or has no information.'})




# class StopInfoView(TemplateView):
#
#     def get(self,request,stop_id):
#         if not stop_id:
#             return JsonResponse({'res':0,'errmsg': 'Data is not complete'})
#         stop_info = StopInformation.objects.filter(stop_id=stop_id)
#
#             #stop does not exist
#         if len(stop_info) == 0:
#             return JsonResponse({'res':0,'errmsg': 'the stop does not exist'})
#
#         json_data = serializers.serialize('json', stop_info)
#
#         json_data = json.loads(json_data)
#
#         return JsonResponse(json_data[0]['fields'], safe=False)


class BusInfoView(TemplateView):

    def get(self,request,bus_id):
        if not bus_id:
            return JsonResponse({'res':0,'errmsg': 'Data is not complete'})
        stop_info = StopInformation.objects.filter(stop_id=bus_id)

            #stop does not exist
        if len(stop_info) == 0:
            return JsonResponse({'res':0,'errmsg': 'the stop does not exist'})

        json_data = serializers.serialize('json', stop_info)

        json_data = json.loads(json_data)

        return JsonResponse(json_data[0]['fields'], safe=False)


class StopInfoNearbyView(TemplateView):
    '''get the stops that nearby the current location'''

    def get(self,request):
        '''get the stops that nearby the current location'''

        #get data
        lat = request.GET.get('lat')
        lon = request.GET.get('lon')
        radius = float(request.GET.get('radius'))

        #open json file
        with open('static/json/stops_information.json','r') as load_f:
             stops_data = json.load(load_f)

        #add the stop into file where the distance is less than the radius
        clean_data = []
        for stop in stops_data:
            if geodesic((lat,lon), (stop['stop_lat'],stop['stop_lon'])).km <= radius:
                clean_data.append(stop)

        return JsonResponse({'stops':clean_data})


class BusRouteView(TemplateView):
    '''display all the stops along the bus route'''

    def get(self,request):
        '''display all the stops along the bus route'''
        bus_route = request.GET.get('bus_number').lower()
        origin = request.GET.get('origin')
        destination = request.GET.get('destination')

        result = BusRouteNumber.objects.filter(route=bus_route, origin=origin, destination=destination)
        stops_final_list = []
        if result.exists():
            stops_list = re.sub('\s|\'',"",(result[0].stops).strip('[]')).split(',')
            for i in range(len(stops_list)):
                stops_list[i] = int(stops_list[i])

            position_result = StopInformation.objects.filter(stop_id__in = stops_list)
            json_data = serializers.serialize('json', position_result)
            json_data = json.loads(json_data)
            for i in range(len(stops_list)):
                for j in range(len(json_data)):
                    if json_data[j]['fields']['stop_id'] == stops_list[i]:
                        stops_final_list.append(json_data[j])
                        break
            return JsonResponse({'res':1,'stops':stops_final_list})
        else:
            return JsonResponse({'res':0,'errmsg':'the route does not exist!'})

class PredictionRouteView(TemplateView):
    def post(self,request):
        
        #get the data from the front-end
        content = json.loads(request.body)
        routes = content['routes']
        date = content['date']
        time = content['time']
        print(routes)
        #transform data to the standard format
        new_routes = []
        for i in range(len(routes)):
            bus_route = routes[i]['short_name'].upper()
            number_stops = routes[i]['num_stops']
            try:
                value = prediction_route(date,bus_route,time,number_stops)
                text = str(round(value/60))+"min"
                new_routes.append({'text':text,'value':value})
            except Exception as e:
                new_routes.append({'text':"",'value':0})
                print(repr(e))
        return JsonResponse({'res': 1,'response_leg':new_routes})
