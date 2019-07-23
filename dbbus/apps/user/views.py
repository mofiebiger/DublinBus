import json
import os
import re

from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.mail import send_mail
from django.http import HttpResponse, JsonResponse
from django.http import QueryDict
from django.shortcuts import render, redirect
from django.template.context_processors import request
from django.urls import reverse
from django.views.generic import TemplateView
from itsdangerous import SignatureExpired, BadSignature
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer

import config
from user.form import ForgetPwdForm, ResetPwdForm, ChangePwdForm
from user.models import User, UserBusNumber, UserStop, UserRoute
# from user.models import User, UserBusNumber, UserStop, UserRoute

REGISTER_ENCRYPT_KEY = config.register_encrypt_key
FORGET_PASSWORD_ENCRYPT_KEY = config.forget_password_encrypt_key

#/user/index or ''
class IndexView(TemplateView):
    '''index page'''
    def get(self, request):
        '''index page'''
        return render(request, 'index.html')




class TourismView(TemplateView):
    def get(self, request):
        return render(request, 'tourismPage.html')

class serviceWorker(TemplateView):
    template_name = 'js/serviceworker.js'
    content_type = 'application/javascript'



# /user/register
class RegisterView(TemplateView):
    '''register page '''
    def get(self, request):
        '''show the register page'''
        return render(request, 'register.html')

    def post(self, request):
        '''process the registration request'''

        # recieve the data and get the data
        username = request.POST.get('user_name')
        password = request.POST.get('pwd')
        r_password = request.POST.get('cpwd')
        email = request.POST.get('email')

        if not all([username, password, email]):
            # if the data is not complete,return the error information
            return JsonResponse({"res": 0, "error_msg": "Data not complete."});
            # verify the email format
        if not re.match(r'^[a-z0-9][\w.\-]*@[a-z0-9\-]+(\.[a-z]{2,5}){1,2}$', email):
            return JsonResponse({"res": 0, "error_msg": "The format of Email is not correct."});
        # check the password whether they are the same
        if password != r_password:
            return JsonResponse({"res": 0, "error_msg": "the passwords are not match."});
        # check if the user already exists.
        try:
            user = User.objects.get(username=username)
            print('user')
        except User.DoesNotExist:
            # if user does not exist in the database ,set the the user as None
            user = None

        if user:
            # if user already exists, return the error message
            return JsonResponse({"res": 0, "error_msg": username + ' has been registered.'});
            # return HttpResponse("the email has benn registered..");

        # if user does not exist, do the next step,do the registration
        user = User.objects.create_user(username, email, password)
        user.is_active = 0
        user.save()

         # send the active email,and encrypt user content information
        try:
             # encript the information about user
            serializer = Serializer(REGISTER_ENCRYPT_KEY, 3600)
            token = serializer.dumps(user.id).decode()  # bytes

            # send email
            subject = 'Welcome to register dublin bus API'
            message = ''
            sender = settings.EMAIL_FROM
            receiver = [email]
            host_name = request.get_host()
            html_message = '<h1>' + username + ', Welcome to be a member of us</h1>please click the link below to activate your account<br/><a href="http://' + host_name + '/user/active/' + token + '">http://' + host_name + '/user/active/' + token + '</a>'

            send_mail(subject, message, sender, receiver, html_message=html_message)


            return JsonResponse({"res": 1})
        except:
            return JsonResponse({"res": 0, "error_msg":"send email failed"})


#user/active/<token>
class ActiveView(TemplateView):
    '''user activation'''
    def get(self, request, token):
        '''get user activation page'''
        # decrypt the user information
        serializer = Serializer(REGISTER_ENCRYPT_KEY, 3600)
        try:
            # get the user's id
            user_id = serializer.loads(token)
            user = User.objects.get(id=user_id)

            #if the user is already activated,return the error message
            if user.is_active == 1:
                return JsonResponse({"res": 0, "error_msg":"your email has been verified"})

            # if the user is activated successfully, return the successful information.
            return JsonResponse({"res": 1,"user":user})
        except SignatureExpired as e:
            # activation link has expired
            return JsonResponse({"res": 0, "error_msg":'the date has been expired'})
        except BadSignature as e:
            # link is not correct,return the not found page
            return render(request,'404.html')

    def post(self, request, token):
        '''get the user information to activate it'''
            # get the user information from the id
        serializer = Serializer(REGISTER_ENCRYPT_KEY, 3600)
        try:
            # decrypt the user information
            user_id = serializer.loads(token)
            user = User.objects.get(id=user_id)
            user.is_active = 1
            user.save()
             # if the user is activated successfully, return the successful information.
            return JsonResponse({"res": 1})
        except BadSignature as e:
            # link is not correct,return the not found page
            return render(request,'404.html')

