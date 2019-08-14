from django import forms

from captcha.fields import CaptchaField


#email address format validation
class ForgetPwdForm(forms.Form):
    email=forms.EmailField(required=True)
    captcha=CaptchaField(error_messages={'invalid':'verify code error!'})
 
#reset.html
# password length validation
class ResetPwdForm(forms.Form):
    new_pwd=forms.CharField(required=True,min_length=6,error_messages={'required': 'password can not been empty.', 'min_length': "at least 8 bits"})
    cnew_pwd = forms.CharField(required=True, min_length=6, error_messages={'required': 'password can not been empty.', 'min_length': "at least 8 bits"})
  
 
class ChangePwdForm(forms.Form):
    original_pwd = forms.CharField(required=True, error_messages={'required': 'The original password can not been empty.'})
    new_pwd=forms.CharField(required=True,min_length=8,max_length=20,error_messages={'required': ' The new password can not been empty.', 'min_length': "The new password must has at least 8 bits",'max_length': "The new password must has at most 20 bits"})
    rnew_pwd = forms.CharField(required=True, min_length=6,max_length=20,error_messages={'required': 'The comfirm password can not been empty.', 'min_length': "The comfirm password must has at least 8 bits",'max_length': "The comfirm password must has at most 20 bits"})  