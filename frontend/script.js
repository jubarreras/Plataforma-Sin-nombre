document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json(); // 👈 aquí recibimos el rol
      if (data.role === "admin") {
        window.location.href = "/admin.html";
      } else if (data.role === "empresa") {
        window.location.href = "/empresa.html";
      } else {
        window.location.href = "/cliente.html";
      }
    } else {
      const errorText = await response.text();
      document.getElementById("errorMsg").textContent = errorText;
    }
  } catch (err) {
    document.getElementById("errorMsg").textContent =
      "Error de conexión con el servidor";
  }
});

