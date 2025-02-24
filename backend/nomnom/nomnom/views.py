from django.views.generic.base import View
from django.http import JsonResponse
import django

class RootView(View):
    """
    Root `/` endpoint for general API health check.
    """
    def get(self, request):
        return JsonResponse({"status": "ok", "service": "NomNom API", "version": "1.0.0"})