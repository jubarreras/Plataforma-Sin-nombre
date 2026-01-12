


// Sidebar
function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("active");
}

function verPerfil() {
  alert("Aquí se mostraría la información del perfil del usuario.");
}

function cerrarSesion() {
  window.location.href = "/index.html";
}

// Obtener ID del evento desde la URL
const params = new URLSearchParams(window.location.search);
const eventoId = params.get("id");

// Cargar datos del evento desde el backend
async function cargarEvento() {
  try {
    const response = await fetch(`/eventos/${eventoId}`);
    if (!response.ok) throw new Error("Error al obtener evento");
    const evento = await response.json();

    document.getElementById("nombreEvento").textContent = evento.nombre;
  } catch (err) {
    console.error(err);
    document.querySelector(".main").innerHTML = "<p>Error al cargar evento</p>";
  }
}

// Inicializar
cargarEvento();
