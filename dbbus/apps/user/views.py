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
from user.models import User, UserBusNumber, UserStop, UserRoute


REGISTER_ENCRYPT_KEY = 'djhadhakjhfaliuehjdlaufajdhfalkfdkjiidd354/2p812p39weqklrjq/'
FORGET_PASSWORD_ENCRYPT_KEY = 'SDLFJAIAOINCAJDHFAIUifdack123/.df/2p812p39weqklrjq/'
#  
# # Create your views here.
# # request就是HttpRequest类型的对象
# # request包含浏览器请求的信息
# def index(request,email):
#     '''index page'''
#     print(email)
#     user = UserInfo.objects.get(user_Email = email)
#     user_staion = user.userstation_set.all()
#     user_stop = user.userstop_set.all()
#     user_route = user.userroute_set.all()
#     response = render(request, 'login/index.html',{'user':user,'user_station':user_staion,'user_stop':user_stop,'user_route':user_route})
#     return response
#  
# def login(request):
#     '''login page'''
#     return render(request, 'login/login_ajax.html', )
#  
#  
#  
# # /login_ajax_check
# def login_check(request):
#     '''ajax登录校验'''
#     # 1.获取用户名和密码
#     username = request.POST.get('username')
#     password = request.POST.get('password')
#  
#     # 2.进行校验,返回json数据
#     if UserInfo.objects.filter(user_Email = username).exists() and UserInfo.objects.filter(user_Email = username)[0].user_password == password:
#         # 用户名密码正确
#         return JsonResponse({'res':1})
#         # return redirect('/index') ajax请求在后台，不要返回页面或者重定向
#     else:
#         # 用户名或密码错误
#         return JsonResponse({'res':0})
#  
#  
# def sign_up(request):
#     '''sign up'''
#     return render(request, 'login/signup_ajax.html' )
#  
# def create_acount(request):
#     user_email = request.POST.get('email')
#     if UserInfo.objects.filter(user_Email = user_email).exists():
#             # 用户名密码正确
#             return JsonResponse({'res':0})
#             # return redirect('/index') ajax请求在后台，不要返回页面或者重定向
#     else:
#             user = UserInfo()
#             user.user_name = request.POST.get('username')
#             user.user_Email = request.POST.get('email')
#             user.user_password = request.POST.get('password')
#             user.save()
#             return JsonResponse({'res':1})
#  
class IndexView(TemplateView):  
    '''首页'''
    def get(self, request):
        '''index page'''
        return render(request, 'index.html')
            
        
        
# /user/register
class RegisterView(TemplateView):
    '''注册'''
    def get(self, request):
        '''显示注册页面'''
        return render(request, 'register.html')
  
    def post(self, request):
        '''进行注册处理'''
        # 接收数据
        username = request.POST.get('user_name')
        password = request.POST.get('pwd')
        r_password = request.POST.get('cpwd')
        email = request.POST.get('email')
        allow = request.POST.get('allow')
  
        # 进行数据校验
        if not all([username, password, email]):
            # 数据不完整
            return render(request, 'register.html', {'errmsg': 'Data is not complete'})
  
        # 校验邮箱
        if not re.match(r'^[a-z0-9][\w.\-]*@[a-z0-9\-]+(\.[a-z]{2,5}){1,2}$', email):
            return render(request, 'register.html', {'errmsg': 'the format of Email is not correct'})
        #check the password 
        if password != r_password:
            return render(request, 'register.html', {'errmsg': 'the passwords are not match'})
        # 校验用户名是否重复
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            # 用户名不存在
            user = None
            
        if user:
            # 用户名已存在
            return render(request, 'register.html', {'errmsg': 'the email has been regisetered'})
  
        # 进行业务处理: 进行用户注册

        user = User.objects.create_user(username, email, password)
        user.is_active = 0
        user.save()
  
        # 激活链接中需要包含用户的身份信息, 并且要把身份信息进行加密
  
        # encript the information about user，生成激活token
        serializer = Serializer(REGISTER_ENCRYPT_KEY, 3600)
        token = serializer.dumps(user.id).decode() # bytes
  
        # send email
        subject = 'Welcome to register dublin bus API'
        message = ''
        sender = settings.EMAIL_FROM
        receiver = [email]
        host_name = request.get_host()
        html_message = '<h1>'+username+', Welcome to be a member of us</h1>please click the link below to activate your account<br/><a href="http://'+host_name+'/user/active/'+token+'">http://'+host_name+'/user/active/'+token+'</a>' 
     
        send_mail(subject, message, sender, receiver, html_message=html_message)
          
        # 返回应答, 跳转到首页
        return redirect(reverse('user:login'))
  


  
