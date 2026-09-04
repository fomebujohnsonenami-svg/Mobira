from django.urls import path
from .views import (
    BusinessListView,
    BusinessDetailView,
    CurrentBusinessProfileView,
    PublicBusinessProfileView,
    BusinessOnboardingView,
    ConnectedAccountsListView,
    ConnectAccountView,
    DisconnectAccountView,
    SetPrimaryAccountView,
)

urlpatterns = [
    path('', BusinessListView.as_view(), name='business-list'),
    path('profile/', CurrentBusinessProfileView.as_view(), name='business-current-profile'),
    path('onboard/', BusinessOnboardingView.as_view(), name='business-onboard'),
    path('public/<str:business_id>/', PublicBusinessProfileView.as_view(), name='business-public-profile'),
    path('connected-accounts/', ConnectedAccountsListView.as_view(), name='connected-accounts-list'),
    path('connected-accounts/connect/', ConnectAccountView.as_view(), name='connected-accounts-connect'),
    path('connected-accounts/<uuid:pk>/disconnect/', DisconnectAccountView.as_view(), name='connected-accounts-disconnect'),
    path('connected-accounts/<uuid:pk>/set-primary/', SetPrimaryAccountView.as_view(), name='connected-accounts-set-primary'),
    path('<uuid:pk>/', BusinessDetailView.as_view(), name='business-detail'),
]
