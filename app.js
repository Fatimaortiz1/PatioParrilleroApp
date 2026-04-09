let carrito = [];
let productos = [];

const productosBase = [
  {
    nombre: "Hamburguesa Clásica",
    precio: 85,
    imagen: "img/hamburguesa.jpg",
    descripcion: "Carne, queso, lechuga y jitomate",
    categoria: "Hamburguesas"
  },
  {
    nombre: "Alitas BBQ",
    precio: 110,
    imagen: "img/alitas.jpg",
    descripcion: "Alitas bañadas en salsa BBQ",
    categoria: "Alitas"
  },
  {
    nombre: "Papas Gajo",
    precio: 70,
    imagen: "img/papas.jpg",
    descripcion: "Papas crujientes con aderezo",
    categoria: "Extras"
  }
];

function cargarCarrito() {
  try {
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];

    carrito = carritoGuardado.map(producto => ({
      nombre: producto.nombre,
      precio: Number(producto.precio),
      cantidad: Number(producto.cantidad) || 1
    }));
  } catch (error) {
    carrito = [];
    localStorage.removeItem("carrito");
  }
}

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function cargarProductos() {
  try {
    const productosGuardados = JSON.parse(localStorage.getItem("productos"));

    if (productosGuardados && productosGuardados.length > 0) {
      productos = productosGuardados;
    } else {
      productos = [...productosBase];
      guardarProductos();
    }
  } catch (error) {
    productos = [...productosBase];
    guardarProductos();
  }
}

function guardarProductos() {
  localStorage.setItem("productos", JSON.stringify(productos));
}

function actualizarBotonCarrito() {
  const botonCarrito = document.getElementById("boton-carrito");
  if (!botonCarrito) return;

  let totalProductos = 0;

  carrito.forEach(producto => {
    totalProductos += Number(producto.cantidad);
  });

  botonCarrito.textContent = `Ver carrito (${totalProductos})`;
}

function agregarAlCarrito(nombre, precio) {
  const index = carrito.findIndex(producto => producto.nombre === nombre);

  if (index !== -1) {
    carrito[index].cantidad += 1;
  } else {
    carrito.push({
      nombre: nombre,
      precio: Number(precio),
      cantidad: 1
    });
  }

  guardarCarrito();
  actualizarBotonCarrito();
  alert(nombre + " agregado al carrito");
}

function mostrarProductos() {
  const listaProductos = document.getElementById("lista-productos");
  if (!listaProductos) return;

  listaProductos.innerHTML = "";

  productos.forEach(producto => {
    listaProductos.innerHTML += `
      <div class="card">
        <img src="${producto.imagen}" alt="${producto.nombre}" width="200">
        <h3>${producto.nombre}</h3>
        <p>${producto.descripcion}</p>
        <p><strong>$${producto.precio}</strong></p>
        <button class="button" onclick="agregarAlCarrito('${producto.nombre}', ${producto.precio})">
          Agregar
        </button>
      </div>
    `;
  });
}

function agregarProductoAdmin() {
  const nombre = document.getElementById("adminNombre").value.trim();
  const precio = Number(document.getElementById("adminPrecio").value);
  const imagen = document.getElementById("adminImagen").value.trim();
  const categoria = document.getElementById("adminCategoria").value.trim();
  const descripcion = document.getElementById("adminDescripcion").value.trim();

  if (!nombre || !precio || !imagen || !categoria || !descripcion) {
    alert("Por favor llena todos los campos del producto");
    return;
  }

  productos.push({
    nombre,
    precio,
    imagen,
    categoria,
    descripcion
  });

  guardarProductos();
  mostrarProductos();
  mostrarProductosAdmin();

  document.getElementById("adminNombre").value = "";
  document.getElementById("adminPrecio").value = "";
  document.getElementById("adminImagen").value = "";
  document.getElementById("adminCategoria").value = "";
  document.getElementById("adminDescripcion").value = "";

  alert("Producto agregado correctamente");
}

function mostrarProductosAdmin() {
  const listaAdmin = document.getElementById("lista-admin-productos");
  if (!listaAdmin) return;

  listaAdmin.innerHTML = "";

  if (productos.length === 0) {
    listaAdmin.innerHTML = "<p>No hay productos registrados.</p>";
    return;
  }

  productos.forEach((producto, index) => {
    listaAdmin.innerHTML += `
      <div class="card">
        <img src="${producto.imagen}" alt="${producto.nombre}" width="120">
        <h3>${producto.nombre}</h3>
        <p>${producto.categoria}</p>
        <p>${producto.descripcion}</p>
        <p><strong>$${producto.precio}</strong></p>
        <button class="button" onclick="eliminarProductoAdmin(${index})">Eliminar</button>
      </div>
    `;
  });
}

