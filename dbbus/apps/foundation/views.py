from django.shortcuts import render
import re
import os
from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.mail import send_mail
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.template.context_processors import request
from django.urls import reverse
from django.views.generic import TemplateView
from itsdangerous import SignatureExpired, BadSignature
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from user.form import ForgetPwdForm,ResetPwdForm,ChangePwdForm
# from user.models import User, UserBusNumber, UserStop, UserRoute
from user.models import User, UserBusNumber, UserStop, UserRoute
import json
from django.http import QueryDict
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
class IndexView(TemplateView):
    '''首页'''

    def get(self, request):
        '''index page'''
        return render(request, 'index_foundation.html')

