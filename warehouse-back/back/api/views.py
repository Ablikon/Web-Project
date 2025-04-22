from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from .models import *
from .serializers import *
from .permissions import IsAdminUser, IsStorekeeperUser

# Create your views here.

# FBV for Category
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def category_list(request):
    if request.method == 'GET':
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)
    
    if request.method == 'POST':
        if not request.user.role == User.ADMIN:
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def category_detail(request, pk):
    try:
        category = Category.objects.get(pk=pk)
    except Category.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CategorySerializer(category)
        return Response(serializer.data)

    if not request.user.role == User.ADMIN:
        return Response(status=status.HTTP_403_FORBIDDEN)

    if request.method == 'PUT':
        serializer = CategorySerializer(category, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        category.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# CBV for Product
class ProductList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        products = Product.objects.all()
        serializer = ProductModelSerializer(products, many=True)
        return Response(serializer.data)

    def post(self, request):
        if not request.user.role == User.ADMIN:
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer = ProductModelSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProductDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return None

    def get(self, request, pk):
        product = self.get_object(pk)
        if not product:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ProductModelSerializer(product)
        return Response(serializer.data)

    def put(self, request, pk):
        if not request.user.role == User.ADMIN:
            return Response(status=status.HTTP_403_FORBIDDEN)
        product = self.get_object(pk)
        if not product:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ProductModelSerializer(product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        if not request.user.role == User.ADMIN:
            return Response(status=status.HTTP_403_FORBIDDEN)
        product = self.get_object(pk)
        if not product:
            return Response(status=status.HTTP_404_NOT_FOUND)
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# CBV for ProductItem
class ProductItemList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        items = ProductItem.objects.all()
        serializer = ProductItemModelSerializer(items, many=True)
        return Response(serializer.data)

    def post(self, request):
        if not request.user.role == User.ADMIN:
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer = ProductItemModelSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProductItemDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return ProductItem.objects.get(pk=pk)
        except ProductItem.DoesNotExist:
            return None

    def get(self, request, pk):
        item = self.get_object(pk)
        if not item:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ProductItemModelSerializer(item)
        return Response(serializer.data)

    def put(self, request, pk):
        if not request.user.role == User.ADMIN:
            return Response(status=status.HTTP_403_FORBIDDEN)
        item = self.get_object(pk)
        if not item:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ProductItemModelSerializer(item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        if not request.user.role == User.ADMIN:
            return Response(status=status.HTTP_403_FORBIDDEN)
        item = self.get_object(pk)
        if not item:
            return Response(status=status.HTTP_404_NOT_FOUND)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# CBV for ProductMovement
class ProductMovementList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        movements = ProductMovement.objects.all()
        serializer = ProductMovementModelSerializer(movements, many=True)
        return Response(serializer.data)

    def post(self, request):
        if not request.user.role == User.ADMIN:
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer = ProductMovementModelSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProductMovementDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return ProductMovement.objects.get(pk=pk)
        except ProductMovement.DoesNotExist:
            return None

    def get(self, request, pk):
        movement = self.get_object(pk)
        if not movement:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ProductMovementModelSerializer(movement)
        return Response(serializer.data)

    def put(self, request, pk):
        if not request.user.role == User.ADMIN:
            return Response(status=status.HTTP_403_FORBIDDEN)
        movement = self.get_object(pk)
        if not movement:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ProductMovementModelSerializer(movement, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        if not request.user.role == User.ADMIN:
            return Response(status=status.HTTP_403_FORBIDDEN)
        movement = self.get_object(pk)
        if not movement:
            return Response(status=status.HTTP_404_NOT_FOUND)
        movement.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# CBV for User management
class UserList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.role == User.ADMIN:
            return Response(status=status.HTTP_403_FORBIDDEN)
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request):
        if not request.user.role == User.ADMIN:
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return User.objects.get(pk=pk)
        except User.DoesNotExist:
            return None

    def get(self, request, pk):
        if not request.user.role == User.ADMIN:
            return Response(status=status.HTTP_403_FORBIDDEN)
        user = self.get_object(pk)
        if not user:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request, pk):
        if not request.user.role == User.ADMIN:
            return Response(status=status.HTTP_403_FORBIDDEN)
        user = self.get_object(pk)
        if not user:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        if not request.user.role == User.ADMIN:
            return Response(status=status.HTTP_403_FORBIDDEN)
        user = self.get_object(pk)
        if not user:
            return Response(status=status.HTTP_404_NOT_FOUND)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)
