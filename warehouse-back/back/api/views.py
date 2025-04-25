from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from .models import *
from .serializers import *
from .permissions import IsAdminUser, IsStorekeeperUser
from django.db.models import Sum, Count

# Create your views here.

# Создаем публичный эндпоинт для регистрации
class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# FBV for Category
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def category_list(request):
    if request.method == 'GET':
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response({'results': serializer.data})
    
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
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    def post(self, request):
        if not request.user.role == User.ADMIN:
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer = ProductSerializer(data=request.data)
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
        serializer = ProductSerializer(product)
        return Response(serializer.data)

    def put(self, request, pk):
        if not request.user.role == User.ADMIN:
            return Response(status=status.HTTP_403_FORBIDDEN)
        product = self.get_object(pk)
        if not product:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ProductSerializer(product, data=request.data)
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
        serializer = ProductItemSerializer(items, many=True)
        return Response(serializer.data)

    def post(self, request):
        if not request.user.role == User.ADMIN:
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer = ProductItemSerializer(data=request.data)
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
        serializer = ProductItemSerializer(item)
        return Response(serializer.data)

    def put(self, request, pk):
        if not request.user.role == User.ADMIN:
            return Response(status=status.HTTP_403_FORBIDDEN)
        item = self.get_object(pk)
        if not item:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ProductItemSerializer(item, data=request.data)
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
        serializer = ProductMovementSerializer(movements, many=True)
        return Response(serializer.data)

    def post(self, request):
        if not request.user.role == User.ADMIN:
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer = ProductMovementSerializer(data=request.data)
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
        serializer = ProductMovementSerializer(movement)
        return Response(serializer.data)

    def put(self, request, pk):
        if not request.user.role == User.ADMIN:
            return Response(status=status.HTTP_403_FORBIDDEN)
        movement = self.get_object(pk)
        if not movement:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ProductMovementSerializer(movement, data=request.data)
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

class UserProfile(APIView):
    """
    View to get the current user's profile
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def inventory_report(request):
    """
    Generate inventory report with filters
    """
    filters = {}
    
    if 'category' in request.query_params:
        filters['product__category'] = request.query_params.get('category')
    
    if 'status' in request.query_params:
        filters['status'] = request.query_params.get('status')
    
    if 'location' in request.query_params:
        filters['location__icontains'] = request.query_params.get('location')
    
    # Calculate inventory summary
    items = ProductItem.objects.filter(**filters)
    total_items = items.count()
    total_value = items.aggregate(total=Sum('purchase_price'))['total'] or 0
    
    # Items by status
    status_counts = items.values('status').annotate(count=Count('id')).order_by('status')
    
    # Items by category
    category_stats = (
        items
        .values('product__category__name')
        .annotate(
            count=Count('id'),
            value=Sum('purchase_price')
        )
        .order_by('product__category__name')
    )
    
    categories_data = []
    for stat in category_stats:
        categories_data.append({
            'category': stat['product__category__name'] or 'Uncategorized',
            'count': stat['count'],
            'value': stat['value'] or 0
        })
    
    return Response({
        'total_items': total_items,
        'total_value': total_value,
        'items_by_status': status_counts,
        'items_by_category': categories_data
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def movement_report(request):
    """
    Generate movement report with filters
    """
    filters = {}
    date_filters = {}
    
    if 'start_date' in request.query_params:
        date_filters['date__gte'] = request.query_params.get('start_date')
    
    if 'end_date' in request.query_params:
        date_filters['date__lte'] = request.query_params.get('end_date')
    
    if 'movement_type' in request.query_params:
        filters['movement_type'] = request.query_params.get('movement_type')
    
    # Apply category filter if provided
    category_filter = {}
    if 'category' in request.query_params:
        category_id = request.query_params.get('category')
        category_filter['product_item__product__category'] = category_id
    
    # Combine all filters
    combined_filters = {**filters, **date_filters, **category_filter}
    
    # Get movements
    movements = ProductMovement.objects.filter(**combined_filters)
    
    # Movements by type
    type_counts = movements.values('movement_type').annotate(count=Count('id')).order_by('movement_type')
    
    # Movements by date
    date_counts = (
        movements
        .values('date')
        .annotate(count=Count('id'))
        .order_by('-date')
    )
    
    # Movements by location
    location_stats = []
    
    # Get all locations
    locations = set()
    for movement in movements:
        if movement.location_from:
            locations.add(movement.location_from)
        if movement.location_to:
            locations.add(movement.location_to)
    
    # Calculate incoming and outgoing for each location
    for location in locations:
        incoming = movements.filter(location_to=location).count()
        outgoing = movements.filter(location_from=location).count()
        
        location_stats.append({
            'location': location,
            'incoming': incoming,
            'outgoing': outgoing
        })
    
    return Response({
        'movements_by_type': type_counts,
        'movements_by_date': date_counts,
        'movements_by_location': location_stats
    })
