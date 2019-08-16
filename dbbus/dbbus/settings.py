import os
import sys
from distutils.log import debug
import config
# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(BASE_DIR, 'apps'))
PWA_SERVICE_WORKER_PATH = os.path.join(BASE_DIR, 'templates', 'serviceworker.js')

# SECURITY WARNING: keep the secretu key used in production secret!
SECRET_KEY = config.secret_key

# STOP CREATING PYC FILES
sys.dont_write_bytecode = True


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# # quit the debug model
# # DEBUG=False

ALLOWED_HOSTS = ['*']

GOOGLE_MAPS_API_KEY = config.map_api_key

PWA_APP_NAME = 'Dublin Bus'
PWA_APP_SHORT_NAME = 'DB Bus'
PWA_APP_DESCRIPTION = "Dublin Bus Progressive Web App"
PWA_APP_THEME_COLOR = '#26428b'
PWA_APP_BACKGROUND_COLOR = '#26428b'
PWA_APP_DISPLAY = 'standalone'
PWA_APP_SCOPE = '/'
PWA_APP_ORIENTATION = 'any'
PWA_APP_START_URL = '/'
PWA_APP_ICONS = [{
'src': '/static/images/android-chrome-192x192.png',
'sizes': '192x192',
'type': 'image/png'
},
{
'src': '/static/images/android-launchericon-512-512.png',
'sizes': '512x512',
'type': 'image/png'
},
{
'src': '/static/images/apple-touch-icon-114x114.png',
'sizes': '114x114',
'type': 'image/png'
},
]
PWA_APP_SPLASH_SCREEN = [
{
'src': '/static/images/splash/Windows10/SplashScreen.scale-125.png',
'media': '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)'
}
]
PWA_APP_DIR = 'ltr'
PWA_APP_LANG = 'en-US'

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'user',
    'captcha',
    'prediction',
    'pwa',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'dbbus.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'dbbus.wsgi.application'


if 'TRAVIS' in os.environ:
    DATABASES = {
        'default': {
            'ENGINE':   'django.db.backends.postgresql_psycopg2',
            'NAME':     'travisdb',  # Must match travis.yml setting
            'USER':     'postgres',
            'PASSWORD': '',
            'HOST':     'localhost',
            'PORT':     '',
        }
    }
else:
    DATABASES = {
        'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': config.name,
        'USER': config.user,
        'PASSWORD': config.password,
        'HOST': 'localhost',
        'PORT':5000,
        }
    }

AUTH_USER_MODEL ='user.User'

# Password validation

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)

STATIC_URL = '/static/'
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')]

MEDIA_URL = '/media/' # this url is used to store the avatar image
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# the email deployment
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# email host and port
EMAIL_HOST = config.email_host
EMAIL_PORT = 587
# email address
EMAIL_HOST_USER = config.email_host_user
# password
EMAIL_HOST_PASSWORD = config.email_host_password
# email address
EMAIL_FROM = config.email_from


EMAIL_USE_TLS = True

LOGIN_URL = '/user/login'
LOGOUT_REDIRECT_URL = '/user/index'

#SESSION_ENGINE = 'redis_sessions.session'
# redis ip address
#SESSION_REDIS = {
#    'host': 'localhost',
#     'host': '137.43.49.60',
#    'port': 6379,
#    'db': 2,
#    'password': '',
#    'prefix': 'session5',
#    'socket_timeout': 3
#}
