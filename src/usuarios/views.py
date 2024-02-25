from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse, HttpResponse

def sesion_ver(request):
    obj = {}
    if request.user:
         obj['id'] = request.user.pk
    return JsonResponse(obj, status=200, safe=False)

def sesion_iniciar(request):
    try:
        usuario = authenticate(request.POST['usuario'], request.POST['contrasena'])
        if usuario:
            login(request, usuario)
            return HttpResponse(status=201)
        else:
            return HttpResponse(status=403)
    except:
        return HttpResponse(status=400)

def sesion_cerrar(request):
    logout(request)
    return HttpResponse(status=200)
