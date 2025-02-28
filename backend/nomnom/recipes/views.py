from django.http import HttpRequest
import requests
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.request import Request

class RecipeSearch(APIView):
    """
    Endpoint that accepts a list of ingredients and returns a recipe provided by the spoonacular API.
    """

    def get(self, request):
        searchRequest = request.query_params.get("searchRequest")

        if not searchRequest:
            return Response(
                {"error": "Please provide a recipe search request"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return self.get_recipe(searchRequest)
        
    def get_recipe(self, searchRequest):
        recipe_search_url = "https://api.spoonacular.com/recipes/autocomplete"

        queryParams = {
            "query": searchRequest,
            "apiKey": settings.SPOONACULAR_API_KEY,
            "number": 1,
        }

        try:
            res = requests.get(recipe_search_url, params=queryParams)
            res.raise_for_status()
            recipeId = res.json()[0]["id"]
            recipe_details_url = f"https://api.spoonacular.com/recipes/{recipeId}/information"
            res = requests.get(recipe_details_url, params={"apiKey": settings.SPOONACULAR_API_KEY})
        except Exception as e:
            return Response(
                {"error": "Failed to retrieve recipe"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(res.json(), status=status.HTTP_200_OK)