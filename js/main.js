document.addEventListener('DOMContentLoaded', function () {
    const servicios = [
        { id: 1, nombre: "Netflix", precio: 9.90 },
        { id: 2, nombre: "CrunchyRoll", precio: 8.99 },
        { id: 3, nombre: "Disney+", precio: 7.99 },
        { id: 4, nombre: "HBO Max", precio: 6.99 },
        { id: 5, nombre: "Apple TV+", precio: 5.99 }
    ];

    let carrito = [];

    // Recuperar carrito desde localStorage al cargar la página
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarContadorCarrito();
    }

    function mostrarServicios() {
        const listaServicios = document.getElementById("lista-servicios");

        if (!listaServicios) {
            console.error("Elemento 'lista-servicios' no encontrado en el DOM.");
            return;
        }

        listaServicios.innerHTML = ""; // Limpiar la lista antes de mostrar los servicios

        servicios.forEach(servicio => {
            const listItem = document.createElement("li");
            listItem.className = "list-group-item d-flex justify-content-between align-items-center";
            listItem.innerHTML = `
                ${servicio.nombre} - Precio: $${servicio.precio}
                <div>
                    <button class="btn btn-primary btn-sm" onclick="agregarAlCarrito(${servicio.id})">Agregar al Carrito</button>
                    <button class="btn btn-danger btn-sm ms-2" onclick="eliminarDelCarrito(${servicio.id})">Eliminar</button>
                </div>
            `;
            listaServicios.appendChild(listItem);
        });

        // Botón para mostrar la suma total
        const botonSumaTotal = document.createElement("button");
        botonSumaTotal.className = "btn btn-success mt-3";
        botonSumaTotal.textContent = "Mostrar Suma Total";
        botonSumaTotal.onclick = mostrarSumaTotal;
        listaServicios.appendChild(botonSumaTotal);

        // Elemento para mostrar la suma total
        const sumaTotalElemento = document.createElement("p");
        sumaTotalElemento.id = "suma-total";
        listaServicios.appendChild(sumaTotalElemento);
    }

    function mostrarSumaTotal() {
        const sumaTotal = carrito.reduce((total, servicio) => total + servicio.precio, 0);
        const sumaTotalElemento = document.getElementById("suma-total");

        if (sumaTotalElemento) {
            sumaTotalElemento.textContent = `La suma total de los servicios seleccionados es: $${sumaTotal.toFixed(2)}`;
        }
    }

    function actualizarContadorCarrito() {
        document.getElementById("contador-carrito").textContent = carrito.length;
    }

    window.agregarAlCarrito = function (servicioId) {
        const servicioExistente = carrito.find(servicio => servicio.id === servicioId);

        if (servicioExistente) {
            alert("Este servicio ya está en el carrito.");
            return;
        }

        const servicioSeleccionado = servicios.find(servicio => servicio.id === servicioId);
        if (servicioSeleccionado) {
            carrito.push(servicioSeleccionado);
            actualizarContadorCarrito();
            mostrarServicios();
            // Guardar carrito en localStorage
            localStorage.setItem('carrito', JSON.stringify(carrito));
        }
    };

    window.eliminarDelCarrito = function (servicioId) {
        carrito = carrito.filter(servicio => servicio.id !== servicioId);
        actualizarContadorCarrito();
        mostrarServicios();
        // Guardar carrito en localStorage
        localStorage.setItem('carrito', JSON.stringify(carrito));
    };

    mostrarServicios();
});
