from django.urls import path,re_path
from foundation import views
app_name = 'foundation'
urlpatterns = [
    path('index', views.IndexView.as_view(), name='index'),  # index page

]