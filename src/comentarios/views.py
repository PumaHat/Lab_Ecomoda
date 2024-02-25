from django.http import JsonResponse, HttpResponse

from comentarios.models import Comentario

def comentario_listar(request, ida):
    obj = []
    try:
        comentarios = Comentario.objects.get(archivo_id=ida)
    except:
        return HttpResponse(status=400)
    for c in comentarios:
        obj.append({
            'id': c.pk,
            'usuario': c.usuario.username,
            'texto': c.texto
        })
    return JsonResponse(obj, status=200, safe=False)

def comentario_crear(request, ida):
    if not request.user:
        return HttpResponse(status=401)
    if not request.method == 'POST':
        return HttpResponse(status=405)
    try:
        nuevo = Comentario()
        nuevo.texto = request.POST['texto']
        nuevo.usuario = request.user
        nuevo.archivo_id = ida
        nuevo.full_clean()
        nuevo.save()
        return JsonResponse({'id': nuevo.pk})
    except:
        return HttpResponse(status=400)
