import json
from . import views
from django.contrib.auth import get_user_model
from django.test import RequestFactory, TestCase

class UserTests(TestCase):

    def setUp(self):
        self.user = get_user_model()
        self.factory = RequestFactory()

    #Testing all User views functions

    def test_index_GET(self):
        request = self.factory.get('/user/index/')
        request.user = self.user
        response = views.IndexView().get(request)

        #testing the status code of the index page
        self.assertEqual(response.status_code, 200)

    def test_register_user_GET(self):
        request = self.factory.get('/user/register/')
        request.user = self.user
        response = views.RegisterView().get(request)

        #testing the status code of the index page
        self.assertEqual(response.status_code, 200)

    def test_register_user_POST(self):
        pass
        # request = self.factory.get('/user/register/')
        # request.user = self.user
        # response = views.RegisterView().post(request)
        #
        # #testing the status code of the index page
        # self.assertEqual(response.status_code, 200)

    def test_active_user_GET(self):
        pass

    def test_active_user_POST(self):
        pass

    def test_login_user_GET(self):
        request = self.factory.get('/user/login/')
        request.user = self.user
        response = views.LoginView().get(request)

        #testing the status code of the index page
        self.assertEqual(response.status_code, 200)

    def test_login_user_POST(self):
        request = self.factory.get('/user/login/')
        request.user = self.user
        response = views.LoginView().post(request)

        #testing the status code of the index page
        self.assertEqual(response.status_code, 200)

    def test_logout_user_GET(self):
        pass
        # request = self.factory.get('/user/logout/')
        # request.user = self.user
        # response = views.LogoutView().get(request)
        #
        # #testing the status code of the logout function
        # self.assertEqual(response.status_code, 200)

    def test_change_password_GET(self):
        request = self.factory.get('/user/change_password/')
        request.user = self.user
        response = views.PasswordChangeView().get(request)

        #testing the status code of the change password function
        self.assertEqual(response.status_code, 200)

    def test_change_password_POST(self):
        request = self.factory.get('/user/change_password/')
        request.user = self.user
        response = views.PasswordChangeView().post(request)

        #testing the status code of the change password function
        self.assertEqual(response.status_code, 200)

    def test_forget_password_GET(self):
        request = self.factory.get('/user/forget_password/')
        request.user = self.user
        response = views.PasswordForgetView().get(request)

        #testing the status code of the forget password function
        self.assertEqual(response.status_code, 200)

    def test_forget_password_POST(self):
        request = self.factory.get('/user/forget_password/')
        request.user = self.user
        response = views.PasswordForgetView().post(request)

        #testing the status code of the forget password function
        self.assertEqual(response.status_code, 200)

    def test_reset_password_GET(self):
        pass
        # request = self.factory.get('/user/reset_password/')
        # request.user = self.user
        # response = views.ResetPasswordView().get(request)
        #
        # #testing the status code of the reset password function
        # self.assertEqual(response.status_code, 200)

    def test_reset_password_POST(self):
        pass
        # request = self.factory.get('/user/reset_password/')
        # request.user = self.user
        # response = views.ResetPasswordView().post(request)
        #
        # #testing the status code of the reset password function
        # self.assertEqual(response.status_code, 200)

    def test_update_avatar_POST(self):
        request = self.factory.get('/user/change_avatar/')
        request.user = self.user
        response = views.AvatarUpdateView().post(request)

        #testing the status code of the reset password function
        self.assertEqual(response.status_code, 200)

    def test_favourites_GET(self):
        request = self.factory.get('/user/favourites/')
        request.user = self.user
        response = views.FavouritesView().get(request)

        #testing the status code of the index page
        self.assertEqual(response.status_code, 200)

    def test_bus_info_GET(self):
        pass
        # request = self.factory.get('/user/bus_info/')
        # request.user = self.user
        # response = views.BusInfoView().get(request)
        #
        # #testing the status code of the index page
        # self.assertEqual(response.status_code, 200)

    def test_bus_info_POST(self):
        request = self.factory.get('/user/bus_info/')
        request.user = self.user
        response = views.BusInfoView().post(request)

        #testing the status code of the bus information function
        self.assertEqual(response.status_code, 200)

    def test_favourite_stops_GET(self):
        pass
        # request = self.factory.get('/user/favourite_stop/')
        # request.user = self.user
        # response = views.FavoriteStopView().get(request)
        #
        # #testing the status code of the index page
        # self.assertEqual(response.status_code, 200)

    def test_favourite_stops_POST(self):
        pass
        # request = self.factory.get('/user/favourite_stop/')
        # request.user = self.user
        # response = views.FavoriteStopView().post(request)
        #
        # #testing the status code of the index page
        # self.assertEqual(response.status_code, 200)

    def test_favourite_stops_DELETE(self):
        pass
        # request = self.factory.get('/user/favourite_stop/')
        # request.user = self.user
        # response = views.FavoriteStopView().delete(request)
        #
        # #testing the status code of the index page
        # self.assertEqual(response.status_code, 200)

    def test_favourite_bus_num_GET(self):
        pass
        # request = self.factory.get('/user/favourite_bus_number/')
        # request.user = self.user
        # response = views.FavoriteBusNumberView().get(request)

        #testing the status code of the index page
        #self.assertEqual(response.status_code, 200)

    def test_favourite_bus_num_POST(self):
        pass
        # request = self.factory.get('/user/favourite_bus_number/')
        # request.user = self.user
        # response = views.FavoriteBusNumberView().post(request)

        #testing the status code of the index page
        #self.assertEqual(response.status_code, 200)

    def test_favourite_bus_num_DELETE(self):
        pass
        # request = self.factory.get('/user/favourite_bus_number/')
        # request.user = self.user
        # response = views.FavoriteBusNumberView().delete(request)
        #
        # #testing the status code of the index page
        # self.assertEqual(response.status_code, 200)

    def test_favourite_route_GET(self):
        pass
        # request = self.factory.get('/user/favorite_route/')
        # request.user = self.user
        # response = views.FavoriteRouteView().get(request)
        #
        # #testing the status code of the contact page
        # self.assertEqual(response.status_code, 200)

    def test_favourite_route_POST(self):
        pass
        # request = self.factory.get('/user/favorite_route/')
        # request.user = self.user
        # response = views.FavoriteRouteView().post(request)
        #
        # #testing the status code of the contact page
        # self.assertEqual(response.status_code, 200)

    def test_favourite_route_DELETE(self):
        pass
        # request = self.factory.get('/user/favorite_route/')
        # request.user = self.user
        # response = views.FavoriteRouteView().delete(request)
        #
        # #testing the status code of the contact page
        # self.assertEqual(response.status_code, 200)

    def test_contact_page_GET(self):
        request = self.factory.get('/user/contact/')
        request.user = self.user
        response = views.ContactUsView().get(request)

        #testing the status code of the contact page
        self.assertEqual(response.status_code, 200)

    def test_contact_page_POST(self):
        request = self.factory.get('/user/contact/')
        request.user = self.user
        response = views.ContactUsView().post(request)

        #testing the status code of the contact page
        self.assertEqual(response.status_code, 200)

    def test_stop_info_GET(self):
        request = self.factory.get('/user/stop_info/')
        request.user = self.user
        response = views.StopInfoView().get(request)

        #testing the status code of the contact page
        self.assertEqual(response.status_code, 200)

    def test_stop_info_POST(self):
        request = self.factory.get('/user/stop_info/')
        request.user = self.user
        response = views.StopInfoView().post(request)

        #testing the status code of the contact page
        self.assertEqual(response.status_code, 200)

    def test_stop_routes_GET(self):
        request = self.factory.get('/user/stops/')
        request.user = self.user
        response = views.StopsView().get(request)

        #testing the status code of the contact page
        self.assertEqual(response.status_code, 200)

if __name__ == '__main__':
    unittest.main(verbosity=2)
