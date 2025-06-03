import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [motociclistas, setMotociclistas] = useState([]);
  const [form, setForm] = useState({
    qr: "",
    fecha_nacimiento: "",
    numero_control: "",
  });
  const [editId, setEditId] = useState(null);

  const API = "http://localhost:8000/motociclistas";

  useEffect(() => {
    fetchMotociclistas();
  }, []);

  const fetchMotociclistas = async () => {
    const res = await axios.get(API);
    setMotociclistas(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`${API}/${editId}`, form);
      setEditId(null);
    } else {
      await axios.post(API, form);
    }
    setForm({ qr: "", fecha_nacimiento: "", numero_control: "" });
    fetchMotociclistas();
  };

  const handleEdit = (m) => {
    setForm({
      qr: m.qr,
      fecha_nacimiento: m.fecha_nacimiento,
      numero_control: m.numero_control,
    });
    setEditId(m.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchMotociclistas();
  };

  return (
    <div style={{ margin: "40px" }}>
      <h2>CRUD Motociclistas</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="qr"
          placeholder="QR"
          value={form.qr}
          onChange={handleChange}
          required
        />
        <input
          name="fecha_nacimiento"
          type="date"
          value={form.fecha_nacimiento}
          onChange={handleChange}
          required
        />
        <input
          name="numero_control"
          placeholder="Número de Control"
          value={form.numero_control}
          onChange={handleChange}
          required
        />
        <button type="submit">{editId ? "Actualizar" : "Agregar"}</button>
      </form>
      <table border="1" cellPadding="8" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>QR</th>
            <th>Fecha Nacimiento</th>
            <th>Número Control</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {motociclistas.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.qr}</td>
              <td>{m.fecha_nacimiento}</td>
              <td>{m.numero_control}</td>
              <td>
                <button onClick={() => handleEdit(m)}>Editar</button>
                <button onClick={() => handleDelete(m.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
