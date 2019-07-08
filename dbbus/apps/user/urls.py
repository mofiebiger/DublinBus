from django.urls import path,re_path
from user import views
app_name = 'user'
urlpatterns = [
    path('register', views.RegisterView.as_view(),name = 'register'), # register page
    path('index', views.IndexView.as_view(),name = 'index'),# index page
    path('login', views.LoginView.as_view(),name = 'login'),# login page
    path('active/<token>', views.ActiveView.as_view(),name = 'active'),# active function
    path('logout', views.LogoutView.as_view(),name = 'logout'),# logout page
    path('change_password', views.PasswordChangeView.as_view(),name = 'change_password'),# change password page
    path('forget_password', views.PasswordForgetView.as_view(),name = 'forget_password'),# forget password page
    path('reset_password/<token>', views.ResetPasswordView.as_view(),name = 'reset_password'),# reset password page
    path('change_avatar', views.AvatarUpdateView.as_view(),name = 'change_avatar'),# change avarta page
    # path('favourites', views.FavouritesView.as_view(),name = 'favourites'),# favourites page
    # re_path('change_avatar', views.AvatarUpdateView.as_view(), name='change_avatar'),  # change avarta page

]

