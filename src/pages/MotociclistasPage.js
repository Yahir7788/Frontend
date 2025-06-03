import React, { useState, useEffect, useCallback } from 'react';
import './MotociclistasPage.css';

// --- AddMotociclistaForm ---
const AddMotociclistaForm = ({ onAddMotociclista, onCancel, isSubmitting }) => {
  const [qr, setQr] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [numeroControl, setNumeroControl] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!qr || !fechaNacimiento || !numeroControl) {
      setFormError('Todos los campos son obligatorios.');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaNacimiento)) {
        setFormError('El formato de fecha de nacimiento debe ser YYYY-MM-DD.');
        return;
    }
    setFormError('');
    onAddMotociclista({ qr, fecha_nacimiento: fechaNacimiento, numero_control: numeroControl });
  };

  return (
    <form onSubmit={handleSubmit} className="motociclista-form add-form">
      <h3>Agregar Nuevo Motociclista</h3>
      {formError && <p className="form-error-message">{formError}</p>}
      <div>
        <label htmlFor="add-qr">QR:</label>
        <input id="add-qr" type="text" value={qr} onChange={(e) => setQr(e.target.value)} required disabled={isSubmitting} />
      </div>
      <div>
        <label htmlFor="add-fechaNacimiento">Fecha de Nacimiento (YYYY-MM-DD):</label>
        <input id="add-fechaNacimiento" type="text" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} placeholder="YYYY-MM-DD" required disabled={isSubmitting} />
      </div>
      <div>
        <label htmlFor="add-numeroControl">Número de Control:</label>
        <input id="add-numeroControl" type="text" value={numeroControl} onChange={(e) => setNumeroControl(e.target.value)} required disabled={isSubmitting} />
      </div>
      <button type="submit" disabled={isSubmitting}>Guardar</button>
      <button type="button" onClick={onCancel} disabled={isSubmitting}>Cancelar</button>
    </form>
  );
};
// --- End of AddMotociclistaForm ---

// --- EditMotociclistaForm ---
const EditMotociclistaForm = ({ motociclista, onUpdateMotociclista, onCancel, isSubmitting }) => {
  const [qr, setQr] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [numeroControl, setNumeroControl] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (motociclista) {
        setQr(motociclista.qr);
        setFechaNacimiento(motociclista.fecha_nacimiento);
        setNumeroControl(motociclista.numero_control);
    }
  }, [motociclista]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!qr || !fechaNacimiento || !numeroControl) {
      setFormError('Todos los campos son obligatorios.');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaNacimiento)) {
        setFormError('El formato de fecha de nacimiento debe ser YYYY-MM-DD.');
        return;
    }
    setFormError('');
    onUpdateMotociclista(motociclista.id, { qr, fecha_nacimiento: fechaNacimiento, numero_control: numeroControl });
  };

  if (!motociclista) return null;

  return (
    <form onSubmit={handleSubmit} className="motociclista-form edit-form">
      <h3>Editar Motociclista (ID: {motociclista.id})</h3>
      {formError && <p className="form-error-message">{formError}</p>}
      <div>
        <label htmlFor={`edit-qr-${motociclista.id}`}>QR:</label>
        <input id={`edit-qr-${motociclista.id}`} type="text" value={qr} onChange={(e) => setQr(e.target.value)} required disabled={isSubmitting} />
      </div>
      <div>
        <label htmlFor={`edit-fechaNacimiento-${motociclista.id}`}>Fecha de Nacimiento (YYYY-MM-DD):</label>
        <input id={`edit-fechaNacimiento-${motociclista.id}`} type="text" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} placeholder="YYYY-MM-DD" required disabled={isSubmitting} />
      </div>
      <div>
        <label htmlFor={`edit-numeroControl-${motociclista.id}`}>Número de Control:</label>
        <input id={`edit-numeroControl-${motociclista.id}`} type="text" value={numeroControl} onChange={(e) => setNumeroControl(e.target.value)} required disabled={isSubmitting} />
      </div>
      <button type="submit" disabled={isSubmitting}>Actualizar</button>
      <button type="button" onClick={onCancel} disabled={isSubmitting}>Cancelar</button>
    </form>
  );
};
// --- End of EditMotociclistaForm ---


