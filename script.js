//añadimos un evento para que se ejecute cuando el contenido del html haya sido ejecutado en la pagina
document.addEventListener("DOMContentLoaded", function() {
    // Creamos las variables con las que vamos a trabajar
        const formulario = document.getElementById("formularioProductos");
        const nombreProductoInput = document.getElementById("nombreProducto");
        const precioProductoInput = document.getElementById("precioProducto");
        const cantidadInput = document.getElementById("cantidad");
        const cuerpoTabla = document.getElementById("cuerpoTabla");
        const btnAñadir = document.getElementById("btnAñadir");
        const btnActualizar = document.getElementById("btnActualizar");
        let editarIndice = null;
    
        /* Cargamos los productos almacenados en el Localstorage y  los convierte de JSON a un arreglo de 
         objetos y luego los recorre para mostrarlos en la tabla */
        const cargarInventario = () => {
            const productos = JSON.parse(localStorage.getItem("productos")) || [];
            cuerpoTabla.innerHTML = "";
            productos.forEach((producto, indice) => {
                const row = `
                    <tr>
                        <td>${producto.nombreProducto}</td>
                        <td>${producto.precioProducto}</td>
                        <td>${producto.cantidad}</td>
                        <!--Aqui creamos los botones de editar y eliminar para cada producto-->
                        <td>
                            <button class="btn btn-warning" onclick="editarProducto(${indice})">Editar</button>
                            <button class="btn btn-danger" onclick="eliminarProducto(${indice})">Eliminar</button>
                        </td>
                    </tr>`;
                cuerpoTabla.innerHTML += row;
            });
        };
    
        // Guardar inventario en localStorage y convierte el arreglo de produtos en una cadena JSON para que sea persistente en el navegador
        const guardarInventario = (productos) => {
            localStorage.setItem("productos", JSON.stringify(productos));
        };
     
        // Agregamos los productos y evitamos que se recargue la pagina
        btnAñadir.addEventListener("click", function(e) {
            e.preventDefault();
            //obtenemos los datos de los campos
            const nombreProducto = nombreProductoInput.value;
            const precioProducto = precioProductoInput.value;
            const cantidad = cantidadInput.value;
            //Validamos que los campos no esten vacios
            if (!nombreProducto || !precioProducto || !cantidad) {
                alert("Por favor complete todos los campos")
            return; //Con este return detenemos la ejecucion si algun campo se encuentra vacio
            }
            //los datos estan en un JSON y los almacenamos en el array "productos"
            let productos = JSON.parse(localStorage.getItem("productos")) || [];
            // Aqui validamos si el indice esta vacio o no para saber si el producto es nuevo o si se esta editando
            if (editarIndice !== null) {
                // Actualizar un producto existente
                productos[editarIndice] = { nombreProducto, precioProducto, cantidad };
                editarIndice = null;
                // Seteamos el texto "Agregar producto al boton añadir"
                btnAñadir.textContent = "Agregar Producto"
            } else {
                // Agregar nuevo producto
                productos.push({ nombreProducto, precioProducto, cantidad });
            }   
    
            // Se guardan los datos y se reestablece el formulario
            guardarInventario(productos);
            cargarInventario();
            formulario.reset();
        });
    
        // Eliminamos el producto y se vuelve a cargar la tabla con los datos actualizados
        window.eliminarProducto = (indice) => {
            let productos = JSON.parse(localStorage.getItem("productos")) || [];
            productos.splice(indice, 1);
            guardarInventario(productos);
            cargarInventario();
        };
    
        // Editamos el producto con el indice que tiene asignado el producto en la tabla
        window.editarProducto = (indice) => {
            let productos = JSON.parse(localStorage.getItem("productos")) || [];
            const producto = productos[indice];
            nombreProductoInput.value = producto.nombreProducto;
            precioProductoInput.value = producto.precioProducto;
            cantidadInput.value = producto.cantidad;
            editarIndice = indice;
            // Actualizamos el texto del boton para que nos diga "Guardar Cambios"
            btnAñadir.textContent = "Guardar Cambios"
        };
    
        // Actualizamos el producto y se vuelve a guardar en la posicion de la tabla en la que estaba
        btnActualizar.addEventListener("click", function(e) {
            e.preventDefault();
            if (editarIndice !== null) {
                const nombreProducto = nombreProductoInput.value;
                const precioProducto = precioProductoInput.value;
                const cantidad = cantidadInput.value;
    
                let productos = JSON.parse(localStorage.getItem("productos")) || [];
                productos[editarIndice] = { nombreProducto, precioProducto, cantidad };
    
                guardarInventario(productos);
                cargarInventario();
                formulario.reset();
                editarIndice = null;   
            }
            
        });
    
        // Cargar inventario al inicio
        cargarInventario();
    
        // agregamos la funcion para buscar el texto en la tabla con la funcion "keyup" que es la que nos ayuda a buscar en tiempo real
        document.getElementById('buscador').addEventListener('keyup', function() {
            const textoBuscado = this.value.toLowerCase();
            const filas = document.querySelectorAll('#cuerpoTabla tr');
    
            filas.forEach(fila => {
                const nombreProducto = fila.querySelector('td').textContent.toLowerCase();
                fila.style.display = nombreProducto.includes(textoBuscado) ? '' : 'none';
            });
        });
    });
    