function eliminarProductoAdmin(index) {
  productos.splice(index, 1);
  guardarProductos();
  mostrarProductos();
  mostrarProductosAdmin();
}

function mostrarCarrito() {
  cargarCarrito();

  const listaCarrito = document.getElementById("lista-carrito");
  const totalBox = document.getElementById("total");

  if (!listaCarrito || !totalBox) return;

  listaCarrito.innerHTML = "";
  totalBox.textContent = "$0";

  if (!Array.isArray(carrito) || carrito.length === 0) {
    listaCarrito.innerHTML = "<p>No hay productos en el carrito.</p>";
    return;
  }

  let total = 0;
  let html = "";

  carrito.forEach((producto, index) => {

    const precio = Number(producto.precio) || 0;
    const cantidad = Number(producto.cantidad) || 1;
    const subtotal = precio * cantidad;

    total += subtotal;

    html += `
    
<div class="cart-line">

  <div class="cart-top">

        <div class="cart-name">
          ${producto.nombre}
    </div>

    <div class="cart-controls">
      <button onclick="disminuirCantidad(${index})">-</button>

      <span>${cantidad}</span>
      <button onclick="aumentarCantidad(${index})">+</button>

      <button class="cart-delete" onclick="eliminarProducto(${index})">✕</button>
    </div>

  </div>

  <div class="cart-bottom">
    $${subtotal}
  </div>

</div>
`;

  });

  listaCarrito.innerHTML = html;
  totalBox.textContent = "$" + total;
}
function aumentarCantidad(index) {
  carrito[index].cantidad += 1;
  guardarCarrito();
  mostrarCarrito();
  actualizarBotonCarrito();
}

function disminuirCantidad(index) {
  if (carrito[index].cantidad > 1) {
    carrito[index].cantidad -= 1;
  } else {
    carrito.splice(index, 1);
  }

  guardarCarrito();
  mostrarCarrito();
  actualizarBotonCarrito();
}

function eliminarProducto(index) {
  carrito.splice(index, 1);
  guardarCarrito();
  mostrarCarrito();
  actualizarBotonCarrito();
}

function vaciarCarrito() {
  carrito = [];
  guardarCarrito();
  mostrarCarrito();
  actualizarBotonCarrito();

function guardarNotaPedido() {
  const notaInput = document.getElementById("notaPedido");
  if (!notaInput) return;

  localStorage.setItem("notaPedido", notaInput.value);
}
function guardarNotaPedido() {
  const notaInput = document.getElementById("notaPedido");
  if (!notaInput) return;

  localStorage.setItem("notaPedido", notaInput.value);
}

}

function mostrarDireccion() {
  const tipoEntrega = document.getElementById("tipoEntrega").value;
  const contenedorDireccion = document.getElementById("contenedorDireccion");

  if (!contenedorDireccion) return;

  if (tipoEntrega === "domicilio") {
    contenedorDireccion.style.display = "block";
  } else {
    contenedorDireccion.style.display = "none";

    const direccionInput = document.getElementById("direccion");
    const referenciasInput = document.getElementById("referencias");

    if (direccionInput) direccionInput.value = "";
    if (referenciasInput) referenciasInput.value = "";
  }
}
function mostrarPago() {
  const metodoPago = document.getElementById("metodoPago").value;
  const bloqueTransferencia = document.getElementById("bloqueTransferencia");
  const bloqueTarjeta = document.getElementById("bloqueTarjeta");

  if (bloqueTransferencia) bloqueTransferencia.style.display = "none";
  if (bloqueTarjeta) bloqueTarjeta.style.display = "none";

  if (metodoPago === "transferencia" && bloqueTransferencia) {
    bloqueTransferencia.style.display = "block";
  }

  if (metodoPago === "tarjeta" && bloqueTarjeta) {
    bloqueTarjeta.style.display = "block";
  }
}

function copiarClabe() {
  const clabe = document.getElementById("clabeTexto").textContent.trim();
  navigator.clipboard.writeText(clabe)
    .then(() => alert("CLABE copiada"))
    .catch(() => alert("No se pudo copiar la CLABE"));
}

function abrirPagoTarjeta() {
  const linkPagoTarjeta = "https://link.mercadopago.com.mx/patioparrillero";
  window.open(linkPagoTarjeta, "_blank");
}

function obtenerNombreArchivoPago() {
  const input = document.getElementById("capturaPago");
  if (!input || !input.files || input.files.length === 0) return "";
  return input.files[0].name;
}

