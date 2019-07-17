from django.contrib import admin
from .models import User,UserBusNumber,UserRoute,UserStop
# Register your models here.
admin.site.register(User)
admin.site.register(UserBusNumber)
admin.site.register(UserRoute)
admin.site.register(UserStop)