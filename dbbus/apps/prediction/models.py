from django.db import models

# Create your models here.

class StopInformation(models.Model): 
    stop_id = models.IntegerField(verbose_name='stop_id',null = False,unique=True)
    stop_name = models.CharField(max_length = 255,verbose_name='stop_name',null = False)
    stop_name_localized = models.CharField(max_length = 255,verbose_name='stop_name_localized',null = True)
    stop_lat = models.DecimalField(verbose_name='stop_lat',null = False,max_digits=13,decimal_places=10)
    stop_lon = models.DecimalField(verbose_name='stop_lon',null = False,max_digits=13,decimal_places=10)
    stop_routes = models.CharField(max_length = 255,verbose_name='stop_routes',null = True)
     
     
    class Meta:
        managed = True
        db_table = 'stop_information'

        
        
class Leavetimes(models.Model):
    dayofservice = models.TextField(blank=True, null=True)
    tripid = models.TextField(blank=True, null=True)
    progrnumber = models.TextField(blank=True, null=True)
    stoppointid = models.TextField(blank=True, null=True)
    plannedtime_arr = models.TextField(blank=True, null=True)
    plannedtime_dep = models.TextField(blank=True, null=True)
    actualtime_arr = models.TextField(blank=True, null=True)
    actualtime_dep = models.TextField(blank=True, null=True)
    vehicleid = models.TextField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'leavetimes'
        
        
        
class Trips(models.Model):
    dayofservice = models.TextField(blank=True, null=True)
    tripid = models.TextField(blank=True, null=True)
    lineid = models.TextField(blank=True, null=True)
    routeid = models.TextField(blank=True, null=True)
    direction = models.TextField(blank=True, null=True)
    plannedtime_arr = models.TextField(blank=True, null=True)
    plannedtime_dep = models.TextField(blank=True, null=True)
    actualtime_arr = models.TextField(blank=True, null=True)
    actualtime_dep = models.TextField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'trips'
        
        
        
class Vehicles(models.Model):
    dayofservice = models.TextField(blank=True, null=True)
    vehicleid = models.TextField(blank=True, null=True)
    distance = models.TextField(blank=True, null=True)
    minutes = models.TextField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'vehicles'
        
        
        
        
class BusRouteNumber(models.Model):
    route = models.CharField(max_length=10,verbose_name='route',null = False)
    origin = models.CharField(max_length=50,verbose_name='origin',null = False)
    destination = models.CharField(max_length=50,verbose_name='destination',null = False)
    stops = models.CharField(max_length = 2000,verbose_name='stops',null = False)
    stop_number = models.IntegerField(verbose_name='stop_number',null = False)
    class Meta:
        db_table = 'bus_route'
        verbose_name = 'bus_route'
        verbose_name_plural = verbose_name