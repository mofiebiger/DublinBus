from django.urls import path,re_path
from user import views
app_name = 'user'
urlpatterns = [
    path('', views.IndexView.as_view(),name = 'index_original'),# index page
    path('register', views.RegisterView.as_view(),name = 'register'), # register page
    path('index', views.IndexView.as_view(),name = 'index'),# index page
    path('login', views.LoginView.as_view(),name = 'login'),# login page
    path('active/<token>', views.ActiveView.as_view(),name = 'active'),# active function
    path('logout', views.LogoutView.as_view(),name = 'logout'),# logout page
    path('change_password', views.PasswordChangeView.as_view(),name = 'change_password'),# change password page
    path('forget_password', views.PasswordForgetView.as_view(),name = 'forget_password'),# forget password page
    path('reset_password/<token>', views.ResetPasswordView.as_view(),name = 'reset_password'),# reset password page
    path('change_avatar', views.AvatarUpdateView.as_view(),name = 'change_avatar'),# change avarta page
    path('favorite_stop', views.FavoriteStopView.as_view(),name = 'favorite_stop'),# change avarta page
    path('favorite_bus_number', views.FavoriteBusNumberView.as_view(),name = 'favorite_bus_number'),# change avarta page
    path('favorite_route', views.FavoriteRouteView.as_view(),name = 'favorite_route'),# change avarta page
    path('contact', views.ContactUsView.as_view(),name = 'ContactUsView'),# contact information
    path('stops', views.StopsView.as_view(), name = 'stops'),
    path('favourites', views.FavouritesView.as_view(), name = 'favourites'),
    path('bus_info', views.BusInfoView.as_view(), name = 'bus_info'),
    path('stop_info', views.StopInfoView.as_view(), name = 'stop_info'),

]