const MotociclistasPage = () => {
  const [motociclistas, setMotociclistas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingMotociclista, setEditingMotociclista] = useState(null);

  const API_URL = 'http://localhost:8000';

  const fetchMotociclistas = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/motociclistas`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMotociclistas(data);
    } catch (e) {
      setError(e);
      console.error("Failed to fetch motorcyclists:", e);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchMotociclistas();
  }, [fetchMotociclistas]);

  const handleAddMotociclista = async (newMotociclistaData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/motociclistas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMotociclistaData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: `HTTP error! status: ${response.status}` }));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      await response.json();
      setShowAddForm(false);
      fetchMotociclistas();
    } catch (e) {
      setError(e);
      console.error("Failed to add motorcyclist:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateMotociclista = async (id, updatedData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/motociclistas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: `HTTP error! status: ${response.status}` }));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      await response.json();
      setEditingMotociclista(null);
      fetchMotociclistas();
    } catch (e) {
      setError(e);
      console.error(`Failed to update motorcyclist ${id}:`, e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMotociclista = async (id) => {
    if (!window.confirm(`¿Está seguro de que desea eliminar el motociclista con ID ${id}?`)) {
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/motociclistas/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: `HTTP error! status: ${response.status}` }));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      fetchMotociclistas();
    } catch (e) {
      setError(e);
      console.error(`Failed to delete motorcyclist ${id}:`, e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (motociclista) => {
    setEditingMotociclista(motociclista);
    setShowAddForm(false);
    setError(null);
  };

  const handleCancelEdit = () => {
    setEditingMotociclista(null);
    setError(null);
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setError(null);
  }

  const isFormActive = showAddForm || editingMotociclista !== null;
  const isBusy = isSubmitting || isLoading;

  return (
    <div className="motociclistas-page">
      <h1>Gestión de Motociclistas</h1>

      {!isFormActive && (
        <button
          className="add-button"
          onClick={() => { setShowAddForm(true); setError(null); setEditingMotociclista(null);}}
          disabled={isBusy}
        >
          Agregar Motociclista
        </button>
      )}

      {showAddForm && !editingMotociclista && (
        <AddMotociclistaForm
          onAddMotociclista={handleAddMotociclista}
          onCancel={handleCancelAdd}
          isSubmitting={isSubmitting}
        />
      )}

      {editingMotociclista && (
        <EditMotociclistaForm
          motociclista={editingMotociclista}
          onUpdateMotociclista={handleUpdateMotociclista}
          onCancel={handleCancelEdit}
          isSubmitting={isSubmitting}
        />
      )}

      {isSubmitting && <p className="processing-message">Procesando...</p>}
      {error && <p className="error-message">Error: {error.message}</p>}

      <h2>Lista de Motociclistas</h2>
      {isLoading && <p className="loading-message">Cargando motorcyclistas...</p>}

      {!isLoading && (motociclistas.length === 0 && !error) && (
         <p className="info-message">No hay motociclistas registrados.</p>
      )}

      {!isLoading && motociclistas.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>QR</th>
              <th>Fecha de Nacimiento</th>
              <th>Número de Control</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {motociclistas.map((motociclista) => (
              <tr key={motociclista.id}>
                <td>{motociclista.id}</td>
                <td>{motociclista.qr}</td>
                <td>{motociclista.fecha_nacimiento}</td>
                <td>{motociclista.numero_control}</td>
                <td>
                  <button
                    className="edit-button"
                    onClick={() => handleEditClick(motociclista)}
                    disabled={isBusy || isFormActive}
                  >
                    Editar
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteMotociclista(motociclista.id)}
                    disabled={isBusy || isFormActive}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MotociclistasPage;
