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
