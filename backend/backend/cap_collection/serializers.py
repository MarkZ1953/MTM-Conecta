from rest_framework import serializers
from .models import Company, CollectionPoint, CollectionRequest


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = [
            'id', 'nit', 'business_name', 'contact_name',
            'contact_email', 'contact_phone', 'economic_sector',
            'company_size', 'is_active'
        ]

    def validate_nit(self, value):
        # Limpiar el NIT de puntos, espacios o comas
        cleaned = value.replace(".", "").replace(",", "").replace(" ", "").strip()
        
        if "-" not in cleaned:
            raise serializers.ValidationError(
                "El NIT debe incluir el dígito de verificación separado por un guion (Ej: 900123456-1)."
            )
            
        parts = cleaned.split("-")
        if len(parts) != 2:
            raise serializers.ValidationError(
                "Formato de NIT inválido. Debe tener la estructura: XXXXX-X."
            )
            
        nit_body, dv = parts[0], parts[1]
        if not nit_body.isdigit() or not dv.isdigit() or len(dv) != 1:
            raise serializers.ValidationError(
                "El NIT y el dígito de verificación deben ser estrictamente numéricos."
            )
            
        # Algoritmo de Módulo 11 (DIAN Colombia)
        weights = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71]
        digits = [int(d) for d in reversed(nit_body)]
        
        total = 0
        for i, digit in enumerate(digits):
            if i < len(weights):
                total += digit * weights[i]
            
        remainder = total % 11
        if remainder > 1:
            calculated_dv = 11 - remainder
        else:
            calculated_dv = remainder
            
        if int(dv) != calculated_dv:
            raise serializers.ValidationError(
                f"Dígito de verificación inválido. El DV calculado para {nit_body} es {calculated_dv}, pero se ingresó {dv}."
            )
            
        return cleaned

    def validate_contact_email(self, value):
        email = value.lower().strip()
        forbidden_domains = [
            'gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com',
            'live.com', 'msn.com', 'icloud.com', 'aol.com', 'zoho.com', 'mail.com'
        ]
        
        if '@' not in email:
            raise serializers.ValidationError(
                "Dirección de correo electrónico inválida."
            )
            
        domain = email.split('@')[-1]
        if domain in forbidden_domains:
            raise serializers.ValidationError(
                "Se requiere una dirección de correo institucional corporativo. Los dominios de correo público (gmail, hotmail, yahoo, etc.) no están autorizados."
            )
            
        return email


class CollectionPointSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(
        source='company.business_name', read_only=True
    )

    class Meta:
        model = CollectionPoint
        fields = [
            'id', 'company', 'company_name', 'name', 'address',
            'municipality', 'department', 'contact_name',
            'contact_phone', 'latitude', 'longitude', 'is_active'
        ]


class CollectionRequestSerializer(serializers.ModelSerializer):
    collection_point_name = serializers.CharField(
        source='collection_point.name', read_only=True
    )
    company_name = serializers.CharField(
        source='collection_point.company.business_name', read_only=True
    )

    class Meta:
        model = CollectionRequest
        fields = [
            'id', 'collection_point', 'collection_point_name',
            'company_name', 'status', 'estimated_weight_kg',
            'scheduled_date', 'driver_name', 'notes', 'is_active',
            'created_at'
        ]
        read_only_fields = ['created_at']