# /user/login
class LoginView(TemplateView):
    '''login page'''
    def get(self, request):
        '''show the login page'''
        # check if the 'remember name' checkbox is active
        if 'username' in request.COOKIES:
            username = request.COOKIES.get('username')
            checked = 'checked'
        else:
            username = ''
            checked = ''

        # return the information
        return render(request, 'login.html')
        # return JsonResponse({'username':username, 'checked':checked})

    def post(self, request):
        '''process the login'''

        # get the user data
        username = request.POST.get('username')
        password = request.POST.get('pwd')

        # verify the data,check if they are complete
        if not all([username, password]):
            return JsonResponse({"res": 0, "error_msg":'Data is not complete'})
        # login verification
        user = authenticate(username=username, password=password)
        if user is not None:
            # if the username and password are correct
            if user.is_active:
                # check if the user's email is active
                # store the user's login status
                login(request, user)
                # aquire the url after login
                # go to the index page as default.
                # go to the next_url
                next_url = request.GET.get('next', reverse('user:index'))
                # 跳转到next_url
                response = redirect(next_url) # HttpResponseRedirect
                # 判断是否需要记住用户名
                remember = request.POST.get('remember')

                if remember == 'on':
                    # 记住用户名
                    response.set_cookie('username', username, max_age=7*24*3600)
                else:
                    response.delete_cookie('username')

                # 返回response
                return JsonResponse({"res": 0})
                # return response
            else:
                # 用户未激活
                return JsonResponse({"res": 1, 'errmsg': 'Account has not been activsted'})
                # return render(request, 'login.html', {'errmsg':'Account has not been activated'})
        else:
            # 用户名或密码错误
            print('3')
            return render(request, 'login.html', {'errmsg':'username or password wrong'})


# /user/logout
class LogoutView(TemplateView):
    '''login out'''

    def get(self, request):
        '''login out'''
        # clear user's session information
        logout(request)

        # go to index page
        return redirect(reverse('user:index'))


# /user/change_password
class PasswordChangeView(LoginRequiredMixin, TemplateView):
    '''change password'''

    def get(self,request):
        '''get the password change page'''
        change_password_form=ChangePwdForm()
        return render(request,'pwd_change.html',{'change_password_form':change_password_form})


    def post(self, request):
        '''process the password modification'''
        # get the user data
        username = request.user.username
        original_password = request.POST.get('original_pwd')
        new_password = request.POST.get('new_pwd')
        rnew_password = request.POST.get('cnew_pwd')

        # verify the data,check if they are complete
        if not all([original_password,new_password, rnew_password]):
            return JsonResponse({"res": 0, "error_msg":'Data is not complete'})

        # check the password whether they are the same
        if new_password != rnew_password:
            return JsonResponse({"res": 0, "error_msg":'the passwords are not match'})

        #if everything is good,then process the password modification
        user = request.user
        if user.check_password(original_password):
            request.user.set_password(new_password)
            user.save()
        return JsonResponse({"res": 1})



# /user/forget_password
class PasswordForgetView(TemplateView):
    '''forget password page'''

    def get(self, request):
        '''get the password forget page'''
        forget_form=ForgetPwdForm()
        return render(request, 'pwd_forget.html',{'forget_form':forget_form})

    def post(self, request):
        '''process resetting the password of user '''
        forget_form = ForgetPwdForm(request.POST)

        #check if the value is correct
        if forget_form.is_valid():
            email=request.POST.get('email')
            try:
                user = User.objects.get(email = email)
            except User.DoesNotExist:
                user = None

            if user:
                serializer = Serializer(FORGET_PASSWORD_ENCRYPT_KEY, 3600)
                token = serializer.dumps(user.id).decode() # bytes

                # send email
                subject = 'Password forgotten'
                message = ''
                sender = settings.EMAIL_FROM
                receiver = [email]
                host_name = request.get_host()
                # html_message = '<h1'+username+', This email is used to reset your password!</h1>please click the link below to reset your password.<br/><a href="http://'+host_name+'/user/reset_password/'+token+'">http://'+host_name+'/user/reset_password/'+token+'</a>'

                # send_mail(subject, message, sender, receiver, html_message=html_message)
                return render(request,'send_success.html')

            return render(request,'pwd_forget.html',{'errormg':'email has not been found'})
        else:
            return render(request,'pwd_forget.html',{'forget_form':forget_form})


