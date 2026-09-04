from django.urls import path
from .views import RecipientListCreateView, RecipientDetailView

urlpatterns = [
    path('', RecipientListCreateView.as_view(), name='recipient-list-create'),
    path('<uuid:pk>/', RecipientDetailView.as_view(), name='recipient-detail'),
]
