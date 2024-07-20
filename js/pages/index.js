// Guardar favoritos en localStorage
function guardarIndexFavoritos() {
    const favoritos = []
    const botones = document.querySelectorAll("main button");
    
    botones.forEach((boton, index) => {
        if (boton.classList.contains("favorito")) {
            favoritos.push({index});
        }
    });

    localStorage.setItem('favoritos', JSON.stringify(favoritos));
}

// Guardar datos favoritos en localStorage
function guardarMiArchivoFavoritos(boton) {
    const miArchivo = JSON.parse(localStorage.getItem('miArchivo')) || [];
    const fechaActual = new Date();
    const fecha = obtenerSoloFecha(fechaActual);
    const hora = obtenerSoloHora(fechaActual);
    const moneda = boton.closest('.valores').querySelector('.moneda').textContent.trim();
    const compra = boton.closest('.valores').querySelectorAll('p')[1].textContent.replace('Compra', '').trim();
    const venta = boton.closest('.valores').querySelectorAll('p')[2].textContent.replace('Venta', '').trim();
    
    let encontrado = false;
    miArchivo.forEach((archivo) => {
        if (archivo.fecha === fecha && archivo.moneda === moneda && archivo.compra === compra && archivo.venta === venta) {
            encontrado = true;
        }
    });

    if (!encontrado) {
        miArchivo.push({ fecha, hora, moneda, compra, venta });
        localStorage.setItem('miArchivo', JSON.stringify(miArchivo));
    }
}

// Formatear la fecha a dd/mm/yyyy
function obtenerSoloFecha(fecha) {
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const año = fecha.getFullYear();
    
    return `${dia}/${mes}/${año}`;
}

// Formatear la hora a hh/mm/ss
function obtenerSoloHora(fecha) {
    const horas = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    const segundos = String(fecha.getSeconds()).padStart(2, '0');
    
    return `${horas}:${minutos}:${segundos}`;
}


// Cargar favoritos desde localStorage
function cargarFavoritos() {
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    const botones = document.querySelectorAll("main button");
    favoritos.forEach((favorito) => {
        if (botones[favorito.index]) {
            botones[favorito.index].classList.add("favorito");
        }
    });
}

// Asignar eventos a los botones
function asignarEventosBotones() {
    const botones = document.querySelectorAll("main button");
    botones.forEach((boton) => {
        boton.addEventListener("click", function() {
            if (boton.classList.contains("favorito")) {
                boton.classList.remove("favorito");
            } else {
                boton.classList.add("favorito");
                guardarMiArchivoFavoritos(boton);
            }
        guardarIndexFavoritos();    
        });
    });
}

// Mostrar los datos
function mostrarDatos(datos) {
    const grilla = document.querySelector(".grilla");

    grilla.innerHTML = '';

    datos.forEach((dato) => {
        let pMoneda = document.createElement("p");
        pMoneda.classList.add("moneda");
        pMoneda.textContent = dato.nombre;

        let pCompra = document.createElement("p");
        pCompra.innerHTML = `Compra<br>$${dato.compra.toFixed(2)}`;

        let pVenta = document.createElement("p");
        pVenta.innerHTML = `Venta<br>$${dato.venta.toFixed(2)}`;

        let icono = document.createElement("i");
        icono.classList.add("fa-solid", "fa-star");

        let boton = document.createElement("button");
        boton.appendChild(icono);

        let div = document.createElement("div");
        div.classList.add("valores");

        div.appendChild(pMoneda);
        div.appendChild(pCompra);
        div.appendChild(pVenta);
        div.appendChild(boton);

        grilla.appendChild(div);
    });

    asignarEventosBotones();

    cargarFavoritos();
}

// Mostrar fecha y hora de la ultima actualizacion
function mostrarUltimaActualizacion() {
    const fecha = new Date().toLocaleString();
    const actualizacion = document.getElementById("datosActualizados");
    actualizacion.textContent = `Última Actualización: ${fecha} Hs`;
}

// Obtener y mostrar los datos desde las APIs
function actualizarDatos() {
    Promise.all([
        fetch("https://dolarapi.com/v1/dolares").then(response => response.json()),
        fetch("https://dolarapi.com/v1/cotizaciones").then(response => response.json())
    ])
    .then(([dolares, cotizaciones]) => {
        // Excluye el primer elemento de cotizaciones y combina en una sola variable
        cotizaciones.shift();
        const data = dolares.concat(cotizaciones);
        
        mostrarDatos(data);
        mostrarUltimaActualizacion();
    })
    .catch(error => alert("Error consiguiendo los datos:", error));
}

// Funcion principal
document.addEventListener("DOMContentLoaded", function() {
    const cotizacionesSelect = document.getElementById("cotizaciones");

    // Mostrar y ocultar segun el selector
    cotizacionesSelect.addEventListener("change", function() {
        const valores = document.querySelectorAll(".valores");
        const filtro = this.value;

        valores.forEach((valor) => {
            const moneda = valor.querySelector(".moneda").textContent;
            if (filtro === "Todas") {
                valor.classList.add("show");
                valor.classList.remove("hide");
            } else if (filtro === "Favoritas") {
                if (valor.querySelector("button").classList.contains("favorito")) {
                    valor.classList.add("show");
                    valor.classList.remove("hide");
                } else {
                    valor.classList.add("hide");
                    valor.classList.remove("show");
                }
            } else {
                if (moneda === filtro) {
                    valor.classList.add("show");
                    valor.classList.remove("hide");
                } else {
                    valor.classList.add("hide");
                    valor.classList.remove("show");
                }
            }
        });
    });

    actualizarDatos();

    // Actualizar los datos cada 5 minutos
    setInterval(actualizarDatos, 300000);
});