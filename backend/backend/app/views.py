import re

import cloudinary
import cloudinary.api
from cloudinary.utils import cloudinary_url
from django.conf import settings
from django.core.cache import cache
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView


PUBLIC_CLOUDINARY_FOLDERS = {
    "sobre-nosotros": "SobreNosotros",
    "como-puedo-ayudar": "Como puedo ayudar",
}

FOLDER_SORT_PRIORITY = {
    "sobre-nosotros": ("principal", "segunda", "tercera", "4", "5"),
    "como-puedo-ayudar": (
        "fondo",
        "laborsocial",
        "voluntariadopresencial",
        "voluntariadoempresarial",
        "aportedonacion",
    ),
}


def _configure_cloudinary():
    storage = settings.CLOUDINARY_STORAGE
    cloudinary.config(
        cloud_name=storage["CLOUD_NAME"],
        api_key=storage["API_KEY"],
        api_secret=storage["API_SECRET"],
        secure=True,
    )


def _build_image_url(public_id: str, width: int = 1800) -> str:
    url, _ = cloudinary_url(
        public_id,
        fetch_format="auto",
        quality="auto",
        secure=True,
        width=width,
    )
    return url


def _build_alt_text(public_id: str) -> str:
    filename = public_id.rsplit("/", 1)[-1]
    name_without_suffix = filename.rsplit("_", 1)[0]
    readable = re.sub(r"(?<!^)(?=[A-Z])", " ", name_without_suffix)
    readable = readable.replace("-", " ").replace("_", " ").strip()
    return f"Imagen institucional MTM - {readable}"


def _sort_key(folder_key: str, asset: dict):
    public_id = asset.get("public_id", "").lower()
    priorities = FOLDER_SORT_PRIORITY.get(folder_key, ())

    for index, token in enumerate(priorities):
        if token in public_id:
            return (index, public_id)

    return (len(priorities), public_id)


class PublicCloudinaryFolderView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, folder_key: str):
        folder_prefix = PUBLIC_CLOUDINARY_FOLDERS.get(folder_key)

        if not folder_prefix:
            return Response({"detail": "Cloudinary folder is not available."}, status=404)

        cache_key = f"public-cloudinary-folder:{folder_key}"
        cached_payload = cache.get(cache_key)

        if cached_payload:
            return Response(cached_payload)

        _configure_cloudinary()
        result = cloudinary.api.resources(
            max_results=100,
            prefix=folder_prefix,
            resource_type="image",
            type="upload",
        )
        resources = result.get("resources", [])

        if not resources:
            result = (
                cloudinary.Search()
                .expression(f'resource_type:image AND asset_folder="{folder_prefix}"')
                .max_results(100)
                .execute()
            )
            resources = result.get("resources", [])

        resources = sorted(resources, key=lambda asset: _sort_key(folder_key, asset))
        assets = [
            {
                "publicId": asset["public_id"],
                "src": _build_image_url(asset["public_id"]),
                "alt": _build_alt_text(asset["public_id"]),
                "width": asset.get("width"),
                "height": asset.get("height"),
            }
            for asset in resources
        ]

        payload = {"folder": folder_key, "assets": assets}
        cache.set(cache_key, payload, 60 * 10)

        return Response(payload)
