from django.test import TestCase

class DublinBusUnitTests(unittest.TestCase):

    # def test_upper(self):
    #     self.assertEqual('foo'.upper(), 'FOO')

    def setUp(self):
        views.testing = True
        self.views = views.test_client()

    def testWeatherPredictions(self):
        weather = views.WeatherInfoView()
        request = weather.get('/prediction/weather').get_json()
        self.assertEqual(len(request), 2)

    def tearDown(self):
        self.apps.dispose()

if __name__ == '__main__':
    settings.configure()
    unittest.main(verbosity=2)
