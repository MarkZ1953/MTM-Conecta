from django.contrib.auth.models import User, Group
import django_filters


class CharInFilter(django_filters.BaseInFilter, django_filters.CharFilter):
    pass


class UserFilter(django_filters.FilterSet):
    # Filtros 'in' (separados por comas)
    username__in = CharInFilter(field_name='username', lookup_expr='in')
    email__in = CharInFilter(field_name='email', lookup_expr='in')
    first_name__in = CharInFilter(field_name='first_name', lookup_expr='in')
    last_name__in = CharInFilter(field_name='last_name', lookup_expr='in')

    # Filtros de exclusión (notContains, notEquals)
    username__not_icontains = django_filters.CharFilter(field_name='username', lookup_expr='icontains', exclude=True)
    username__not_exact = django_filters.CharFilter(field_name='username', lookup_expr='exact', exclude=True)
    
    email__not_icontains = django_filters.CharFilter(field_name='email', lookup_expr='icontains', exclude=True)
    email__not_exact = django_filters.CharFilter(field_name='email', lookup_expr='exact', exclude=True)
    
    first_name__not_icontains = django_filters.CharFilter(field_name='first_name', lookup_expr='icontains', exclude=True)
    first_name__not_exact = django_filters.CharFilter(field_name='first_name', lookup_expr='exact', exclude=True)
    
    last_name__not_icontains = django_filters.CharFilter(field_name='last_name', lookup_expr='icontains', exclude=True)
    last_name__not_exact = django_filters.CharFilter(field_name='last_name', lookup_expr='exact', exclude=True)

    # Fechas de exclusión
    date_joined__not_date = django_filters.DateFilter(field_name='date_joined', lookup_expr='date', exclude=True)
    last_login__not_date = django_filters.DateFilter(field_name='last_login', lookup_expr='date', exclude=True)

    class Meta:
        model = User
        fields = {
            'username': ['exact', 'icontains', 'istartswith', 'iendswith'],
            'email': ['exact', 'icontains', 'istartswith', 'iendswith'],
            'first_name': ['exact', 'icontains', 'istartswith', 'iendswith'],
            'last_name': ['exact', 'icontains', 'istartswith', 'iendswith'],
            'is_active': ['exact'],
            'date_joined': ['exact', 'date', 'date__lt', 'date__gt', 'lt', 'lte', 'gt', 'gte'],
            'last_login': ['exact', 'date', 'date__lt', 'date__gt', 'lt', 'lte', 'gt', 'gte'],
        }


class GroupFilter(django_filters.FilterSet):
    # Filtros 'in' (separados por comas)
    name__in = CharInFilter(field_name='name', lookup_expr='in')

    # Filtros de exclusión
    name__not_icontains = django_filters.CharFilter(field_name='name', lookup_expr='icontains', exclude=True)
    name__not_exact = django_filters.CharFilter(field_name='name', lookup_expr='exact', exclude=True)

    class Meta:
        model = Group
        fields = {
            'name': ['exact', 'icontains', 'istartswith', 'iendswith'],
        }