function prepararInputCapturaPago() {
  const input = document.getElementById("capturaPago");
  const texto = document.getElementById("nombreArchivoPago");

  if (!input || !texto) return;

  input.addEventListener("change", function () {
    if (input.files && input.files.length > 0) {
      texto.textContent = "Archivo seleccionado: " + input.files[0].name;
    } else {
      texto.textContent = "";
    }
  });
}

function actualizarVistaTicket() {
  const nombre = document.getElementById("nombre")?.value.trim() || "";
  const telefono = document.getElementById("telefono")?.value.trim() || "";
  const tipoEntrega = document.getElementById("tipoEntrega")?.value || "";
  const metodoPago = document.getElementById("metodoPago")?.value || "";
  const notaPedido = localStorage.getItem("notaPedido") || "";

  const ticketNombre = document.getElementById("ticketNombre");
  const ticketTelefono = document.getElementById("ticketTelefono");
  const ticketEntrega = document.getElementById("ticketEntrega");
  const ticketPago = document.getElementById("ticketPago");
  const ticketProductos = document.getElementById("ticketProductos");
  const ticketNotas = document.getElementById("ticketNotas");
  const ticketTotal = document.getElementById("ticketTotal");

  if (!ticketNombre || !ticketTelefono || !ticketEntrega || !ticketPago || !ticketProductos || !ticketNotas || !ticketTotal) {
    return;
  }

  ticketNombre.textContent = "Cliente: " + (nombre || "-");
  ticketTelefono.textContent = "Teléfono: " + (telefono || "-");
  ticketEntrega.textContent = "Entrega: " + (tipoEntrega || "-");
  ticketPago.textContent = "Pago: " + (metodoPago || "-");
  ticketNotas.textContent = "Indicaciones: " + (notaPedido || "Sin indicaciones");

  let html = "";
  let total = 0;

  carrito.forEach(producto => {
    const precio = Number(producto.precio) || 0;
    const cantidad = Number(producto.cantidad) || 1;
    const subtotal = precio * cantidad;
    total += subtotal;

    html += `<p>${producto.nombre} x${cantidad} - $${subtotal}</p>`;
  });

  ticketProductos.innerHTML = html || "<p>Sin productos</p>";
  ticketTotal.textContent = "Total: $" + total;
}

function prepararVistaTicket() {
  const campos = ["nombre", "telefono", "tipoEntrega", "metodoPago", "direccion", "referencias", "notaPedido"];

  campos.forEach(id => {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.addEventListener("input", actualizarVistaTicket);
      elemento.addEventListener("change", actualizarVistaTicket);
    }
  });

  actualizarVistaTicket();
}
function actualizarVistaTicket() {
  const nombre = document.getElementById("nombre")?.value.trim() || "";
  const telefono = document.getElementById("telefono")?.value.trim() || "";
  const tipoEntrega = document.getElementById("tipoEntrega")?.value || "";
  const metodoPago = document.getElementById("metodoPago")?.value || "";
  const notaPedido = localStorage.getItem("notaPedido") || "";

  const ticketNombre = document.getElementById("ticketNombre");
  const ticketTelefono = document.getElementById("ticketTelefono");
  const ticketEntrega = document.getElementById("ticketEntrega");
  const ticketPago = document.getElementById("ticketPago");
  const ticketProductos = document.getElementById("ticketProductos");
  const ticketNotas = document.getElementById("ticketNotas");
  const ticketTotal = document.getElementById("ticketTotal");

  if (!ticketNombre || !ticketTelefono || !ticketEntrega || !ticketPago || !ticketProductos || !ticketNotas || !ticketTotal) {
    return;
  }

  ticketNombre.textContent = "Cliente: " + (nombre || "-");
  ticketTelefono.textContent = "Teléfono: " + (telefono || "-");
  ticketEntrega.textContent = "Entrega: " + (tipoEntrega || "-");
  ticketPago.textContent = "Pago: " + (metodoPago || "-");
  ticketNotas.textContent = "Indicaciones: " + (notaPedido || "Sin indicaciones");

  let html = "";
  let total = 0;

  carrito.forEach(producto => {
    const precio = Number(producto.precio) || 0;
    const cantidad = Number(producto.cantidad) || 1;
    const subtotal = precio * cantidad;
    total += subtotal;

    html += `<p>${producto.nombre} x${cantidad} - $${subtotal}</p>`;
  });

  ticketProductos.innerHTML = html || "<p>Sin productos</p>";
  ticketTotal.textContent = "Total: $" + total;
}

