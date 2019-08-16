import json
from . import views
from django.contrib.auth import get_user_model
from django.test import RequestFactory, TestCase

def response_to_json(response):
    str_content = response.content.decode("utf-8")
    return json.loads(str_content)

class PredictionTests(TestCase):

    def setUp(self):
        self.user = get_user_model()
        self.factory = RequestFactory()

    #Testing all views functions

    def test_weather_api_GET(self):
        request = self.factory.get('/prediction/weather/')
        request.user = self.user
        response = views.WeatherInfoView().get(request)
        json_content = response_to_json(response)

        #testing length of json response
        self.assertEqual(len(json_content), 9)

    def test_realtime_stop_info_GET(self):
        stop_id = 812
        request = self.factory.get('/prediction/realtime_info/' + str(stop_id))
        request.user = self.user
        response = views.RealTimeStopInfoView().get(request, stop_id)
        json_content = response_to_json(response)

        #testing length of json response
        self.assertEqual(len(json_content), 2)

    def test_realtime_stop_info_FALSE(self):
        stop_id = 8888888
        request = self.factory.get('/prediction/realtime_info/' + str(stop_id))
        request.user = self.user
        response = views.RealTimeStopInfoView().get(request, stop_id)
        json_content = response_to_json(response)

        #testing length of json response
        self.assertEqual(json_content, {'res':0,'errmsg': 'The stop does not exist or has no information.'})

    def test_stops_near_me_GET(self):
        request = self.factory.get('/prediction/stops_nearby/?lat=53.3067&lon=-6.2231&radius=1.0')
        request.user = self.user
        response = views.StopInfoNearbyView().get(request)
        json_content = response_to_json(response)

        #testing length of json response
        self.assertEqual(len(json_content), 1)

    def test_bus_route_info_GET(self):
        request = self.factory.get('/prediction/bus_route/?bus_number=39a&origin=UCD%20Belfield&destination=Ongar/')
        request.user = self.user
        response = views.BusRouteView().get(request)
        json_content = response_to_json(response)

        #testing length of json response
        self.assertEqual(len(json_content), 2)

    def test_bus_route_info_FALSE(self):
        request = self.factory.get('/prediction/bus_route/?bus_number=8&origin=UCD%20Belfield&destination=Ongar/')
        request.user = self.user
        response = views.BusRouteView().get(request)
        json_content = response_to_json(response)

        #testing length of json response
        self.assertEqual(json_content, {'res':0,'errmsg':'the route does not exist!'})

if __name__ == '__main__':
    unittest.main(verbosity=2)
