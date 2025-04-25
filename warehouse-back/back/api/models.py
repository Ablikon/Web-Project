from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator

# Create your models here.

class User(AbstractUser):
    ADMIN = 'admin'
    STOREKEEPER = 'storekeeper'
    
    ROLE_CHOICES = [
        (ADMIN, 'Admin'),
        (STOREKEEPER, 'Storekeeper'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=STOREKEEPER)

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.CharField(max_length=300, null=True, blank=True)
    
    def __str__(self):
        return f"{self.name} {self.description}"

class Product(models.Model):
    name = models.CharField(max_length=200)
    unit = models.CharField(max_length=50) # e.g., kg, g, pieces
    description = models.CharField(max_length=300, null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    
    def __str__(self):
        return f"{self.name} ({self.unit}) {self.description or ''}"

class ProductItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='items')
    quantity = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    
    def __str__(self):
        return f"{self.product.name} - {self.quantity} {self.product.unit}"

class ProductMovement(models.Model):
    WRITEOFF = 'writeoff'
    RECEIPT = 'receipt'
    TRANSFER = 'transfer'
    
    MOVEMENT_TYPES = [
        (WRITEOFF, 'Write-off'),
        (RECEIPT, 'Receipt'),
        (TRANSFER, 'Transfer'),
    ]
    
    movement_type = models.CharField(max_length=20, choices=MOVEMENT_TYPES)
    product_item = models.ForeignKey(ProductItem, on_delete=models.CASCADE, related_name='movements')
    previous_quantity = models.DecimalField(max_digits=10, decimal_places=2)
    new_quantity = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)  # amount changed
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    
    def __str__(self):
        return f"{self.movement_type} - {self.product_item.product.name}"
