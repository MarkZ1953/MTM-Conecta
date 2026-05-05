from django.contrib.auth.models import User, Group
import django_filters


class UserFilter(django_filters.FilterSet):
    username = django_filters.CharFilter(
        field_name='username',
        lookup_expr='icontains'
    )

    email = django_filters.CharFilter(
        field_name='email',
        lookup_expr='icontains'
    )

    first_name = django_filters.CharFilter(
        field_name='first_name',
        lookup_expr='icontains'
    )

    last_name = django_filters.CharFilter(
        field_name='last_name',
        lookup_expr='icontains'
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name']


class GroupFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(
        field_name='name',
        lookup_expr='icontains'
    )

    class Meta:
        model = Group
        fields = ['name']