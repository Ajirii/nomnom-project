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
        ingredients = request.query_params.get("ingredients")

        if not ingredients:
            return Response(
                {"error": "Please provide a list of ingredients"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return self.get_recipe(ingredients)
        
    def get_recipe(self, ingredients):
        url = "https://api.spoonacular.com/recipes/findByIngredients"

        # retrieve 1 recipe from the spoonacular API using only the provided ingredients if possible
        queryParams = {
            "ingredients": ingredients,
            "number": 1,
            "apiKey": settings.SPOONACULAR_API_KEY,
            "ranking": 2,
        }

        try:
            res = requests.get(url, params=queryParams)
            res.raise_for_status()
            recipe = res.json()
        except Exception as e:
            return Response(
                {"error": "Failed to retrieve recipe"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(recipe, status=status.HTTP_200_OK)