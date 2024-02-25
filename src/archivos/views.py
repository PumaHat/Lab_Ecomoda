from django.conf import settings
from django.http import JsonResponse, HttpResponse

from archivos.models import Archivo

import os

def archivo_listar(request):
    obj = []
    try:
        archivos = Archivo.objects.all()
    except:
        return HttpResponse(status=400)
    for a in archivos:
        obj.append({
            'id': a.pk,
            'nombre': a.nombre,
            'usuario': a.usuario.username
        })
    return JsonResponse(obj, status=200, safe=False)

def archivo_descargar(request, ida):
    if not request.user:
        return HttpResponse(status=401)
    if not request.method == 'GET':
        return HttpResponse(status=405)
    try:
        archivo = Archivo.objects.get(pk=ida)
    except Archivo.DoesNotExist:
        return HttpResponse(status=400)
    if not archivo.usuario_id == request.user.pk:
        return HttpResponse(status=403)
    try:
        arch = open(os.path.join(settings.MEDIA_ROOT, str(pk)))
        return HttpResponse(arch.read(), content_type='application/octet-stream')
    except:
        return HttpResponse(status=500)

def archivo_subir(request):
    if not request.user:
        return HttpResponse(status=401)
    if not request.method == 'POST':
        return HttpResponse(status=405)
    try:
        nuevo = Archivo()
        nuevo.nombre = request.POST['nombre']
        nuevo.usuario = request.user
        data=request.FILES['archivo']
        with open(os.path.join(settings.MEDIA_ROOT, pk)) as f:
            for chunk in data.chunks():
                f.write(chunk)
    except:
        return HttpResponse(status=500)

def archivo_borrar(request, ida):
    return HttpResponse(status=418)
    if not request.user:
        return HttpResponse(status=401)
    if not request.method == 'DELETE':
        return HttpResponse(status=405)
    try:
        archivo = Archivo.objects.get(pk=ida)
    except Archivo.DoesNotExist:
        return HttpResponse(status=400)
    if not archivo.usuario_id == request.user.pk:
        return HttpResponse(status=403)
    try:
        os.remove(os.path.join(settings.MEDIA_ROOT, pk))
        return HttpResponse(status=200)
    except:
        return HttpResponse(status=500)
