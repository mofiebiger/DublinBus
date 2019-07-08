from django.shortcuts import render,redirect
import requests
import json
from prediction.models import StopInformation
from django.urls import reverse
from django.http import HttpResponse, JsonResponse
from django.views.generic import TemplateView
from django.core import serializers

# Create your views here.


class WeatherInfoView(TemplateView):   
    '''This class is designed to get weather info from the darksky'''
    def get(self,request):   
        #url is the darksky website
        url='https://api.darksky.net/forecast/6d1a9498f039837cce2657a75bd43748/53.3498,-6.2603'
        object = requests.get(url)
        #transfer the content into json
        text = object.json()
        #return the current weather information
        return JsonResponse(text['currently'])
    
    
    
class StopInfoView(TemplateView):
    
    def get(self,request,stop_id):  
        if not stop_id:
            return JsonResponse({'res':0,'errmsg': 'Data is not complete'})
        stop_info = StopInformation.objects.filter(actual_stop_id=stop_id)
            
            #stop does not exist
        if len(stop_info) == 0:
            return JsonResponse({'res':0,'errmsg': 'the stop does not exist'})
            
        json_data = serializers.serialize('json', stop_info)
 
        json_data = json.loads(json_data)
        

#         return JsonResponse(json_data, safe=False)
        return JsonResponse(json_data[0]['fields'], safe=False)
