from django.contrib import admin
from django.urls import path, include,re_path
from django.conf import settings
from django.conf.urls.static import static
from apps.user.views import IndexView
urlpatterns = [
    path('admin/', admin.site.urls),
    path('user/', include('user.urls',namespace='user')),
    path('prediction/', include('prediction.urls',namespace='prediction')),
    path('captcha/', include('captcha.urls')),
    path('',IndexView.as_view()),
    path('', include('pwa.urls')),
    path('foundation/', include('foundation.urls',namespace='foundation'))
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
