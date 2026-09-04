"""URL routing for /api/accounts/ endpoints."""

from django.urls import path
from .views import (
    ConnectedAccountsListView,
    ConnectAccountView,
    DisconnectAccountView,
    SetPrimaryAccountView,
    AccountInfoView,
)

urlpatterns = [
    path('', ConnectedAccountsListView.as_view(), name='accounts-list'),
    path('connect/', ConnectAccountView.as_view(), name='accounts-connect'),
    path('<uuid:pk>/info/', AccountInfoView.as_view(), name='accounts-info'),
    path('<uuid:pk>/disconnect/', DisconnectAccountView.as_view(), name='accounts-disconnect'),
    path('<uuid:pk>/set-primary/', SetPrimaryAccountView.as_view(), name='accounts-set-primary'),
]
