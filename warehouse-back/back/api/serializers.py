from rest_framework import serializers
from .models import User, Category, Product, ProductItem, ProductMovement

class UserSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(max_length=150)
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES)
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class CategorySerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=100)

    def create(self, validated_data):
        return Category.objects.create(**validated_data)

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'unit', 'category']

class ProductItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductItem
        fields = ['id', 'product', 'quantity']

class ProductMovementSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductMovement
        fields = ['id', 'movement_type', 'product_item', 'previous_quantity', 
                 'new_quantity', 'quantity', 'price', 'created_at', 'created_by']
        read_only_fields = ['created_by'] 