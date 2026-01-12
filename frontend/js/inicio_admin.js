// Referencias al DOM
const eventosContainer = document.getElementById("eventos");
const btnCrearEvento = document.getElementById("btnCrearEvento");
let eventoSeleccionado = null;

// Sidebar
function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("active");
}
function verPerfil() { alert("Aquí se mostraría la información del perfil."); }
function cerrarSesion() { window.location.href = "/index.html"; }

// Renderizar eventos con botones circulares
function renderEventos(eventos) {
  eventosContainer.innerHTML = "";

  if (eventos.length === 0) {
    const msg = document.createElement("div");
    msg.className = "no-eventos";
    msg.textContent = "No hay eventos para seleccionar";
    eventosContainer.appendChild(msg);
    return;
  }

  eventos.forEach(evento => {
    const item = document.createElement("div");
    item.className = "evento-item";

    const btn = document.createElement("button");
    btn.className = "evento-btn";
    btn.textContent = evento.nombre;
    btn.onclick = () => ingresarEvento(evento.id);

    const actions = document.createElement("div");
    actions.className = "action-buttons";

    const updateBtn = document.createElement("button");
    updateBtn.className = "circle-btn update-btn";
    updateBtn.textContent = "✎";
    updateBtn.onclick = () => abrirUpdate(evento);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "circle-btn delete-btn";
    deleteBtn.textContent = "🗑";
    deleteBtn.onclick = () => abrirDelete(evento);

    actions.appendChild(updateBtn);
    actions.appendChild(deleteBtn);

    item.appendChild(btn);
    item.appendChild(actions);
    eventosContainer.appendChild(item);
  });
}

// Función para ingresar a un evento
function ingresarEvento(id) {
  window.location.href = `/evento_admin.html?id=${id}`;
}

// Cargar eventos desde backend
async function cargarEventos() {
  try {
    const response = await fetch("/eventos");
    if (!response.ok) throw new Error("Error al obtener eventos");
    const data = await response.json();
    renderEventos(data);
  } catch (err) {
    console.error(err);
    eventosContainer.innerHTML = "<p>Error al cargar eventos</p>";
  }
}

// ------------------ CREAR EVENTO ------------------
btnCrearEvento.addEventListener("click", () => {
  document.getElementById("modalEvento").style.display = "block";
});
document.getElementById("closeModalEvento").addEventListener("click", () => {
  document.getElementById("modalEvento").style.display = "none";
  document.getElementById("errorMsg").textContent = "";
  document.getElementById("formEvento").reset();
});
document.getElementById("formEvento").addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value.trim();
  const fecha = document.getElementById("fecha").value.trim();
  const lugar = document.getElementById("lugar").value.trim();

  if (!nombre || !fecha || !lugar) {
    document.getElementById("errorMsg").textContent = "⚠️ Todos los campos son obligatorios.";
    return;
  }

  try {
    const response = await fetch("/eventos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, fecha, lugar, creado_por: 1 })
    });
    if (!response.ok) throw new Error("Error al crear evento");
    await response.json();
    document.getElementById("modalEvento").style.display = "none";
    cargarEventos();
  } catch (err) {
    document.getElementById("errorMsg").textContent = "❌ Error al crear evento.";
  }
});

// ------------------ UPDATE EVENTO ------------------
function abrirUpdate(evento) {
  eventoSeleccionado = evento;
  document.getElementById("updateNombre").value = evento.nombre;
  document.getElementById("updateFecha").value = evento.fecha;
  document.getElementById("updateLugar").value = evento.lugar;
  document.getElementById("modalUpdate").style.display = "block";
}
document.getElementById("closeUpdate").addEventListener("click", () => {
  document.getElementById("modalUpdate").style.display = "none";
});
document.getElementById("formUpdate").addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = document.getElementById("updateNombre").value.trim();
  const fecha = document.getElementById("updateFecha").value.trim();
  const lugar = document.getElementById("updateLugar").value.trim();

  if (!nombre || !fecha || !lugar) {
    document.getElementById("updateError").textContent = "⚠️ Todos los campos son obligatorios.";
    return;
  }

  try {
    const response = await fetch(`/eventos/${eventoSeleccionado.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, fecha, lugar })
    });
    if (!response.ok) throw new Error("Error al actualizar evento");
    await response.json();
    document.getElementById("modalUpdate").style.display = "none";
    cargarEventos();
  } catch (err) {
    document.getElementById("updateError").textContent = "❌ Error al actualizar evento.";
  }
});

// ------------------ DELETE EVENTO ------------------
function abrirDelete(evento) {
  eventoSeleccionado = evento;
  document.getElementById("modalDelete").style.display = "block";
}
document.getElementById("closeDelete").addEventListener("click", () => {
  document.getElementById("modalDelete").style.display = "none";
});
document.getElementById("cancelDelete").addEventListener("click", () => {
  document.getElementById("modalDelete").style.display = "none";
});
document.getElementById("confirmDelete").addEventListener("click", async () => {
  try {
    const response = await fetch(`/eventos/${eventoSeleccionado.id}`, {
      method: "DELETE"
    });
    if (!response.ok) throw new Error("Error al borrar evento");
    await response.json();
    document.getElementById("modalDelete").style.display = "none";
    cargarEventos();
  } catch (err) {
    alert("❌ Error al borrar evento.");
  }
});

// Inicializar vista
cargarEventos();