#/user/reset_password/<token>
class ResetPasswordView(TemplateView):
    '''reset password page'''

    def get(self,request,token):

        serializer = Serializer(FORGET_PASSWORD_ENCRYPT_KEY, 3600)
        try:
            # decrypt the user information,get the user id
            user_id = serializer.loads(token)
            user = User.objects.get(id=user_id)
            # go to the reset password page
            return render(request,'pwd_reset.html',{'user':user})
        except SignatureExpired as e:
            # check if the link is expired
            return JsonResponse({"res": 0, "error_msg":'the date has been expired'})
        except BadSignature as e:
            # link is not correct,return the not found page
            return render(request,'404.html')


    def post(self,request,token):

        reset_form=ResetPwdForm(request.POST)

        #check if the user information is complete
        if reset_form.is_valid():
            new_password = request.POST.get('new_pwd')
            rnew_password = request.POST.get('cnew_pwd')

            if new_password != rnew_password:
                return JsonResponse({"res": 0, "error_msg":'the passwords are not match'})

            serializer = Serializer(FORGET_PASSWORD_ENCRYPT_KEY, 3600)
            try:
                user_id = serializer.loads(token)
                user = User.objects.get(id=user_id)
                user.set_password(new_password)
                user.save()
                return JsonResponse({"res": 1})

            # check if the link is valid
            except BadSignature as e:
                return render(request,'404.html')

        else:
            return JsonResponse({"res": 0, "error_msg":'the data has some error'})




class AvatarUpdateView(LoginRequiredMixin, TemplateView):
    '''avatar change page'''

    def post(self,request):
        '''update the avatar'''

        #get the avatar file
        user = request.user
        avatar = request.FILES.get('avatar')

        #check if the user information is complete
        if not all([avatar]):
           return JsonResponse({"res": 0, "error_msg":'No image has been uploaded!'})
        try:
            avatar.name = user.username + '.' + avatar.name.split('.')[-1]
            user.user_profile = avatar
            user.save()
            return JsonResponse({"res": 1})
        except:
            return JsonResponse({"res": 0, "error_msg":'avatar updates fail !'})


class FavouritesView(LoginRequiredMixin, TemplateView):
        def get(self, request):
            '''favourites page'''
            return render(request, 'favourites.html')


class TestView(TemplateView):
        def get(self, request):
            '''favourites page'''
            return render(request, 'test_map.html')

        def query(request):
            r = request.GET.get("toolsname")
            name_dict = "123"
            return JsonResponse(name_dict)


class BusInfoView(LoginRequiredMixin, TemplateView):
    def get(self, request):

        stops = UserStop.objects.filter(station_user=request.user)
        stops = list(stops)
        stop_list = [stop.stop for stop in stops]
        json_file = {"user_stop_list": stop_list}
        return JsonResponse(json_file)

    def post(self, request):

        bus_id = request.POST.get('bus_id')
        return HttpResponse(bus_id)


#/user/favorite_stop
class FavoriteStopView(LoginRequiredMixin, TemplateView):
    '''store the favorite stops of user'''

    def get(self, request):
        '''return the user's favortie stop list'''

        #get the stop information from the database
        stops = UserStop.objects.filter(station_user=request.user)
        stops = list(stops)
        stop_list = [stop.stop for stop in stops]
        json_file = {"user_stop_list": stop_list}
        return JsonResponse(json_file)

    def post(self, request):
        '''add new stop information'''

        stop_id = request.POST.get('stop_id')
        #check if the stop is already in the list
        if UserStop.objects.filter(stop=stop_id, station_user=request.user).exists():
            return JsonResponse({"res":0,"error_msg":'stop exists already'})

        #everything goes well, store the stop info into database
        user_stop = UserStop(stop=stop_id, station_user=request.user)
        user_stop.save()
        return JsonResponse({"res":1})

    def delete(self, request):
        '''remove the stop from the favorite list'''

        #get the stop info
        DELETE = QueryDict(request.body)
        stop_id = DELETE.get('stop_id')

        #check if the stop is  in the list
        if not UserStop.objects.filter(stop=stop_id, station_user=request.user).exists():
            return JsonResponse({"res":0,"error_msg":'stop does not exist'})

        #everything goes well, delete the stop info from database
        UserStop.objects.get(stop=stop_id, station_user=request.user).delete()
        return JsonResponse({"res":1})

