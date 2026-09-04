from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import Recipient
from .serializers import RecipientSerializer

class RecipientListCreateView(generics.ListCreateAPIView):
    queryset = Recipient.objects.all()
    serializer_class = RecipientSerializer
    permission_classes = [AllowAny]

class RecipientDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Recipient.objects.all()
    serializer_class = RecipientSerializer
    permission_classes = [AllowAny]
