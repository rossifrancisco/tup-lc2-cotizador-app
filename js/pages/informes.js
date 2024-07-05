document.addEventListener("DOMContentLoaded", function() {
    const miArchivo = JSON.parse(localStorage.getItem('miArchivo')) || [];
    const container = document.querySelector(".container");
    
    let monedasAgrupadas = {};
    
    // Agrupar las monedas por moneda
    miArchivo.forEach((archivo) => {
        if (!monedasAgrupadas[archivo.moneda]) {
            monedasAgrupadas[archivo.moneda] = [];
        }
        monedasAgrupadas[archivo.moneda].push(archivo);
    });
    
    // Crear los elementos HTML
    Object.keys(monedasAgrupadas).forEach(moneda => {
        let div = document.createElement("div");
        div.classList.add("datos");

        let ulMoneda = document.createElement("ul");
        let liMoneda = document.createElement("li");
        liMoneda.classList.add("moneda");
        liMoneda.textContent = moneda;
        ulMoneda.appendChild(liMoneda);
        div.appendChild(ulMoneda);

        let ultimaCompra = null;

        monedasAgrupadas[moneda].forEach(archivo => {
            let ulDatos = document.createElement("ul");

            let liFecha = document.createElement("li");
            liFecha.textContent = archivo.fecha;
            ulDatos.appendChild(liFecha);
            
            let liHora = document.createElement("li");
            liHora.textContent = archivo.hora;
            ulDatos.appendChild(liHora);

            let liCompra = document.createElement("li");
            liCompra.textContent = archivo.compra;
            ulDatos.appendChild(liCompra);

            let liVenta = document.createElement("li");
            liVenta.textContent = archivo.venta;
            ulDatos.appendChild(liVenta);

            let liVariacion = document.createElement("li");
            let arrowIcon = document.createElement("i");

            if (ultimaCompra === null) {
                arrowIcon.classList.add("fa-solid", "fa-circle-xmark");
            } else {

                if (archivo.compra > ultimaCompra) {
                    arrowIcon.classList.add("fa-solid", "fa-circle-arrow-up");
                } else if (archivo.compra < ultimaCompra) {
                    arrowIcon.classList.add("fa-solid", "fa-circle-arrow-down");
                } else {
                    arrowIcon.classList.add("fa-solid", "fa-circle-minus");
                }
            }

            liVariacion.appendChild(arrowIcon);
            ulDatos.appendChild(liVariacion);

            ultimaCompra = archivo.compra;
            div.appendChild(ulDatos)
        });
        container.appendChild(div);
    });

    botonCompartir = document.querySelector("main button");
    modal = document.querySelector(".modal");

    botonCompartir.addEventListener("click", function() {
        modal.classList.add("show");
    })

    closeModal = document.querySelector(".close");

    closeModal.addEventListener("click", function() {
        modal.classList.remove("show");
    })
});