#/user/favorite_bus_number
class FavoriteBusNumberView(LoginRequiredMixin, TemplateView):
    '''store the favorite bus numbers of user'''

    def get(self, request):
        '''return the user's favortie bus list'''

         #get the stop information from the database
        buses = UserBusNumber.objects.filter(bus_number_user=request.user)
        buses = list(buses)
        buses_list = [{'bus_number': bus.bus_number, 'start_point': bus.start_point, 'end_point': bus.end_point} for bus
                      in buses]
        json_file = {"user_bus_list": buses_list}
        return JsonResponse(json_file)

    def post(self, request):
        '''add new bus information'''
        #get the bus info
        bus_number = request.POST.get('bus_number')
        start_point = request.POST.get('start_point')
        end_point = request.POST.get('end_point')

        #check if the bus is already in the list
        if UserBusNumber.objects.filter(bus_number=bus_number, start_point=start_point, end_point=end_point,
                                        bus_number_user=request.user).exists():
            return JsonResponse({"res":0,"error_msg":'bus exists already'})

        #everything goes well, store the stop info into database
        user_bus_number = UserBusNumber(bus_number=bus_number, start_point=start_point, end_point=end_point,
                                        bus_number_user=request.user)
        user_bus_number.save()
        return JsonResponse({"res":1})

    def delete(self, request):
        '''remove the bus number from the favorite list'''

        #get the bus info
        DELETE = QueryDict(request.body)
        bus_number = DELETE.get('bus_number')
        start_point = DELETE.get('start_point')
        end_point = DELETE.get('end_point')

        #check if the bus is  in the list
        if not UserBusNumber.objects.filter(bus_number=bus_number, start_point=start_point, end_point=end_point,
                                            bus_number_user=request.user).exists():
            return JsonResponse({"res":0,"error_msg":'bus number does not exist'})

        #everything goes well, delete the stop info from database
        UserBusNumber.objects.get(bus_number=bus_number, start_point=start_point, end_point=end_point,
                                  bus_number_user=request.user).delete()
        return JsonResponse({"res":1})


#/user/favorite_route
class FavoriteRouteView(LoginRequiredMixin, TemplateView):
    '''store the favorite routes of user'''

    def get(self, request):
        '''return the user's favortie route list'''

         #get the stop information from the database
        routes = UserRoute.objects.filter(route_user=request.user)
        routes = list(routes)
        routes_list = [{'route_start': route.route_start, 'route_end': route.route_end} for route in routes]
        json_file = {"user_routes_list": routes_list}
        return JsonResponse(json_file)

    def post(self, request):
        '''add new route information'''
        #get the bus info
        route_start = request.POST.get('route_start')
        route_end = request.POST.get('route_end')

        #check if the stop is already in the list
        if UserRoute.objects.filter(route_start=route_start, route_end=route_end, route_user=request.user).exists():
            return JsonResponse({"res":0,"error_msg":'route exists already'})

        #everything goes well, store the stop info into database
        user_route = UserRoute(route_start=route_start, route_end=route_end, route_user=request.user)
        user_route.save()
        return JsonResponse({"res":1})

    def delete(self, request):
        '''remove the route from the favorite list'''

        #get the bus info
        DELETE = QueryDict(request.body)
        route_start = DELETE.get('route_start')
        route_end = DELETE.get('route_end')

        #check if the bus is  in the list
        if not UserRoute.objects.filter(route_start=route_start, route_end=route_end, route_user=request.user).exists():
            return JsonResponse({"res":0,"error_msg":'route does not exist'})

        UserRoute.objects.get(route_start=route_start, route_end=route_end, route_user=request.user).delete()
        return JsonResponse({"res":1})


class ContactUsView(LoginRequiredMixin, TemplateView):
    '''contact information'''
    def post(self, request):

        user = request.user
        contact = request.POST.get('contact')
        print(contact)
        if not contact:
            return JsonResponse({"res":0,"error_msg":'no information'})
        try:
            subject = 'Contact information-from ' + user.username + "-email:" + user.email
            message = contact
            sender = settings.EMAIL_FROM
            print(sender)
            receiver = [settings.EMAIL_FROM]
            print(receiver)
            send_mail(subject, message, sender, receiver)
        except Exception as e:
            print(e)
            return JsonResponse({"res":0,"error_msg":'information sent error! please try again'})

        #         return JsonResponse(data)
        return JsonResponse({"res":1,"success_msg":'Your message has been sent to the manager,we are very thankful, and we will contact to you as soon as possible!'})


#
# def set_session(request):
#     request.session['username'] = 'reanjie'
#     request.session['age'] = '18'
#     return HttpResponse('set sessions')
#
# def get_session(request):
#     username = request.session['username']
#     age = request.session['age']
#     return HttpResponse(username+':'+age)
