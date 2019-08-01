from django.urls import path,re_path
from prediction import views
app_name = 'prediction'
urlpatterns = [
    path('weather', views.WeatherInfoView.as_view(),name = 'weather'),# get_whether info from the darksky
    path('stop_info/<int:stop_id>', views.StopInfoView.as_view(),name = 'stop_info'),# get stop information,including stop address,stop_lan,etc
    path('route', views.PredictionRouteView.as_view(),name = 'route'),# predict the route
    re_path(r'stops_nearby.+$', views.StopInfoNearbyView.as_view(),name = 'stops_nearby'),# return the stops near the current location
]

