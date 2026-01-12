// Sidebar
function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("active");
}

// Funciones de menú
function verPerfil() {
  alert("Aquí se mostraría la información del perfil del usuario.");
}

function cerrarSesion() {
  window.location.href = "/index.html";
}

// Referencias
const modal = document.getElementById("modal");
const closeModalBtn = document.getElementById("closeModal");
const btnImportar = document.getElementById("btnImportar");
const btnFormulario = document.getElementById("btnFormulario");
const btnEnviar = document.getElementById("btnEnviar");
const btnCargarArchivo = document.getElementById("btnCargarArchivo");
const fileInput = document.getElementById("fileInput");
const tablaInvitados = document.getElementById("tablaInvitados");

// Abrir modal
btnImportar.addEventListener("click", () => {
  modal.style.display = "block";
});

// Cerrar modal
closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// Cerrar modal si se hace clic fuera del contenido 
window.addEventListener("click", (event) => { 
    if (event.target === modal) {
         modal.style.display = "none"; 
        } 
    });

// Procesar archivo CSV
btnCargarArchivo.addEventListener("click", () => {
  if (fileInput.files.length === 0) {
    alert("Por favor selecciona un archivo CSV.");
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const text = e.target.result;
    const rows = text.split("\n").map(row => row.split(","));

    // Crear tabla
    let html = "<table class='invitados'><thead><tr>";
    html += "<th>Nombre</th><th>Correo</th><th>Teléfono</th><th>Dirección</th>";
    html += "</tr></thead><tbody>";

    for (let i = 1; i < rows.length; i++) {
      const cols = rows[i];
      if (cols.length < 4) continue;
      html += "<tr>";
      html += `<td>${cols[0]}</td>`;
      html += `<td>${cols[1]}</td>`;
      html += `<td>${cols[2]}</td>`;
      html += `<td>${cols[3]}</td>`;
      html += "</tr>";
    }

    html += "</tbody></table>";
    tablaInvitados.innerHTML = html;

    modal.style.display = "none";

    // ✅ Habilitar botón de formulario
    btnFormulario.disabled = false;
    btnFormulario.classList.remove("bloqueado");
    btnFormulario.classList.add("activo");
  };

  reader.readAsText(file);
});

btnFormulario.addEventListener("click", () => {
  alert("Formulario generado correctamente.");

  // ✅ Habilitar botón de enviar
  btnEnviar.disabled = false;
  btnEnviar.classList.remove("bloqueado");
  btnEnviar.classList.add("activo");
});

btnEnviar.addEventListener("click", () => {
  alert("Formulario enviado correctamente.");
});


// Generar formulario
btnFormulario.addEventListener("click", () => {
  alert("Formulario generado correctamente.");
  btnEnviar.disabled = false;
});

// Enviar formulario
btnEnviar.addEventListener("click", () => {
  alert("Formulario enviado correctamente.");
});