function prepararVistaTicket() {
  const campos = ["nombre", "telefono", "tipoEntrega", "metodoPago", "direccion", "referencias", "notaPedido"];

  campos.forEach(id => {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.addEventListener("input", actualizarVistaTicket);
      elemento.addEventListener("change", actualizarVistaTicket);
    }
  });

  actualizarVistaTicket();
}
function dibujarTextoMultilinea(ctx, texto, x, y, maxWidth, lineHeight) {
  const palabras = texto.split(" ");
  let linea = "";

  for (let i = 0; i < palabras.length; i++) {
    const prueba = linea + palabras[i] + " ";
    const ancho = ctx.measureText(prueba).width;

    if (ancho > maxWidth && i > 0) {
      ctx.fillText(linea, x, y);
      linea = palabras[i] + " ";
      y += lineHeight;
    } else {
      linea = prueba;
    }
  }

  ctx.fillText(linea, x, y);
  return y + lineHeight;
}

function descargarTicket() {
  if (!Array.isArray(carrito) || carrito.length === 0) {
    alert("No hay productos en el carrito");
    return;
  }

  const nombre = document.getElementById("nombre")?.value.trim() || "-";
  const telefono = document.getElementById("telefono")?.value.trim() || "-";
  const tipoEntrega = document.getElementById("tipoEntrega")?.value || "-";
  const metodoPago = document.getElementById("metodoPago")?.value || "-";
  const notaPedido = localStorage.getItem("notaPedido") || "Sin indicaciones";

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const width = 500;
  const height = 900;
  canvas.width = width;
  canvas.height = height;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#000000";
  ctx.textAlign = "center";
  ctx.font = "bold 26px Arial";
  ctx.fillText("Patio Parrillero", width / 2, 40);

  ctx.font = "16px Arial";
  ctx.fillText("Ticket de pedido", width / 2, 68);

  ctx.textAlign = "left";
  ctx.font = "16px Arial";

  let y = 110;

  ctx.fillText("Cliente: " + nombre, 20, y);
  y += 28;
  ctx.fillText("Teléfono: " + telefono, 20, y);
  y += 28;
  ctx.fillText("Entrega: " + tipoEntrega, 20, y);
  y += 28;
  ctx.fillText("Pago: " + metodoPago, 20, y);
  y += 35;

  ctx.fillText("----------------------------------------------", 20, y);
  y += 30;

  let total = 0;

  carrito.forEach(producto => {
    const precio = Number(producto.precio) || 0;
    const cantidad = Number(producto.cantidad) || 1;
    const subtotal = precio * cantidad;
    total += subtotal;

    y = dibujarTextoMultilinea(ctx, `${producto.nombre} x${cantidad}`, 20, y, 340, 22);
    ctx.fillText(`$${subtotal}`, 400, y - 22);
    y += 6;
  });

  y += 10;
  ctx.fillText("----------------------------------------------", 20, y);
  y += 30;

  y = dibujarTextoMultilinea(ctx, "Indicaciones: " + notaPedido, 20, y, 450, 22);
  y += 10;

  ctx.font = "bold 20px Arial";
  ctx.fillText("Total: $" + total, 20, y);

  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "ticket-patio-parrillero.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function finalizarPedido() {
  const nombre = document.getElementById("nombre").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const tipoEntrega = document.getElementById("tipoEntrega").value;
  const direccionInput = document.getElementById("direccion");
  const referenciasInput = document.getElementById("referencias");
  const direccion = direccionInput ? direccionInput.value.trim() : "";
  const referencias = referenciasInput ? referenciasInput.value.trim() : "";
  const metodoPago = document.getElementById("metodoPago").value;
  const notaPedido = localStorage.getItem("notaPedido") || "";
  const nombreArchivoPago = obtenerNombreArchivoPago();

  const notaTexto = notaPedido
    ? `Indicaciones: ${notaPedido}%0A`
    : "";

  if (!nombre || !telefono || !tipoEntrega || !metodoPago) {
    alert("Por favor llena los campos obligatorios");
    return;
  }

  if (tipoEntrega === "domicilio" && !direccion) {
    alert("Por favor escribe la dirección para entrega a domicilio");
    return;
  }

  if (metodoPago === "transferencia" && !nombreArchivoPago) {
    alert("Por favor selecciona la captura del pago por transferencia");
    return;
  }

  if (carrito.length === 0) {
    alert("Tu carrito está vacío");
    return;
  }

  let total = 0;
  let productosTexto = "";

  carrito.forEach((producto, index) => {
    const subtotal = Number(producto.precio) * Number(producto.cantidad);
    total += subtotal;
    productosTexto += `${index + 1}. ${producto.nombre} x${producto.cantidad} - $${subtotal}%0A`;
  });

  const numeroNegocio = "523414367254";

  const entregaTexto =
    tipoEntrega === "domicilio"
      ? `Dirección: ${direccion}%0AReferencias: ${referencias || "Sin referencias"}%0A`
      : `Entrega: Recoger en el local%0A`;

  const pagoTexto =
    metodoPago === "transferencia"
      ? `Método de pago: Transferencia%0AComprobante: ${nombreArchivoPago}%0A`
      : metodoPago === "tarjeta"
      ? `Método de pago: Tarjeta%0A`
      : `Método de pago: Efectivo%0A`;

  const mensaje =
    `Hola, quiero hacer un pedido en Patio Parrillero.%0A%0A` +
    `Nombre: ${nombre}%0A` +
    `Teléfono: ${telefono}%0A` +
    `Tipo de entrega: ${tipoEntrega}%0A` +
    entregaTexto +
    pagoTexto +
    notaTexto +
    `%0APedido:%0A${productosTexto}%0A` +
    `Total: $${total}`;

  const url = `https://wa.me/${numeroNegocio}?text=${mensaje}`;

  carrito = [];
  guardarCarrito();
  actualizarBotonCarrito();
  localStorage.removeItem("notaPedido");

  window.open(url, "_blank");
  window.location.href = "index.html";
}

