import React, { useEffect, useState } from "react";

// Apunto la base y el usuario con el que voy a trabajar en la API
const API_BASE = "https://playground.4geeks.com/todo";
const USER = "sasha2";

const Home = () => {
  // Estado principal de la app
  const [listaTareas, setListaTareas] = useState([]); // aquí guardo lo que me devuelve la API
  const [nuevaTarea, setNuevaTarea] = useState(""); // lo que escribo en el input
  const [cargando, setCargando] = useState(false); // para mostrar skeletons/placeholder
  const [creando, setCreando] = useState(false); // para deshabilitar el botón mientras creo
  const [error, setError] = useState(""); // mensajes de error simples

  // Pido las tareas al backend; si el usuario no existe, lo creo y reintento
  const cargarTareas = async () => {
    setCargando(true);
    setError("");
    try {
      let res = await fetch(`${API_BASE}/users/${USER}`);
      if (!res.ok) {
        // Si no existe el usuario, lo creo y vuelvo a intentar
        await fetch(`${API_BASE}/users/${USER}`, { method: "POST" });
        res = await fetch(`${API_BASE}/users/${USER}`);
      }
      if (!res.ok) throw new Error("No se pudo obtener el usuario/tareas");

      const data = await res.json();
      // Aseguro que 'todos' es un array por si la API cambia algo
      setListaTareas(Array.isArray(data.todos) ? data.todos : []);
    } catch (e) {
      console.error(e);
      setError("No se pudieron cargar las tareas. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  // Creo una tarea nueva (POST) y luego refresco la lista
  const crearTarea = async (texto) => {
    const label = texto.trim(); // evito crear tareas vacías
    if (!label) return;

    setCreando(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/todos/${USER}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label, is_done: false }),
      });

      if (!res.ok) throw new Error("Error creando tarea");

      setNuevaTarea(""); // limpio el input si todo fue bien
      await cargarTareas(); // recargo para ver la nueva tarea
    } catch (e) {
      console.error(e);
      setError("No se pudo crear la tarea.");
    } finally {
      setCreando(false);
    }
  };

  // Manejo del submit del formulario para aceptar Enter
  const handleSubmit = (e) => {
    e.preventDefault();
    crearTarea(nuevaTarea);
  };

  // Cuando el componente monta, traigo las tareas una vez
  useEffect(() => {
    cargarTareas();
  }, []);

  return (
    <div
      className="min-vh-100 d-flex align-items-center"
      // Fondo con gradiente oscuro para que la card destaque
      style={{ background: "linear-gradient(135deg, #111827, #0f172a)" }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card shadow-lg border-0" style={{ borderRadius: "1rem" }}>
              <div className="card-body p-4">
                <h1 className="h4 mb-3">Lista de tareas</h1>

                {/* Formulario: envío con Enter y deshabilito si el campo está vacío */}
                <form onSubmit={handleSubmit} className="d-flex gap-2 mb-3">
                  <label htmlFor="nueva-tarea" className="visually-hidden">
                    Nueva tarea
                  </label>
                  <input
                    id="nueva-tarea"
                    className="form-control"
                    type="text"
                    placeholder="Escribe una tarea y pulsa Enter…"
                    value={nuevaTarea}
                    onChange={(e) => setNuevaTarea(e.target.value)}
                  />
                  <button
                    className="btn btn-primary d-flex align-items-center gap-2"
                    type="submit"
                    disabled={!nuevaTarea.trim() || creando} // Evito clicks repetidos o entradas vacías
                  >
                    {creando && (
                      // Pequeño spinner mientras hago el POST
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    )}
                    Guardar
                  </button>
                </form>

                {/* Si hay error, lo muestro en un alert simple */}
                {error && (
                  <div className="alert alert-danger py-2" role="alert">
                    {error}
                  </div>
                )}

                {/* Mientras cargo, muestro placeholders de Bootstrap */}
                {cargando ? (
                  <div className="my-3">
                    <div className="placeholder-glow">
                      <span
                        className="placeholder col-12 mb-2"
                        style={{ height: 44, display: "block", borderRadius: 12 }}
                      ></span>
                      <span
                        className="placeholder col-12 mb-2"
                        style={{ height: 44, display: "block", borderRadius: 12 }}
                      ></span>
                      <span
                        className="placeholder col-10 mb-2"
                        style={{ height: 44, display: "block", borderRadius: 12 }}
                      ></span>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Si no hay tareas, dejo un mensajito neutro */}
                    {listaTareas.length === 0 ? (
                      <div className="text-center text-muted py-4">
                        Aún no tienes tareas. ¡Crea la primera arriba!
                      </div>
                    ) : (
                      // Lista de tareas con un badge para indicar si está hecha o no
                      <ul className="list-group list-group-flush">
                        {listaTareas.map((tarea, i) => (
                          <li
                            key={tarea.id ?? `${tarea.label}-${i}`} // uso id si viene, si no, un fallback
                            className="list-group-item d-flex align-items-center"
                          >
                            <span
                              className={`badge me-2 ${
                                tarea.is_done ? "bg-success" : "bg-secondary"
                              }`}
                              style={{ width: 10, height: 10, borderRadius: "50%" }}
                            ></span>
                            <span
                              className={`flex-grow-1 ${
                                tarea.is_done
                                  ? "text-decoration-line-through text-muted"
                                  : ""
                              }`}
                            >
                              {tarea.label}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}

                {/* Contador de tareas al final de la tarjeta */}
                <div className="mt-3 text-muted small">
                  {listaTareas.length} tarea{listaTareas.length !== 1 ? "s" : ""}
                </div>
              </div>
            </div>
            <p className="text-center text-white-50 mt-3 small mb-0">
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
