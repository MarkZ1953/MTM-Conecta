from django.conf import settings
from django.db import models


class UserAccountProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="account_profile",
    )
    google_sub = models.CharField(max_length=255, blank=True, null=True, unique=True)
    google_email = models.EmailField(blank=True, default="")
    photo = models.ImageField(upload_to="accounts/profile_photos/", blank=True, null=True)
    phone = models.CharField(max_length=32, blank=True, default="")
    marketing_opt_in = models.BooleanField(default=True)
    news_opt_in = models.BooleanField(default=True)
    impact_opt_in = models.BooleanField(default=True)
    data_processing_opt_in = models.BooleanField(default=False)
    preferred_contact = models.CharField(max_length=32, blank=True, default="email")
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Perfil de cuenta - {self.user.username}"

    class Meta:
        db_table = "user_account_profiles"
        verbose_name = "User Account Profile"
        verbose_name_plural = "User Account Profiles"
