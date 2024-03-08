"use strict"

let urldom = new URL(document.location);
urldom.port = "8001";
window.dominio = urldom.origin;

function descargar(e){
    let ident = e.target.parentNode.parentNode.dataset.ident;
    xhrobj = new XMLHttpRequest();
    xhrobj.open("GET", window.dominio+"/archivo_descargar/"+ident);
    xhrobj.withCredentials = true;
    xhrobj.responseType = 'blob';
    xhrobj.addEventListener("readystatechange", () => {
        if (xhrobj.readyState == 4) {
            if (xhrobj.status == 200){
                const link = document.createElement("a");
                link.href = URL.createObjectURL(xhrobj.response);
                link.download = name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else if (xhrobj.status == 403){
                alert("No es tu archivo, no puedes descargarlo");
            } else {
                alert("Error al descargar archivo");
            }
        }
    });
    xhrobj.send();
}

function comentarios(e){
    window.ident = e.target.parentNode.parentNode.dataset.ident;
    location.href = "#comentarios";
}

function cambiarPagina(){
    let pagina = location.hash.substring(1);
    let p = document.getElementById("p_"+pagina);
    if (p){
        document.querySelector("article[aria-current='page']").removeAttribute("aria-current");
        p.setAttribute("aria-current", "page");
    } else console.error(pagina + " no existe!");

    /*Acciones por página*/
    if (pagina == "archivos"){
        xhrobj = new XMLHttpRequest();
        xhrobj.open("GET", window.dominio+"/archivo_listar");
        xhrobj.withCredentials = true;
        xhrobj.addEventListener("readystatechange", () => {
            if (xhrobj.readyState == 4) {
                if (xhrobj.status == 200){
                    let obj = JSON.parse(xhrobj.response);
                    let tbl = document.querySelector(".archivos tbody");
                    tbl.textContent = "";
                    for (let o of obj){
                        let tr = document.createElement("tr");
                        tr.dataset.ident = o.id;
                        let tdarc = document.createElement("td");
                        tdarc.textContent = o.nombre;
                        let tdprop = document.createElement("td");
                        tdprop.textContent = o.usuario;
                        let tdbtns = document.createElement("td");
                        let tdbtndesc = document.createElement("button");
                        tdbtndesc.textContent = "Descargar";
                        tdbtndesc.addEventListener("click", descargar);
                        let tdbtncom = document.createElement("button");
                        tdbtncom.textContent = "Comentarios";
                        tdbtncom.addEventListener("click", comentarios);
                        tdbtns.append(tdbtndesc, tdbtncom);
                        tr.append(tdarc, tdprop, tdbtns);
                        tbl.appendChild(tr);
                    }
                } else {
                    alert("Error al listar archivos");
                }
            }
        });
        xhrobj.send();
    } else if (pagina == "comentarios"){
        if (!window.ident) {location.href = "#"; return;}
        xhrobj = new XMLHttpRequest();
        xhrobj.open("GET", window.dominio+"/comentario_listar/"+window.ident);
        xhrobj.withCredentials = true;
        xhrobj.addEventListener("readystatechange", () => {
            if (xhrobj.readyState == 4) {
                if (xhrobj.status == 200){
                    let obj = JSON.parse(xhrobj.response);
                    let tbl = document.getElementById("lista_comentarios");
                    tbl.textContent = "";
                    for (let o of obj){
                        let div = document.createElement("div");
                        div.className = "comentario";
                        div.dataset.ident = o.id;
                        let h3 = document.createElement("h3");
                        h3.textContent = o.usuario;
                        let fhora = document.createElement("time");
                        fhora.textContent = o.fecha;
                        let p = document.createElement("p");
                        p.innerHTML = o.texto;
                        div.append(h3, fhora, p);
                        tbl.appendChild(div);
                    }
                } else {
                    alert("Error al listar comentarios");
                }
            }
        });
        xhrobj.send();
    } else if (pagina == ""){
        location.href = localStorage.getItem("usuario")?"#archivos":"#sesion";
    }
}

window.addEventListener("popstate", cambiarPagina);

document.addEventListener("DOMContentLoaded", () => {
    window.xhrobj = null;
    cambiarPagina();
    let nomusu = localStorage.getItem("usuario");
    if (nomusu) {
        document.getElementById("nombre_usuario").textContent = nomusu;
        document.querySelector("header").classList.add("consesion");
    }
     
    /* Eventos de botones */
    document.getElementById("inicio_sesion").addEventListener("click", (e) => {
        xhrobj = new XMLHttpRequest();
        xhrobj.open("POST", window.dominio+"/sesion_iniciar");
        xhrobj.withCredentials = true;
        xhrobj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhrobj.addEventListener("readystatechange", () => {
            if (xhrobj.readyState == 4) {
                if (xhrobj.status == 201){
                    let obj = JSON.parse(xhrobj.response);
                    location.href = "#archivos";
                    document.getElementById("nombre_usuario").textContent = obj.usuario;
                    document.querySelector("header").classList.add("consesion");
                    localStorage.setItem("usuario", obj.usuario);
                } else if (xhrobj.status == 403) {
                    alert("Credenciales incorrectas");
                } else {
                    alert("Error al iniciar sesión");
                }
            }
        });
        xhrobj.send("usuario="+encodeURIComponent(document.getElementById("user").value)+"&contrasena="+encodeURIComponent(document.getElementById("password").value));
    });

    document.getElementById("enviaregistro").addEventListener("click", (e) => {
        xhrobj = new XMLHttpRequest();
        xhrobj.open("POST", window.dominio+"/usuario_crear");
        xhrobj.withCredentials = true;
        xhrobj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhrobj.addEventListener("readystatechange", () => {
            if (xhrobj.readyState == 4) {
                if (xhrobj.status == 201){
                    location.href = "#sesion";
                } else {
                    alert("Error al crear nuevo usuario");
                }
            }
        });
        xhrobj.send("usuario="+encodeURIComponent(document.getElementById("regnomusu").value)+"&email="+encodeURIComponent(document.getElementById("regcorreo").value)+"&contrasena="+encodeURIComponent(document.getElementById("regpass").value));
    });

    document.getElementById("cerrar_sesion").addEventListener("click", (e) => {
        xhrobj = new XMLHttpRequest();
        xhrobj.open("POST", window.dominio+"/sesion_cerrar");
        xhrobj.withCredentials = true;
        xhrobj.addEventListener("readystatechange", () => {
            if (xhrobj.readyState == 4) {
                if (xhrobj.status == 200){
                    document.getElementById("nombre_usuario").textContent = "";
                    localStorage.removeItem("usuario");
                    document.querySelector("header").classList.remove("consesion");
                    location.href = "#sesion";
                } else {
                    alert("Error al cerrar sesión");
                }
            }
        });
        xhrobj.send();
    });

    document.getElementById("subir").addEventListener("click", (e) => {
        document.getElementById("archivosubir").click();
    });
    document.getElementById("archivosubir").addEventListener("change", (e) => {
        let formData = new FormData();
        formData.append('archivo', e.target.files[0]);
        formData.append('nombre', prompt("Nombre del archivo:"));
        xhrobj = new XMLHttpRequest();
        xhrobj.open("POST", window.dominio+"/archivo_subir");
        xhrobj.withCredentials = true;
        xhrobj.addEventListener("readystatechange", () => {
            if (xhrobj.readyState == 4) {
                if (xhrobj.status == 200){
                    location.href = "#";
                } else {
                    alert("Error al subir archivo");
                }
            }
        });
        xhrobj.send(formData);
    });
    
    document.getElementById("dejarcomentario").addEventListener("click", (e) => {
        xhrobj = new XMLHttpRequest();
        xhrobj.open("POST", window.dominio+"/comentario_crear/"+window.ident);
        xhrobj.withCredentials = true;
        xhrobj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhrobj.addEventListener("readystatechange", () => {
            if (xhrobj.readyState == 4) {
                if (xhrobj.status == 200){
                    location.href = "#archivos"
                    location.href = "#comentarios";
                    document.getElementById("comment").value = "";
                } else {
                    alert("Error al comentar");
                }
            }
        });
        xhrobj.send("texto="+encodeURIComponent(document.getElementById("comment").value));
    });
});
