from django.contrib.auth.models import User
from django.db import models

from archivos.models import Archivo

class Comentario(models.Model):
    texto = models.CharField(max_length=2048)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    archivo = models.ForeignKey(Archivo, on_delete=models.CASCADE)
    fecha = models.DateTimeField(auto_now=True)
