# Warehouse Management System

A comprehensive warehouse management system with inventory tracking, product movement management, and role-based access control.

## Features

- **Inventory Tracking**: Monitor stock levels of products in real-time, with alerts for low inventory items
- **Product Movement Management**: Track all product movements (receipts, write-offs, transfers)
- **User Role Management**: Support for admin, manager, and storekeeper roles with varying permissions
- **Reporting**: Generate comprehensive reports on inventory status and product movement history
- **Reference Data Management**: Maintain a catalog of reference items and categories
- **Data Visualization**: View inventory data through intuitive dashboards and statistics

## Project Structure

This project consists of two main components:

- **Frontend (Angular)**: Located in `warehouse-app/`
- **Backend (Django)**: Located in `warehouse-back/`

## Prerequisites

- Node.js (v16+)
- Python (v3.8+)
- PostgreSQL or SQLite

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd warehouse-back
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Apply migrations:
   ```
   cd back
   python manage.py migrate
   ```

5. Create a superuser (admin):
   ```
   python manage.py createsuperuser
   ```

6. Run the development server:
   ```
   python manage.py runserver
   ```

The backend API will be available at http://localhost:8000/api/

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd warehouse-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure the API URL:
   - If needed, modify the API URL in `src/environments/environment.ts`

4. Run the development server:
   ```
   npm start
   ```

The frontend will be available at http://localhost:4200/

## User Roles and Permissions

- **Admin**: Full system access including user management
- **Manager**: Inventory management capabilities and report generation
- **Storekeeper**: Basic inventory operations (view, add/remove items)

## API Documentation

API endpoints are available at the following URL when the backend is running:
- http://localhost:8000/api/

Key endpoints include:
- `GET /api/products/` - List all products
- `GET /api/categories/` - List all categories
- `GET /api/product-items/` - List all inventory items
- `POST /api/product-movements/` - Record a movement (receipt, writeoff, transfer)
- `GET /api/dashboard/` - Get dashboard statistics
- `GET /api/reports/inventory/` - Generate inventory report
- `GET /api/reports/movements/` - Generate movement history report

## Deployment

For production deployment:

1. Set `production: true` in the frontend environment file
2. Build the Angular app: `npm run build`
3. Configure your web server to serve the static files from `dist/` directory
4. Configure the Django backend with proper production settings
5. Make sure to set up secure CORS settings for communication between frontend and backend
