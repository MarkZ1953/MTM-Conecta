from pathlib import Path

from django.conf import settings
from django.core.files.images import get_image_dimensions
from rest_framework import serializers


def mb_to_bytes(value):
    return int(value * 1024 * 1024)


def _file_extension(uploaded_file):
    name = getattr(uploaded_file, "name", "") or ""
    return Path(name).suffix.lower()


def _file_content_type(uploaded_file):
    return (getattr(uploaded_file, "content_type", "") or "").lower()


def _starts_with(uploaded_file, expected_bytes):
    position = uploaded_file.tell() if hasattr(uploaded_file, "tell") else None
    try:
        if hasattr(uploaded_file, "seek"):
            uploaded_file.seek(0)
        return uploaded_file.read(len(expected_bytes)) == expected_bytes
    finally:
        if position is not None and hasattr(uploaded_file, "seek"):
            uploaded_file.seek(position)


def _allowed_message(extensions):
    return ", ".join(extension.lstrip(".").upper() for extension in extensions)


def validate_upload_file(uploaded_file, *, allowed_content_types, allowed_extensions, max_size_mb, field_name="file"):
    if not uploaded_file:
        return uploaded_file

    max_size = mb_to_bytes(max_size_mb)
    size = getattr(uploaded_file, "size", 0) or 0
    if size > max_size:
        raise serializers.ValidationError({
            field_name: f"El archivo no debe superar {max_size_mb} MB."
        })

    content_type = _file_content_type(uploaded_file)
    extension = _file_extension(uploaded_file)

    if content_type not in allowed_content_types or extension not in allowed_extensions:
        raise serializers.ValidationError({
            field_name: f"Formato no permitido. Usa: {_allowed_message(allowed_extensions)}."
        })

    return uploaded_file


def validate_image_upload(uploaded_file, field_name="image"):
    validate_upload_file(
        uploaded_file,
        allowed_content_types=settings.UPLOAD_ALLOWED_IMAGE_TYPES,
        allowed_extensions=settings.UPLOAD_ALLOWED_IMAGE_EXTENSIONS,
        max_size_mb=settings.UPLOAD_MAX_IMAGE_MB,
        field_name=field_name,
    )

    try:
        width, height = get_image_dimensions(uploaded_file)
    except Exception:
        width, height = None, None

    if not width or not height:
        raise serializers.ValidationError({
            field_name: "La imagen no parece ser un archivo válido."
        })

    return uploaded_file


def validate_pdf_upload(uploaded_file, field_name="document"):
    validate_upload_file(
        uploaded_file,
        allowed_content_types=settings.UPLOAD_ALLOWED_DOCUMENT_TYPES,
        allowed_extensions=settings.UPLOAD_ALLOWED_DOCUMENT_EXTENSIONS,
        max_size_mb=settings.UPLOAD_MAX_DOCUMENT_MB,
        field_name=field_name,
    )

    if not _starts_with(uploaded_file, b"%PDF"):
        raise serializers.ValidationError({
            field_name: "El documento no parece ser un PDF válido."
        })

    return uploaded_file


def validate_video_upload(uploaded_file, field_name="file"):
    return validate_upload_file(
        uploaded_file,
        allowed_content_types=settings.UPLOAD_ALLOWED_VIDEO_TYPES,
        allowed_extensions=settings.UPLOAD_ALLOWED_VIDEO_EXTENSIONS,
        max_size_mb=settings.UPLOAD_MAX_VIDEO_MB,
        field_name=field_name,
    )


def validate_evidence_upload(uploaded_file, field_name="file"):
    content_type = _file_content_type(uploaded_file)

    if content_type.startswith("image/"):
        return validate_image_upload(uploaded_file, field_name=field_name)
    if content_type == "application/pdf":
        return validate_pdf_upload(uploaded_file, field_name=field_name)
    if content_type.startswith("video/"):
        return validate_video_upload(uploaded_file, field_name=field_name)

    raise serializers.ValidationError({
        field_name: "Formato no permitido. Usa imagen, PDF o video compatible."
    })
