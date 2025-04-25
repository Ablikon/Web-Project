# WareHouse Inventory Management System

This project, called "Warehouse," is a comprehensive inventory management system designed to help businesses track and manage their product inventory efficiently.

## Features

- **Inventory Tracking**: Monitor stock levels of products in real-time, with visual indicators for low inventory items.
- **Product Movement Management**: Track all product movements including:
  - Adding new products to inventory
  - Writing off products from inventory
  - Monitoring product history and operations
- **User Role Management**: Support different user roles with varying permissions:
  - Admin: Full system access
  - Storekeeper: Basic inventory operations
- **Dashboard**: Visual representation of inventory status with statistics and alerts.
- **Reference Data Management**: Maintain a catalog of reference items and categories for consistent product information.

## Project Structure

The project consists of two main components:

1. **Backend**: Django REST API (`warehouse-back`)
2. **Frontend**: Angular application (`warehouse-app`)

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd warehouse-back
   ```

2. Create and activate a virtual environment:
   ```
   python3 -m venv venv
   source venv/bin/activate  # On macOS/Linux
   ```

3. Install dependencies:
   ```
   pip install django djangorestframework
   ```

4. Apply migrations:
   ```
   cd back
   python manage.py makemigrations
   python manage.py migrate
   ```

5. Run the server:
   ```
   python manage.py runserver
   ```

The API will be available at `http://127.0.0.1:8000/api/`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd warehouse-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server with API proxy configured:
   ```
   npm start
   ```

The application will be available at `http://localhost:4200/`.

## API Endpoints

- `/api/login/` - User authentication
- `/api/categories/` - Category management
- `/api/products/` - Product management
- `/api/product-items/` - Product inventory items
- `/api/product-movements/` - Track inventory changes
- `/api/users/` - User management

## User Roles

- **Admin**: Can manage all aspects of the system including user management.
- **Storekeeper**: Can perform day-to-day inventory operations.

## Development

### Backend Development

- Models are defined in `warehouse-back/back/api/models.py`
- API endpoints are in `warehouse-back/back/api/views.py`
- URL routing is in `warehouse-back/back/api/urls.py`

### Frontend Development

- Services for API communication are in `warehouse-app/src/app/services/`
- Components are in `warehouse-app/src/app/components/`
- Models/interfaces are in `warehouse-app/src/app/models/`

## Quick Start (All-in-One Command)

To start the backend server:
```
cd warehouse-back && python3 -m venv venv && source venv/bin/activate && pip install django djangorestframework && cd back && python manage.py makemigrations && python manage.py migrate && python manage.py runserver
```

In a new terminal, to start the frontend:
```
cd warehouse-app && npm install && npm start
```
