from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    ACCOUNT_TYPE = (('AD', 'ADMIN'), ('MM', 'MEMBER'))
    user = models.OneToOneField(User)
    group = models.CharField(max_length=255, choices=ACCOUNT_TYPE)
    plan_created = models.DateField(blank=True, null=True)

    def __unicode__(self):
        return self.user.username
        
        
class Excercise(models.Model):    
    name = models.CharField(max_length=255)
    image_path = models.CharField(max_length=255)

    def __unicode__(self):
        return self.name
