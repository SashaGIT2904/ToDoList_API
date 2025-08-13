import React, { useEffect } from "react";

const Home = () => {
  const [listaTareas, setListaTareas] = React.useState([]);
  const [nuevaTarea, setNuevaTarea] = React.useState("");

  const verRespuestaApi = async () => {
    const respuesta = await fetch("https://playground.4geeks.com/todo/users/sasha2", { method: "GET" });
    if (!respuesta.ok) {
      createUser();
      verRespuestaApi();
    } else {
      const traduccion = await respuesta.json();
      setListaTareas(traduccion.todos);
    }
  };

  const createUser = async () => {
    const response = await fetch("https://playground.4geeks.com/todo/users/sasha2", { method: "POST" });
    const data = await response.json();
    return data;
  };

  const crearTarea = async (tareaEscrita) => {
    const response = await fetch("https://playground.4geeks.com/todo/todos/sasha2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        label: tareaEscrita,
        is_done: false,
      }),
    });
    if (response.ok) {
      console.log("Tarea creada correctamente" + tareaEscrita);
      verRespuestaApi();
    } else {
      console.log("Error al crear la tarea: " + tareaEscrita);
    }
  };

  const borrarTarea = async (tareaBorrada) => {
    const response = await fetch("https://playground.4geeks.com/todo/todos/" + tareaBorrada, {
      method: "DELETE",
      headers: {
        accept: "application/json",
      },
    });
    if (response.ok) {
      verRespuestaApi();
    }
  };

  const handleChange = (evento) => {
    let loQueEscribi = evento.target.value;
    setNuevaTarea(loQueEscribi);
  };

  useEffect(() => {
    verRespuestaApi();
  }, []);

  return (
    <>
      <main className="bg-light min-vh-100 py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-8">
              <div className="card shadow-sm border-0">
                <div className="card-body p-4">
                  <h1 className="h4 mb-4 d-flex align-items-center">
                    <span className="me-2">📋 Lista de Tareas</span>
                    <span className="badge bg-secondary">{listaTareas.length}</span>
                  </h1>

                  <ul className="list-group list-group-flush mb-4">
                    {listaTareas.map((tarea, indice) => (
                      <li
                        key={indice}
                        className="list-group-item d-flex align-items-center justify-content-between px-0"
                      >
                        <span className="text-body">{tarea.label}</span>
                        <button
                          onClick={() => borrarTarea(tarea.id)}
                          className="btn btn-sm btn-outline-danger"
                          title="Eliminar"
                        >
                          🗑️ Eliminar
                        </button>
                      </li>
                    ))}
                  </ul>

                  <div>
                    <label htmlFor="nueva-tarea" className="form-label fw-semibold">
                      Nueva tarea
                    </label>
                    <div className="input-group">
                      <input
                        id="nueva-tarea"
                        className="form-control"
                        type="text"
                        onChange={handleChange}
                        placeholder="Escribe aquí tu tarea…"
                      />
                      <button className="btn btn-primary" onClick={() => crearTarea(nuevaTarea)}>
                        Guardar tarea
                      </button>
                    </div>
                    <div className="form-text">Pulsa “Guardar tarea” para añadirla a la lista.</div>
                  </div>
                </div>
              </div>

              {/* Pequeño margen inferior para respirar en móviles */}
              <div className="my-3" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
