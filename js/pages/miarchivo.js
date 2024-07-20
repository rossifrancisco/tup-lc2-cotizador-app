// Funcion principal
document.addEventListener("DOMContentLoaded", function() {
    const miArchivo = JSON.parse(localStorage.getItem('miArchivo')) || [];
    const container = document.querySelector(".container");

    const fechasAgrupadas = agruparFechas(miArchivo);
    crearElementosHTML(fechasAgrupadas, container);
    inicializarEventos(fechasAgrupadas, container);
});

// Agrupar los datos por fecha
function agruparFechas(miArchivo) {
    let fechasAgrupadas = {};
    miArchivo.forEach((archivo) => {
        if (!fechasAgrupadas[archivo.fecha]) {
            fechasAgrupadas[archivo.fecha] = [];
        }
        fechasAgrupadas[archivo.fecha].push(archivo);
    });
    return fechasAgrupadas;
}

// Crear elementos y agregarlos al HTML
function crearElementosHTML(fechasAgrupadas, container) {
    Object.keys(fechasAgrupadas).forEach(fecha => {
        let div = document.createElement("div");
        div.classList.add("datos");

        let ulFecha = document.createElement("ul");
        let liFecha = document.createElement("li");
        liFecha.classList.add("fecha");
        liFecha.textContent = fecha;
        ulFecha.appendChild(liFecha);
        div.appendChild(ulFecha);

        fechasAgrupadas[fecha].forEach((archivo, index) => {
            let ulDatos = document.createElement("ul");
            
            let liHora = document.createElement("li");
            liHora.textContent = archivo.hora;
            ulDatos.appendChild(liHora);

            let liMoneda = document.createElement("li");
            liMoneda.textContent = archivo.moneda;
            ulDatos.appendChild(liMoneda);

            let liCompra = document.createElement("li");
            liCompra.textContent = archivo.compra;
            ulDatos.appendChild(liCompra);

            let liVenta = document.createElement("li");
            liVenta.textContent = archivo.venta;
            ulDatos.appendChild(liVenta);

            let liAccion = document.createElement("li");
            let trashIcon = document.createElement("i");
            trashIcon.classList.add("fa-solid", "fa-trash-can");
            trashIcon.dataset.fecha = fecha;
            trashIcon.dataset.index = index;
            liAccion.appendChild(trashIcon);
            ulDatos.appendChild(liAccion);

            div.appendChild(ulDatos);
        });
        container.appendChild(div);
    });
}

// Borrar elemento de la lista y recargar la pagina
function inicializarEventos(fechasAgrupadas, container) {
    container.addEventListener("click", function(e) {
        if (e.target.classList.contains("fa-trash-can")) {
            const fecha = e.target.dataset.fecha;
            const index = e.target.dataset.index;

            fechasAgrupadas[fecha].splice(index, 1);

            if (fechasAgrupadas[fecha].length === 0) {
                delete fechasAgrupadas[fecha];
            }

            const nuevoArchivo = [];
            Object.keys(fechasAgrupadas).forEach(fecha => {
                fechasAgrupadas[fecha].forEach(archivo => {
                    nuevoArchivo.push(archivo);
                });
            });
            localStorage.setItem('miArchivo', JSON.stringify(nuevoArchivo));

            location.reload();
        }
    });
}

// Imprimir contenido del archivo
function imprSelec(nombre) {
    var contenido = document.getElementById(nombre).innerHTML;
    var contenidoOriginal = document.body.innerHTML;
    document.body.innerHTML = contenido;
    window.print();
    document.body.innerHTML = contenidoOriginal;
}