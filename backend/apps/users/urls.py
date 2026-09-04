from django.urls import path
from .views import RegisterView, LoginView, DemoLoginView, CurrentUserView, DemoUsersListView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth-register'),
    path('login/', LoginView.as_view(), name='auth-login'),
    path('demo-login/', DemoLoginView.as_view(), name='auth-demo-login'),
    path('me/', CurrentUserView.as_view(), name='auth-me'),
    path('demo-users/', DemoUsersListView.as_view(), name='auth-demo-users'),
]
