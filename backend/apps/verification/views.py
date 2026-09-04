from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import VerificationLog
from .serializers import VerificationLogSerializer, PreflightRequestSerializer
from .services import VerificationEngine

class PreflightVerificationView(APIView):
    """
    Live anti-fraud pre-flight verification endpoint.
    Checks telephone subscriber identity or bank IBAN before sending payouts.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PreflightRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        engine = VerificationEngine()
        result = engine.verify_preflight(
            channel=serializer.validated_data['channel'],
            account_identifier=serializer.validated_data['account_identifier'],
            expected_name=serializer.validated_data.get('expected_name', '')
        )
        return Response(result, status=status.HTTP_200_OK)

class VerificationHistoryView(APIView):
    """Returns recent anti-fraud lookup history."""
    permission_classes = [AllowAny]

    def get(self, request):
        logs = VerificationLog.objects.all()[:25]
        return Response(VerificationLogSerializer(logs, many=True).data)

class PublicDirectoryLookupView(APIView):
    """Public lookup for verified partner badges."""
    permission_classes = [AllowAny]

    def get(self, request):
        q = request.query_params.get('q', '').strip()
        if not q:
            return Response({"error": "Query parameter 'q' is required."}, status=status.HTTP_400_BAD_REQUEST)

        engine = VerificationEngine()
        result = engine.verify_preflight(channel="BUSINESS_RCCM", account_identifier=q, expected_name=q)
        return Response(result)
