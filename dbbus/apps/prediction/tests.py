#from django.test import TestCase
import unittest
import json
import django.views
from django.urls import include, path, reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, URLPatternsTestCase

class DublinBusUnitTests(APITestCase, URLPatternsTestCase):

    # def setUp(self):
    #     self.user = get_user_model()
    #     self.factory = APIRequestFactory()

    urlpatterns = [
        path('prediction/', include('prediction.urls')),
    ]
    url = URLPatternsTestCase()
    api = APITestCase()

    def test_stations(self):
        # Request and parse the JSON response
        url = reverse("weather")
        response = self.client.get(url, format="json")
        #self.assertEqual(response.status_code, status.HTTP_200_OK)
        # json_content = response_to_json(response)
        self.assertEqual(len(response.data), 2)

    # def

    if __name__ == '__main__':
        unittest.main(verbosity=2)
        # try:
        #     setup_test_environment()
        #     settings.DEBUG = False
        #     verbosity = 0
        #     old_database_name = settings.DATABASE_NAME
        #     connection.creation.create_test_db(verbosity)
        #     unittest.main()
        # finally:
        #     connection.creation.destroy_test_db(old_database_name, verbosity)
        #     teardown_test_environment()
        #settings.configure()
