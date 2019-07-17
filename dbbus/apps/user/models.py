from django.contrib.auth.models import AbstractUser
from django.db import models



# Create your models here.
class User(AbstractUser,models.Model):
    '''this class is used to store the information about the users'''

    
    user_profile = models.ImageField(verbose_name='user_image',  upload_to='avatar',default = 'default.jpg')

    class Meta:
        db_table = 'user_information'
        verbose_name = 'user_information'
        verbose_name_plural = verbose_name

class UserBusNumber(models.Model):
    bus_number = models.CharField(max_length=10,verbose_name='favorite_bus_number',null = False)
    start_point = models.CharField(max_length=50,verbose_name='start_point',null = False)
    end_point = models.CharField(max_length=50,verbose_name='end_point',null = False)
    bus_number_user = models.ForeignKey('User',on_delete=models.CASCADE)
    
    class Meta:
        db_table = 'favorite_bus_number'
        verbose_name = 'favorite_bus_number'
        verbose_name_plural = verbose_name
    
class UserRoute(models.Model):
    route_start = models.CharField(max_length=50,verbose_name='route_start',null = False)
    route_end  = models.CharField(max_length=50,verbose_name='route_end',null = False)
    route_user = models.ForeignKey('User',on_delete=models.CASCADE)

    class Meta:
        db_table = 'favorite_route'
        verbose_name = 'favorite_route'
        verbose_name_plural = verbose_name    

class UserStop(models.Model):
    stop = models.IntegerField(verbose_name='favorite_stop',null = False,unique = True)
    station_user = models.ForeignKey('User',on_delete=models.CASCADE)
    
    class Meta:
        db_table = 'favorite_stop'
        verbose_name = 'favorite_stop'
        verbose_name_plural = verbose_name    
    
   
    