class ActiveView(TemplateView):
    '''用户激活'''
    def get(self, request, token):
        '''进行用户激活'''
        # 进行解密，获取要激活的用户信息
        serializer = Serializer(REGISTER_ENCRYPT_KEY, 3600)
        try:
            # 获取待激活用户的id
            user_id = serializer.loads(token)
            user = User.objects.get(id=user_id) 
            if user.is_active == 1:
                return HttpResponse('your email has been verified')
            
            # 跳转到登录页面
            return render(request,'active.html',{'user':user})
        except SignatureExpired as e:
            # 激活链接已过期
            return HttpResponse('the date has been expired')
        except BadSignature as e:
            # 激活链接已过期
            return render(request,'404.html')
        
    def post(self, request, token):
            # 根据id获取用户信息
            serializer = Serializer(REGISTER_ENCRYPT_KEY, 3600)
            try:
                user_id = serializer.loads(token)
                user = User.objects.get(id=user_id)
                user.is_active = 1
                user.save()        
                return redirect(reverse('user:login'))
            except BadSignature as e:
                # 激活链接已过期
                return render(request,'404.html')
  
# /user/login
class LoginView(TemplateView):
    '''登录'''
    def get(self, request):
        '''显示登录页面'''
        # 判断是否记住了用户名
        if 'username' in request.COOKIES:
            username = request.COOKIES.get('username')
            checked = 'checked'
        else:
            username = ''
            checked = ''
  
        # 使用模板
        return render(request, 'index.html', {'username':username, 'checked':checked})
  
    def post(self, request):
        '''登录校验'''
        # 接收数据
        username = request.POST.get('username')
        password = request.POST.get('pwd')
        # 校验数据
        if not all([username, password]):
            return render(request, 'index.html', {'errmsg':'Data is not complete'}) 
        # 业务处理:登录校验
        user = authenticate(username=username, password=password)
        if user is not None:
            # 用户名密码正确
            if user.is_active:
                # 用户已激活
                # 记录用户的登录状态
                login(request, user)
                # 获取登录后所要跳转到的地址
                # 默认跳转到首页
                # 跳转到next_url
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
                return response
            else:
                # 用户未激活
                return render(request, 'index.html', {'errmsg':'Account has not been activated'})
        else:
            # 用户名或密码错误
            print('3')
            return render(request, 'index.html', {'errmsg':'username or password wrong'})
  
  
# /user/logout
class LogoutView(TemplateView):
    '''退出登录'''
    def get(self, request):
        '''退出登录'''
        # 清除用户的session信息
        logout(request)
  
        # 跳转到首页
        return redirect(reverse('user:index'))

# /user


class PasswordChangeView(LoginRequiredMixin, TemplateView):
    '''change password'''
    
    def get(self,request):
        change_password_form=ChangePwdForm()
        return render(request,'pwd_change.html',{'change_password_form':change_password_form})
    
    
    def post(self, request):
    
        username = request.user.username
        original_password = request.POST.get('original_pwd')
        new_password = request.POST.get('new_pwd')
        rnew_password = request.POST.get('cnew_pwd')  
             
        if not all([original_password,new_password, rnew_password]):
            return render(request, 'pwd_change.html', {'errmsg':'Data is not complete'}) 
        
        if new_password != rnew_password:
            return render(request, 'pwd_change.html', {'errmsg': 'the passwords are not match'})
        
        user = request.user
        if user.check_password(original_password):
            request.user.set_password(new_password)
            user.save()
        return render(request, 'index.html')

            
