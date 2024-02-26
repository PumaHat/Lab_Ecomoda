"""
URL configuration for ecomoda project.
"""
from django.urls import path

from usuarios.views import *
from archivos.views import *
from comentarios.views import *

urlpatterns = [
    path('sesion_ver', sesion_ver),
    path('sesion_iniciar', sesion_iniciar),
    path('sesion_cerrar', sesion_cerrar),
    path('usuario_crear', usuario_crear),
    path('archivo_listar', archivo_listar),
    path('archivo_descargar/<int>', archivo_descargar),
    path('archivo_subir', archivo_subir),
    path('archivo_borrar/<int>', archivo_borrar),
    path('comentario_listar/<int>', comentario_listar),
    path('comentario_crear/<int>', comentario_crear)
]