function enviarCotizacion() {

  const nombre = document.getElementById("nombreEvento").value.trim();
  const telefono = document.getElementById("telefonoEvento").value.trim();
  const fecha = document.getElementById("fechaEvento").value.trim();
  const personas = document.getElementById("personasEvento").value.trim();
  const lugar = document.getElementById("lugarEvento").value.trim();
  const detalle = document.getElementById("detalleEvento").value.trim();

  if (!nombre || !telefono || !fecha || !personas || !lugar || !detalle) {
    alert("Por favor llena todos los campos");
    return;
  }

  const numeroNegocio = "523414367254";

  const mensaje =
    `Hola, quiero cotizar un evento en Patio Parrillero.%0A%0A` +
    `Nombre: ${nombre}%0A` +
    `Teléfono: ${telefono}%0A` +
    `Fecha del evento: ${fecha}%0A` +
    `Número de personas: ${personas}%0A` +
    `Lugar: ${lugar}%0A` +
    `Detalles: ${detalle}`;

  const url = `https://wa.me/${numeroNegocio}?text=${mensaje}`;

  window.open(url, "_blank");
}
  const numeroNegocio = "523414367254";

  const mensaje =
  `Hola, quiero hacer un pedido en Patio Parrillero.%0A%0A` +
  `Nombre: ${nombre}%0A` +
  `Teléfono: ${telefono}%0A` +
  `Tipo de entrega: ${tipoEntrega}%0A` +
  entregaTexto +
  `Método de pago: ${metodoPago}%0A` +
  notaTexto +
  `%0APedido:%0A${productosTexto}%0A` +
  `Total: $${total}`;
  const url = `https://wa.me/${numeroNegocio}?text=${mensaje}`;

  window.open(url, "_blank");


function loginAdmin() {
  const usuario = document.getElementById("usuarioAdmin").value.trim();
  const password = document.getElementById("passwordAdmin").value.trim();

  const usuarioCorrecto = "FatimaOrtiz1";
  const passwordCorrecta = "98815334";

  if (usuario === usuarioCorrecto && password === passwordCorrecta) {
    localStorage.setItem("adminLogueado", "true");
    window.location.href = "admin.html";
  } else {
    alert("Usuario o contraseña incorrectos");
  }
}

function verificarAccesoAdmin() {
  const adminLogueado = localStorage.getItem("adminLogueado");

  if (adminLogueado !== "true") {
    alert("Debes iniciar sesión como administrador");
    window.location.href = "login.html";
  }
}

function cerrarSesionAdmin() {
  localStorage.removeItem("adminLogueado");
  window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", function () {
  cargarCarrito();
  cargarProductos();
  mostrarCarrito();
  actualizarBotonCarrito();
  mostrarProductos();
  mostrarProductosAdmin();
  cargarNotaPedido();
  prepararInputCapturaPago();
  mostrarPago();
  prepararVistaTicket();
});
document.addEventListener("DOMContentLoaded", function () {
  cargarCarrito();
  cargarProductos();
  mostrarCarrito();
  actualizarBotonCarrito();
  mostrarProductos();
  mostrarProductosAdmin();
  cargarNotaPedido();
});