class PasswordForgetView(TemplateView):
    '''change password'''
     
    def get(self, request):
        ''''''
        forget_form=ForgetPwdForm()           
        return render(request, 'pwd_forget.html',{'forget_form':forget_form})
         
    def post(self, request):
        ''''''
        forget_form = ForgetPwdForm(request.POST)
        if forget_form.is_valid():
            email=request.POST.get('email')
            print(email)
            try:
                user = User.objects.get(email = email)
                print(email)
            except User.DoesNotExist:
                user = None
            
            if user:
                serializer = Serializer(FORGET_PASSWORD_ENCRYPT_KEY, 3600)
                token = serializer.dumps(user.id).decode() # bytes
          
                # 发邮件
                # 组织邮件信息
                subject = 'Password forgotten'
                message = ''
                sender = settings.EMAIL_FROM
                receiver = [email]
                host_name = request.get_host()
                html_message = '<h1'+username+', This email is used to reset your password!</h1>please click the link below to reset your password.<br/><a href="http://'+host_name+'/user/reset_password/'+token+'">http://'+host_name+'/user/reset_password/'+token+'</a>' 
             
                send_mail(subject, message, sender, receiver, html_message=html_message)
                return render(request,'send_success.html')

            return render(request,'pwd_forget.html',{'errormg':'email has not been found'})
        else:
            return render(request,'pwd_forget.html',{'forget_form':forget_form})
            


class ResetPasswordView(TemplateView):
    '''重置密码'''
    def get(self,request,token):
        serializer = Serializer(FORGET_PASSWORD_ENCRYPT_KEY, 3600)
        try:
            # 获取待激活用户的id
            user_id = serializer.loads(token)
            user = User.objects.get(id=user_id)            
            # 跳转到登录页面
            return render(request,'pwd_reset.html',{'user':user})
        except SignatureExpired as e:
            # 激活链接已过期
            return HttpResponse('the date has been expired')
        except BadSignature as e:
            # 激活链接已过期
            return render(request,'404.html')
        
        
    def post(self,request,token):
        reset_form=ResetPwdForm(request.POST)

        if reset_form.is_valid():
            new_password = request.POST.get('new_pwd')
            rnew_password = request.POST.get('cnew_pwd')

            if new_password != rnew_password:
                return render(request,'pwd_reset.html',{'msg':'password do not match！'})
            
            serializer = Serializer(FORGET_PASSWORD_ENCRYPT_KEY, 3600) 
            try:
                user_id = serializer.loads(token)
                user = User.objects.get(id=user_id)
                user.set_password(new_password)
                user.save()       
                return redirect(reverse('user:index'))
            
            except BadSignature as e:
                # 激活为坏
                return render(request,'404.html')

        else:
            return render(request,'pwd_reset.html',{'msg':reset_form.errors})                   

            
class AvatarUpdateView(LoginRequiredMixin, TemplateView):
    
    def post(self,request): 
        user = request.user
        avatar = request.FILES.get('avatar')
        if not all([avatar]):
           return HttpResponse('No image has been uploaded!') 
        try:
            avatar.name = user.username + '.' + avatar.name.split('.')[-1]
            user.user_profile = avatar
            user.save()
#             img_name = 'avatar/'+ avatar.name
#             image_path = os.path.join(settings.MEDIA_ROOT, img_name)
# #             print(a)
# 
#             with open(image_path,'wb') as f:
#                 f.write(avatar.read())
            print('ok')     
        except:
            return HttpResponse('error!')
                  
#         return JsonResponse(data)
        return render(request,'index.html')
     
       
    








