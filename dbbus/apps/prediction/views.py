from django.shortcuts import render,redirect
import requests
import json
from prediction.models import StopInformation
from django.urls import reverse
from django.http import HttpResponse, JsonResponse
from django.views.generic import TemplateView
from django.core import serializers
from django.http import QueryDict
import config
# Create your views here.
from prediction.get_prediction import prediction_route
from geopy.distance import geodesic
from distutils.command.clean import clean


class WeatherInfoView(TemplateView):
    '''This class is designed to get weather info from the darksky'''
    def get(self,request):
        #url is the darksky website
        url='https://api.darksky.net/forecast/'+ config.darksky_api +'/53.3498,-6.2603'
        object = requests.get(url)
        #transfer the content into json
        text = object.json()
        text_needed = {}
        text_needed['currently'] = text['currently']
        text_needed['hourly'] = text['hourly']
        #return the current weather information
        return JsonResponse(text_needed)



class StopInfoView(TemplateView):

    def get(self,request,stop_id):
        if not stop_id:
            return JsonResponse({'res':0,'errmsg': 'Data is not complete'})
        stop_info = StopInformation.objects.filter(stop_id=stop_id)

            #stop does not exist
        if len(stop_info) == 0:
            return JsonResponse({'res':0,'errmsg': 'the stop does not exist'})

        json_data = serializers.serialize('json', stop_info)

        json_data = json.loads(json_data)


#         return JsonResponse(json_data, safe=False)
        return JsonResponse(json_data[0]['fields'], safe=False)

class ServiceWorker(TemplateView):
    template_name = 'serviceworker.js'
    content_type = 'application/javascript'
    
    
    
class StopInfoNearbyView(TemplateView):
    '''get the stops that nearby the current location'''

    def get(self,request):
        '''get the stops that nearby the current location'''
        
        #get data
        lat = request.GET.get('lat')
        lon = request.GET.get('lon')
        radius = float(request.GET.get('radius'))

        print(lat,lon,radius)
        #open json file
        with open('static/json/stops_info.json','r') as load_f:
             stops_data = json.load(load_f)
             
        #add the stop into file where the distance is less than the radius
        clean_data = []
        for stop in stops_data:
            if geodesic((lat,lon), (stop['stop_lat'],stop['stop_lon'])).km <= radius:
                clean_data.append(stop)

                    
            
        
        
#         print(stops_data)
        return JsonResponse({'stops':clean_data})
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
# 
# #         return JsonResponse(json_data, safe=False)
#         return JsonResponse(json_data[0]['fields'], safe=False)
#    
    
    
class PredictionRouteView(TemplateView):
    ''''''
    def post(self,request):
                #get the data from the front-end
        content = json.loads(request.body)
        routes = content['routes']
        date = content['date']
        time = content['time']

        
        #transform data to the standard format
        try:
            new_routes = []
            for i in range(len(routes)):
                bus_route = routes[i]['short_name'].upper()
                number_stops = routes[i]['num_stops']
                value = prediction_route(date,bus_route,time,number_stops)
                text = str(round(value/60))+"min"
                new_routes.append({'text':text,'value':value})
        except Exception as e:
            print(repr(e))
            return JsonResponse({'res': 0,'errmsg':'Please try again'})
        return JsonResponse({'res': 1,'response_leg':new_routes})
            
            

            

        
        
