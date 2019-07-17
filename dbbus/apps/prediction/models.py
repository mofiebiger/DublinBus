from django.db import models

# Create your models here.

class StopInformation(models.Model): 
    actual_stop_id = models.IntegerField(verbose_name='actual_stop_id',null = False)
    stop_id = models.CharField(max_length = 255,verbose_name='stop_id',null = False)
    stop_name = models.CharField(max_length = 255,verbose_name='stop_name',null = False)
    stop_lat = models.DecimalField(verbose_name='stop_lat',null = False,max_digits=19,decimal_places=15)
    stop_lon = models.DecimalField(verbose_name='stop_lon',null = False,max_digits=19,decimal_places=15)
     
     
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