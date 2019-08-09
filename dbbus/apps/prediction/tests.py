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
        self.assertEqual(len(json_content), 2)

    def test_stop_info_GET(self):
        pass
    #     request = self.factory.get('/prediction/stop_info/')
    #     request.user = self.user
    #     stop_id = 812
    #     response = views.StopInfoView().get(request, stop_id)
    #     json_content = response_to_json(response)
    #     self.assertEqual(json_content, {
    #                     "stop_id": 812,
    #                     "stop_name": "North Circular Road",
    #                     "stop_name_localized": "An Cuarbhóthar Tdh",
    #                     "stop_lat": "53.3582580600",
    #                     "stop_lon": "-6.2842180560",
    #                     "stop_routes": "['46A']"
    #                     })

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

    def test_bus_route_prediction_POST(self):
        pass
        # request = self.factory.get('/prediction/route/')
        # request.user = self.user
        # response = views.PredictionRouteView().post(request)
        #
        # #testing the status code of the index page
        # self.assertEqual(response.status_code, 200)


if __name__ == '__main__':
    unittest.main(verbosity=2)
