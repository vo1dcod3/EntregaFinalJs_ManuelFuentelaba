document.addEventListener('DOMContentLoaded', async () => {
    let carrito = [];

    // Función para cargar servicios 
    const cargarServiciosDesdeJSON = async () => {
        try {
            const response = await fetch('servicios.json');
            if (!response.ok) {
                throw new Error(`Error al cargar servicios: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(error.message);
            throw error; 
        }
    };

    // Función para mostrar la suma total de servicios seleccionados
    const mostrarSumaTotal = () => {
        const sumaTotal = carrito.reduce((total, servicio) => total + servicio.precio, 0);
        const sumaTotalElemento = document.getElementById("suma-total");

        if (sumaTotalElemento) {
            sumaTotalElemento.textContent = `La suma total de los servicios seleccionados es: $${sumaTotal.toFixed(2)}`;
        }
    };

    // Función para actualizar el contador del carrito
    const actualizarContadorCarrito = () => {
        document.getElementById("contador-carrito").textContent = carrito.length;
    };

    // Función para mostrar los servicios en el DOM
    const mostrarServicios = async () => {
        const listaServicios = document.getElementById("lista-servicios");

        if (!listaServicios) {
            console.error("Elemento 'lista-servicios' no encontrado en el DOM.");
            return;
        }

        listaServicios.innerHTML = ""; 

        try {
            const servicios = await cargarServiciosDesdeJSON();

            servicios.forEach(({ nombre, precio, id }) => {
                const listItem = document.createElement("li");
                listItem.className = "list-group-item d-flex justify-content-between align-items-center";
                listItem.innerHTML = `
                    ${nombre} - Precio: $${precio}
                    <div>
                        <button class="btn btn-primary btn-sm" onclick="agregarAlCarrito(${id})">Agregar al Carrito</button>
                        <button class="btn btn-danger btn-sm ms-2" onclick="eliminarDelCarrito(${id})">Eliminar</button>
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
        } catch (error) {
            console.error(error.message);
        }
    };

    // Función para agregar un servicio al carrito
    window.agregarAlCarrito = async (servicioId) => {
        const servicioExistente = carrito.find(servicio => servicio.id === servicioId);

        if (servicioExistente) {
            alert("Este servicio ya está en el carrito.");
            return;
        }

        try {
            const servicios = await cargarServiciosDesdeJSON();
            const servicioSeleccionado = servicios.find(servicio => servicio.id === servicioId);

            if (servicioSeleccionado) {
                carrito.push(servicioSeleccionado);
                actualizarContadorCarrito();
                mostrarServicios();
                // Guardar carrito en localStorage
                localStorage.setItem('carrito', JSON.stringify(carrito));
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    // Función para eliminar un servicio del carrito
    window.eliminarDelCarrito = (servicioId) => {
        carrito = carrito.filter(servicio => servicio.id !== servicioId);
        actualizarContadorCarrito();
        mostrarServicios();
        // Guardar carrito en localStorage
        localStorage.setItem('carrito', JSON.stringify(carrito));
    };

    // Modal de suscripción
    const btnSuscribir = document.getElementById("btnSuscribir");
    const modalSuscripcion = document.getElementById("modalSuscripcion");
    const cerrarModal = document.getElementById("cerrarModal");
    const formularioSuscripcion = document.getElementById("formularioSuscripcion");

    if (btnSuscribir && modalSuscripcion && cerrarModal && formularioSuscripcion) {
        btnSuscribir.addEventListener("click", () => {
            modalSuscripcion.style.display = "block";
        });

        cerrarModal.addEventListener("click", () => {
            modalSuscripcion.style.display = "none";
        });

        window.addEventListener("click", (event) => {
            if (event.target === modalSuscripcion) {
                modalSuscripcion.style.display = "none";
            }
        });

        formularioSuscripcion.addEventListener("submit", async (event) => {
            event.preventDefault();

            const correoSuscripcion = document.getElementById("correoSuscripcion").value;

            modalSuscripcion.style.display = "none";

            alert(`Gracias por suscribirte. Recibirás noticias en ${correoSuscripcion}`);
        });
    }

 
    await mostrarServicios(); 
});
