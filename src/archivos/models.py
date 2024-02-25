from django.contrib.auth.models import User
from django.db import models

class Archivo(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
