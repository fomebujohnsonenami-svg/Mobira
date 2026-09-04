import logging
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import PermissionDenied
from django.http import Http404

logger = logging.getLogger('mobira.security')

def custom_exception_handler(exc, context):
    """
    Standardizes error responses and masks internal 500 exceptions,
    preventing SQL queries, stack traces, and internal server paths from leaking.
    """
    # Call REST framework's default exception handler first to get standard response
    response = exception_handler(exc, context)

    # If an unexpected exception occurred (response is None -> 500)
    if response is None:
        view = context.get('view')
        view_name = view.__class__.__name__ if view else 'UnknownView'
        request = context.get('request')
        path = request.path if request else 'UnknownPath'
        
        # Log full traceback internally for developer/security audit
        logger.error(
            f"Unhandled exception in {view_name} at {path}: {str(exc)}",
            exc_info=True,
            extra={
                'path': path,
                'method': request.method if request else 'Unknown',
                'user': str(getattr(request, 'user', 'Anonymous')),
            }
        )

        return Response(
            {
                "error": "An internal server error occurred. Please contact support if this persists.",
                "code": "INTERNAL_SERVER_ERROR",
                "status_code": 500,
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    # Standardize custom error payload for DRF handled exceptions (400, 401, 403, 404, 429)
    customized_data = {
        "status_code": response.status_code,
        "code": getattr(exc, 'default_code', 'ERROR').upper(),
    }

    if isinstance(response.data, dict):
        if 'detail' in response.data:
            customized_data['error'] = response.data['detail']
        else:
            customized_data['errors'] = response.data
            # Set top-level error summary
            first_key = next(iter(response.data))
            first_val = response.data[first_key]
            if isinstance(first_val, list) and len(first_val) > 0:
                customized_data['error'] = f"{first_key}: {first_val[0]}"
            else:
                customized_data['error'] = f"Validation failed on {first_key}"
    elif isinstance(response.data, list):
        customized_data['error'] = response.data[0] if response.data else "Validation error"
        customized_data['errors'] = response.data
    else:
        customized_data['error'] = str(response.data)

    response.data = customized_data
    return response
