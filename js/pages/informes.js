let chartInstance = null;

// Funcion principal
document.addEventListener("DOMContentLoaded", function() {
    const miArchivo = JSON.parse(localStorage.getItem('miArchivo')) || [];
    const container = document.querySelector(".container");
    
    const monedasAgrupadas = agruparMonedas(miArchivo);
    crearElementosHTML(monedasAgrupadas, container);
    inicializarEventos(monedasAgrupadas, miArchivo);
    mostrarGrafica("Todas", monedasAgrupadas, miArchivo);
});

// Agrupar los datos por moneda
function agruparMonedas(miArchivo) {
    let monedasAgrupadas = {};
    miArchivo.forEach((archivo) => {
        if (!monedasAgrupadas[archivo.moneda]) {
            monedasAgrupadas[archivo.moneda] = [];
        }
        monedasAgrupadas[archivo.moneda].push(archivo);
    });
    return monedasAgrupadas;
}

// Crear elementos y agregarlos al HTML
function crearElementosHTML(monedasAgrupadas, container) {
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
}

// Asignacion de eventos
function inicializarEventos(monedasAgrupadas, miArchivo) {
    const botonCompartir = document.querySelector("main button");
    const modal = document.querySelector(".modal");
    const closeModal = document.querySelector(".close");
    const cotizacionesSelect = document.getElementById("cotizaciones");
    const form = document.getElementById('form');

    botonCompartir.addEventListener("click", function() {
        modal.classList.add("show");
    });

    closeModal.addEventListener("click", function() {
        modal.classList.remove("show");
    });

    cotizacionesSelect.addEventListener("change", function() {
        const filtro = this.value;
        mostrarGrafica(filtro, monedasAgrupadas, miArchivo);
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        enviarCorreo(monedasAgrupadas);
    });
}

// Crear y mostrar la grafica
function mostrarGrafica(filtro, monedasAgrupadas, miArchivo) {
    const etiquetas = [];
    const datasets = [];
    const colores = ["black", "red", "orange", "yellow", "green", "lime", "blue", "cyan", "purple", "violet", "pink"];

    let fechasAgrupadas = {};

    miArchivo.forEach((archivo) => {
        if (!fechasAgrupadas[archivo.fecha]) {
            fechasAgrupadas[archivo.fecha] = [];
        }
        fechasAgrupadas[archivo.fecha].push(archivo);
    });

    Object.keys(fechasAgrupadas).forEach((fecha) => {
        if (!etiquetas.includes(fecha)) {
            etiquetas.push(fecha);
        }
    });

    const monedasFiltradas = filtro === "Todas" ? Object.keys(monedasAgrupadas) : [filtro];

    monedasFiltradas.forEach((moneda, index) => {
        const preciosCompra = [];
        const preciosVenta = [];
        
        etiquetas.forEach(etiqueta => {
            preciosCompra.push(null);
            if (filtro !== "Todas") {
                preciosVenta.push(null);
            }
        });

        monedasAgrupadas[moneda].forEach(archivo => {
            const indexEtiqueta = etiquetas.indexOf(archivo.fecha);
            if (indexEtiqueta !== -1) {
                preciosCompra[indexEtiqueta] = parseFloat(archivo.compra.replace("$", ""));
                if (filtro !== "Todas") {
                    preciosVenta[indexEtiqueta] = parseFloat(archivo.venta.replace("$", ""));
                }
            }
        });

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

// Enviar correo con datos del informe
function enviarCorreo(monedasAgrupadas) {
    const dataToSend = [];

    Object.keys(monedasAgrupadas).forEach(moneda => {
        monedasAgrupadas[moneda].forEach(archivo => {
            const enviarMoneda = moneda;
            const enviarFecha = archivo.fecha;
            const enviarHora = archivo.hora;
            const enviarCompra = archivo.compra;
            const enviarVenta = archivo.venta;

            const cadenaDatos = `Moneda: ${enviarMoneda} / Fecha: ${enviarFecha} / Hora: ${enviarHora} / Compra: ${enviarCompra} / Venta: ${enviarVenta}`;
            dataToSend.push(cadenaDatos);
        });
    });

    const datosFormateados = dataToSend.join('\n');
    document.getElementById("datos").value = datosFormateados;

    const serviceID = 'default_service';
    const templateID = 'template_h1p4sga';

    emailjs.sendForm(serviceID, templateID, document.getElementById('form'))
        .then(() => {
            alert('Correo enviado exitosamente');
        }, (err) => {
            alert(JSON.stringify(err));
        });
}