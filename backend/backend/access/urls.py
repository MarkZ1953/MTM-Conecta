from django.urls import path

from .views import (
    CustomTokenObtainPairView, 
    RolePermissionUpdateView,
    CustomTokenRefreshView, 
    PermissionListView,
    LogoutViewSet,  
)

urlpatterns = [
    path('refresh', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('login', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('logout', LogoutViewSet.as_view({"post": "create"}), name='logout'),
    path("permissions", PermissionListView.as_view(), name="permission-list"),
    path("roles/<int:role_id>/permissions/", RolePermissionUpdateView.as_view(), name="role-permission-update"),
]
