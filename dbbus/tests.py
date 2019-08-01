import unittest
import sys


from dbbus import settings
from apps.prediction import views


class DublinBusUnitTests(unittest.TestCase):

    # def test_upper(self):
    #     self.assertEqual('foo'.upper(), 'FOO')

    # def setUp(self):
    #     apps.testing = True
    #     self.apps = apps.test_client()

    def testWeatherPredictions(self):
        weather = views.WeatherInfoView()
        request = weather.get('/prediction/weather').get_json()
        self.assertEqual(len(request), 2)

    # def tearDown(self):
    #     self.apps.dispose()

if __name__ == '__main__':
    settings.configure()
    unittest.main(verbosity=2)
