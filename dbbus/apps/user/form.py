from django import forms

from captcha.fields import CaptchaField


#forget.html中，用于验证邮箱格式和验证码
class ForgetPwdForm(forms.Form):
    email=forms.EmailField(required=True)
    captcha=CaptchaField(error_messages={'invalid':'verify code error!'})
 
#reset.html中，用于验证新设的密码长度是否达标
class ResetPwdForm(forms.Form):
    new_pwd=forms.CharField(required=True,min_length=6,error_messages={'required': 'password can not been empty.', 'min_length': "at least 8 bits"})
    cnew_pwd = forms.CharField(required=True, min_length=6, error_messages={'required': 'password can not been empty.', 'min_length': "at least 8 bits"})
  
 
class ChangePwdForm(forms.Form):
    orignal_pwd = forms.CharField(required=True,min_length=8,max_length=20,error_messages={'required': 'password can not been empty.', 'min_length': "at least 8 bits"})
    new_pwd=forms.CharField(required=True,min_length=8,max_length=20,error_messages={'required': 'password can not been empty.', 'min_length': "at least 8 bits"})
    cnew_pwd = forms.CharField(required=True, min_length=6,max_length=20,error_messages={'required': 'password can not been empty.', 'min_length': "at least 8 bits"})  