from django.urls import path
from recipes.views import RecipeSearch

urlpatterns = [
    path('search/', RecipeSearch.as_view(), name='recipe-search'),
]