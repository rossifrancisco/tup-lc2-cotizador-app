let chartInstance = null;

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

    mostrarGrafica("Todas");

    const cotizacionesSelect = document.getElementById("cotizaciones");

    // Mostrar y ocultar segun el selector
    cotizacionesSelect.addEventListener("change", function() {
        const filtro = this.value;
        mostrarGrafica(filtro);
    })


    function mostrarGrafica(filtro) {
        // Datos para el gráfico
        const etiquetas = [];
        const datasets = [];
        const colores = ["black", "red", "orange", "yellow", "green", "lime", "blue", "cyan", "purple", "violet", "pink"]; // Colores para las líneas
    
        let fechasAgrupadas = {};
    
        // Agrupar las monedas por fecha
        miArchivo.forEach((archivo) => {
            if (!fechasAgrupadas[archivo.fecha]) {
                fechasAgrupadas[archivo.fecha] = [];
            }
            fechasAgrupadas[archivo.fecha].push(archivo);
        });
    
        // Crear etiquetas a partir de las fechas
        Object.keys(fechasAgrupadas).forEach((fecha) => {
            if (!etiquetas.includes(fecha)) {
                etiquetas.push(fecha);
            }
        });
    
        // Filtrar monedas según el filtro seleccionado
        const monedasFiltradas = filtro === "Todas" ? Object.keys(monedasAgrupadas) : [filtro];
    
        // Crear un conjunto de datos por cada moneda filtrada
        monedasFiltradas.forEach((moneda, index) => {
            const preciosCompra = [];
            const preciosVenta = [];
        
            // Inicializar precios con null para todas las etiquetas
            etiquetas.forEach(etiqueta => {
                preciosCompra.push(null); // Inicialmente, todos los valores son null
                if (filtro !== "Todas") {
                    preciosVenta.push(null);
                }
            });
    
            // Llenar precios con los valores correspondientes
            monedasAgrupadas[moneda].forEach(archivo => {
                const indexEtiqueta = etiquetas.indexOf(archivo.fecha);
                if (indexEtiqueta !== -1) {
                    preciosCompra[indexEtiqueta] = parseFloat(archivo.compra.replace("$", ""));
                    if (filtro !== "Todas") {
                        preciosVenta[indexEtiqueta] = parseFloat(archivo.venta.replace("$", ""));
                    }
                }
            });
        
            // Agregar el dataset al arreglo datasets
            datasets.push({
                label: moneda + " Compra",
                data: preciosCompra,
                borderColor: colores[index],
                fill: false
            });
            if (filtro !== "Todas") {
                datasets.push({
                    label: moneda + " Venta",
                    data: preciosVenta,
                    borderColor: colores[(index + 1)],
                    fill: false
                });
            }
        });
    
        const ctx = document.getElementById("miGrafica").getContext("2d");
    
        if (chartInstance) {
            chartInstance.destroy();
        }
    
        chartInstance = new Chart(ctx, {
            type: "line",
            data: {
                labels: etiquetas,
                datasets: datasets
            },
        });
    }    
});