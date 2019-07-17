"""
Django settings for dbbus project.

Generated by 'django-admin startproject' using Django 2.2.2.

For more information on this file, see
https://docs.djangoproject.com/en/2.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.2/ref/settings/
"""

import os
import sys
from distutils.log import debug
import config
# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(BASE_DIR, 'apps'))
PWA_SERVICE_WORKER_PATH = os.path.join(BASE_DIR, 'static/js', 'serviceworker.js')

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config.secret_key

# STOP CREATING PYC FILES
sys.dont_write_bytecode = True

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []

# # quit the debug model
# # DEBUG=False
# ALLOWED_HOST=['*']


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
        'DIRS': [os.path.join(BASE_DIR, 'test_templates')],
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


# Database
# https://docs.djangoproject.com/en/2.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': config.name,
        'USER': config.user,
        'PASSWORD': config.password,
        'HOST': 'localhost',
#         'HOST': 'localhost',
        'PORT':5000,
    }
}


# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql_psycopg2',
#         'NAME': 'dublinbus',
#         'USER': 'postgres',
#         'PASSWORD': 'boldToads',
# #         'HOST': '137.43.49.60',
#         'HOST': 'localhost',
#         'PORT': 5000,
#     }
# }
# DATABASES = {
#      'default': {
#          'ENGINE': 'django.db.backends.mysql',
#          'NAME': 'dbbus1',
#          'USER': 'root',
#          'PASSWORD': 'jensen.jay8023',
#          'HOST': 'localhost',
#          'PORT': 3306,
#      }
# }

# django璁よ瘉绯荤粺浣跨敤鐨勬ā鍨嬬被

AUTH_USER_MODEL ='user.User'


# Password validation
# https://docs.djangoproject.com/en/2.2/ref/settings/#auth-password-validators

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
# https://docs.djangoproject.com/en/2.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.2/howto/static-files/

STATIC_URL = '/static/'
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')]


MEDIA_URL = '/media/' # 跟STATIC_URL类似，指定用户可以通过这个路径找到文件
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')


# 鍙戦�侀偖浠堕厤缃�
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# smpt鏈嶅姟鍦板潃
EMAIL_HOST = config.email_from
EMAIL_PORT = 25
# 鍙戦�侀偖浠剁殑閭
EMAIL_HOST_USER = config.email_host_user
# 鍦ㄩ偖绠变腑璁剧疆鐨勫鎴风鎺堟潈瀵嗙爜
EMAIL_HOST_PASSWORD = config.email_host_password
# 鏀朵欢浜虹湅鍒扮殑鍙戜欢浜�
EMAIL_FROM = config.email_from

EMAIL_USE_TLS = True



LOGIN_URL = '/user/login'
LOGOUT_REDIRECT_URL = '/user/index'



#SESSION_ENGINE = 'redis_sessions.session'
# redis服务的ip地址
#SESSION_REDIS = {
#    'host': 'localhost',
#     'host': '137.43.49.60',
#    'port': 6379,
#    'db': 2,
#    'password': '',
#    'prefix': 'session5',
#    'socket_timeout': 3
#}
