from django.contrib.auth.models import User
from django.db import models

from archivos.models import Archivo

class Comentario(models.Model):
    texto = models.CharField(max_length=1024)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    archivo = models.ForeignKey(Archivo, on_delete=models.CASCADE)
