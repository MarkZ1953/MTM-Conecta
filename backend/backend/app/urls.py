from django.urls import path

from .views import PublicCloudinaryFolderView


urlpatterns = [
    path(
        "public/cloudinary-folders/<slug:folder_key>/",
        PublicCloudinaryFolderView.as_view(),
        name="public-cloudinary-folder",
    ),
]
