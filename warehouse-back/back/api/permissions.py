from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.role == 'admin'

class IsStorekeeperUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.role == 'storekeeper' 