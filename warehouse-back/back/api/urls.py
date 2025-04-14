from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from . import views

urlpatterns = [
    path('login/', obtain_auth_token, name='api_token_auth'),
    path('categories/', views.category_list, name='category-list'),
    path('categories/<int:pk>/', views.category_detail, name='category-detail'),
    path('products/', views.ProductList.as_view(), name='product-list'),
    path('products/<int:pk>/', views.ProductDetail.as_view(), name='product-detail'),
    path('product-items/', views.ProductItemList.as_view(), name='product-item-list'),
    path('product-items/<int:pk>/', views.ProductItemDetail.as_view(), name='product-item-detail'),
    path('product-movements/', views.ProductMovementList.as_view(), name='product-movement-list'),
    path('product-movements/<int:pk>/', views.ProductMovementDetail.as_view(), name='product-movement-detail'),
    path('users/', views.UserList.as_view(), name='user-list'),
    path('users/<int:pk>/', views.UserDetail.as_view(), name='user-detail'),
] 