# Write-up

Lo primero que se tiene que hacer es registrar un usuario para poder acceder al sitio de los archivos de Ecomoda.

![](/docs/01.png)

Iniciamos sesión, y una vez que estamos dentro, podemos observar los archivos y los propietarios. Si intentamos descargar un archivo que no es de nuestra propiedad, aparecerá el siguiente mensaje:

![](/docs/02.png)

Esto quiere decir que sólo podremos descargar archivos de los cuales nosotros seamos propietarios.

Buscando los posibles elementos donde se puede inyectar código, nos vamos a la sección de comentarios y si comentamos `<h1>Acepta html?</h1>` se puede ver que, como en el laboratorio de XSS simple, no se escapan los caracteres especiales en los comentarios, por lo tanto, se puede incluir cualquier etiqueta html. 

![](/docs/03.png)
