from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status


class SoftDeleteMixin:
    """
    Mixin reutilizable para soft delete individual y bulk.

    Configuración en el ViewSet:
        soft_delete_serializer_class = MiSerializer   # obligatorio
        soft_delete_model_name = "el registro"        # opcional, para mensajes
        soft_delete_model_name_plural = "los registros"  # opcional

    Opcionalmente sobreescribe `after_soft_delete(self, instance, request)`
    para lógica adicional post-eliminación (ej: actualizar registros relacionados).
    """

    soft_delete_serializer_class = None
    soft_delete_model_name = "el registro"
    soft_delete_model_name_plural = "los registros"

    def get_soft_delete_serializer(self, *args, **kwargs):
        serializer_class = self.soft_delete_serializer_class or self.get_serializer_class()
        return serializer_class(*args, **kwargs)

    def after_soft_delete(self, instance, request):
        """Hook para lógica adicional tras eliminar una instancia."""
        pass

    @action(detail=True, methods=["post"], url_path="soft-delete")
    def soft_delete(self, request, pk=None):
        try:
            instance = self.get_object()

            if not instance.is_active:
                return Response(
                    {"detail": f"{self.soft_delete_model_name.capitalize()} ya ha sido eliminado."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            instance.soft_delete()

            self.after_soft_delete(instance, request)

            return Response(
                {
                    "message": f"{self.soft_delete_model_name.capitalize()} ha sido eliminado correctamente.",
                    "data": self.get_soft_delete_serializer(instance).data,
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            return Response(
                {"detail": f"Error al eliminar {self.soft_delete_model_name}: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=False, methods=["post"], url_path="bulk-soft-delete")
    def bulk_soft_delete(self, request):
        ids = request.data.get("ids", [])

        if not ids:
            return Response(
                {"detail": "No se proporcionaron IDs para eliminar."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        queryset = self.get_queryset().filter(id__in=ids, is_active=True)

        if not queryset.exists():
            return Response(
                {"detail": f"No se encontraron {self.soft_delete_model_name_plural} para eliminar."},
                status=status.HTTP_404_NOT_FOUND,
            )

        instances = list(queryset)

        queryset.update(is_active=False)

        for instance in instances:
            self.after_soft_delete(instance, request)

        return Response(
            {
                "message": f"Se han eliminado correctamente {len(instances)} {self.soft_delete_model_name_plural}.",
                "data": self.get_soft_delete_serializer(instances, many=True).data,
            },
            status=status.HTTP_200_OK,
        )