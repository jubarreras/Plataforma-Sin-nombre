const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a la base de datos SQLite
const db = new sqlite3.Database('./usuarios.db');

// Servir todos los archivos estáticos (HTML, CSS, JS) desde /frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Ruta raíz que devuelve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

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

// Listar eventos
app.get('/eventos', (req, res) => {
  db.all("SELECT * FROM eventos", [], (err, rows) => {
    if (err) return res.status(500).send("Error al obtener eventos");
    res.json(rows);
  });
});

// Crear evento
app.post('/eventos', (req, res) => {
  const { nombre, fecha, lugar, creado_por } = req.body;
  const query = `INSERT INTO eventos (nombre, fecha, lugar, creado_por) VALUES (?, ?, ?, ?)`;
  db.run(query, [nombre, fecha, lugar, creado_por], function(err) {
    if (err) return res.status(500).send("Error al crear evento");
    res.json({ id: this.lastID, nombre, fecha, lugar, creado_por });
  });
});

// Obtener un evento por ID
app.get('/eventos/:id', (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM eventos WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).send("Error al obtener evento");
    if (!row) return res.status(404).send("Evento no encontrado");
    res.json(row);
  });
});

app.put('/eventos/:id', (req, res) => {
  const id = req.params.id;
  const { nombre, fecha, lugar } = req.body;
  const query = `UPDATE eventos SET nombre = ?, fecha = ?, lugar = ? WHERE id = ?`;
  db.run(query, [nombre, fecha, lugar, id], function(err) {
    if (err) return res.status(500).send("Error al actualizar evento");
    res.json({ id, nombre, fecha, lugar });
  });
});

app.delete('/eventos/:id', (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM eventos WHERE id = ?", [id], function(err) {
    if (err) return res.status(500).send("Error al eliminar evento");
    res.json({ message: "Evento eliminado", id });
  });
});


// Iniciar servidor
app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});
