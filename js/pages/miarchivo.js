document.addEventListener("DOMContentLoaded", function() {
    const miArchivo = JSON.parse(localStorage.getItem('miArchivo')) || [];
    const container = document.querySelector(".container");
    
    let fechasAgrupadas = {};
    
    // Agrupar las monedas por fecha
    miArchivo.forEach((archivo) => {
        if (!fechasAgrupadas[archivo.fecha]) {
            fechasAgrupadas[archivo.fecha] = [];
        }
        fechasAgrupadas[archivo.fecha].push(archivo);
    });
    
    // Crear los elementos HTML
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

    // Agregar evento de click a los iconos de basura
    container.addEventListener("click", function(e) {
        if (e.target.classList.contains("fa-trash-can")) {
            const fecha = e.target.dataset.fecha;
            const index = e.target.dataset.index;

            // Eliminar el elemento del array
            fechasAgrupadas[fecha].splice(index, 1);

            // Si no hay más elementos en la fecha, eliminar la fecha del objeto
            if (fechasAgrupadas[fecha].length === 0) {
                delete fechasAgrupadas[fecha];
            }

            // Actualizar el almacenamiento local
            const nuevoArchivo = [];
            Object.keys(fechasAgrupadas).forEach(fecha => {
                fechasAgrupadas[fecha].forEach(archivo => {
                    nuevoArchivo.push(archivo);
                });
            });
            localStorage.setItem('miArchivo', JSON.stringify(nuevoArchivo));

            // Recargar la página para reflejar los cambios
            location.reload();
        }
    });
});

function imprSelec(nombre) {
    var contenido = document.getElementById(nombre).innerHTML;
    var contenidoOriginal = document.body.innerHTML;
    document.body.innerHTML = contenido;
    window.print();
    document.body.innerHTML = contenidoOriginal;
}