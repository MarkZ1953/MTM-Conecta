from simple_history.models import HistoricalRecords
from django.db import models


class ActiveManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_active=True)


class BaseModel(models.Model):
    active_objects = ActiveManager()
    objects = models.Manager()  
    
    history = HistoricalRecords(inherit=True)
    created_at = models.DateTimeField(auto_now_add=True, editable=False, db_index=True)    
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True, db_index=True)
    
    def soft_delete(self):
        if self.is_active:
            self.is_active = False
            self.save(update_fields=['is_active'])

    def restore(self):
        if not self.is_active:
            self.is_active = True
            self.save(update_fields=['is_active'])

    class Meta:
        abstract = True
        