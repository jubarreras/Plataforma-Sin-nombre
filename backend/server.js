const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // <-- importante para que se parseen los JSON del body
app.use(express.urlencoded({ extended: true }));

// Conexión a la base de datos SQLite
const db = new sqlite3.Database('./usuarios.db');

// Servir tu frontend (HTML, CSS, JS) desde la carpeta raíz del proyecto
app.use(express.static(path.join(__dirname, '../')));

// Endpoint de login con validación de rol
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM usuarios WHERE username = ?", [username], (err, row) => {
    if (err) return res.status(500).send("Error en el servidor");
    if (!row) return res.status(401).send("Usuario no encontrado");

    bcrypt.compare(password, row.password, (err, result) => {
      if (result) {
        res.json({ role: row.role }); // 👈 devolvemos el rol
      } else {
        res.status(401).send("Contraseña incorrecta");
      }
    });
  });
});

// Rutas de administración (crear, eliminar, actualizar usuarios)
app.post('/admin/create', (req, res) => {
    console.log("Body recibido:", req.body); // depuración
    const { username, password, role } = req.body;

    if (!role) {
        return res.status(400).send("Debes especificar un rol (admin, empresa, cliente)");
    }

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).send("Error al crear usuario");
        db.run(
            "INSERT INTO usuarios (username, password, role) VALUES (?, ?, ?)",
            [username, hash, role],
            (err) => {
                if (err) return res.status(500).send("Error en la BD");
                res.send(`Usuario ${username} con rol ${role} creado correctamente`);
            }
        );
    });
});


app.post('/admin/delete', (req, res) => {
    const { username } = req.body;
    db.run("DELETE FROM usuarios WHERE username = ?", [username], (err) => {
        if (err) return res.status(500).send("Error en la BD");
        res.send(`Usuario ${username} eliminado`);
    });
});

app.post('/admin/update', (req, res) => {
    const { username, newPassword } = req.body;
    bcrypt.hash(newPassword, 10, (err, hash) => {
        if (err) return res.status(500).send("Error al actualizar contraseña");
        db.run("UPDATE usuarios SET password = ? WHERE username = ?", [hash, username], (err) => {
            if (err) return res.status(500).send("Error en la BD");
            res.send(`Contraseña de ${username} actualizada`);
        });
    });
});

// Iniciar servidor
app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});
