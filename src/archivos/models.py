from django.contrib.auth.models import User
from django.db import models

class Archivo(models.Model):
    nombre = models.CharField(max_length=255)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
