// Importamos React y el hook useEffect para ejecutar código al montar el componente
import React, { useEffect } from "react";

// Componente principal de la página
const Home = () => {
  // Estado que guarda la lista de tareas traída de la API
  const [listaTareas, setListaTareas] = React.useState([]);
  // Estado controlado del input donde escribimos una nueva tarea
  const [nuevaTarea, setNuevaTarea] = React.useState("");

  // Función que consulta (GET) el usuario "sasha2" y, si no existe, lo crea
  const verRespuestaApi = async () => {
    // Llamada GET para obtener el usuario y sus tareas
    const respuesta = await fetch("https://playground.4geeks.com/todo/users/sasha2", { method: "GET" });
    if (!respuesta.ok) {
      // Si el usuario no existe, lo creamos y volvemos a intentar obtenerlo
      createUser();
      verRespuestaApi();
    } else {
      // Si existe, traducimos la respuesta a JSON y guardamos el array de tareas en el estado
      const traduccion = await respuesta.json();
      setListaTareas(traduccion.todos);
    }
  };

  // Función que crea (POST) el usuario "sasha2" en la API (si no existe)
  const createUser = async () => {
    const response = await fetch("https://playground.4geeks.com/todo/users/sasha2", { method: "POST" });
    const data = await response.json();
    // Devolvemos la data por si en un futuro se quiere usar
    return data;
  };

  // Función que crea (POST) una nueva tarea para el usuario "sasha2"
  const crearTarea = async (tareaEscrita) => {
    const response = await fetch("https://playground.4geeks.com/todo/todos/sasha2", {
      method: "POST",
      headers: {
        // Indicamos que el cuerpo del request será JSON
        "Content-Type": "application/json",
      },
      // Enviamos la tarea con el formato que la API espera
      body: JSON.stringify({
        label: tareaEscrita, // Texto de la tarea
        is_done: false,      // Por defecto, no está completada
      }),
    });

    if (response.ok) {
      // Si la tarea se creó correctamente, refrescamos la lista desde la API
      console.log("Tarea creada correctamente " + tareaEscrita);
      verRespuestaApi();
    } else {
      // Si hubo un error, lo mostramos en consola (útil para depurar)
      console.log("Error al crear la tarea: " + tareaEscrita);
    }
  };

  // Función que borra (DELETE) una tarea por su id
  const borrarTarea = async (tareaBorrada) => {
    const response = await fetch("https://playground.4geeks.com/todo/todos/" + tareaBorrada, {
      method: "DELETE",
      headers: {
        // Indicamos que aceptamos JSON como respuesta (buena práctica)
        accept: "application/json",
      },
    });
    if (response.ok) {
      // Si se borró, volvemos a consultar para actualizar la lista en pantalla
      verRespuestaApi();
    }
  };

  // Manejador que sincroniza lo escrito en el input con el estado "nuevaTarea"
  const handleChange = (evento) => {
    let loQueEscribi = evento.target.value;
    setNuevaTarea(loQueEscribi);
  };

  // useEffect se ejecuta una sola vez al montar el componente ([] como dependencia)
  // Aquí cargamos las tareas iniciales
  useEffect(() => {
    verRespuestaApi();
  }, []);

  // Render del componente
  return (
    <>
      {/* Fondo claro, altura mínima de pantalla y padding vertical */}
      <main className="bg-light min-vh-100 py-5">
        {/* Contenedor centrado para que no ocupe todo el ancho en pantallas grandes */}
        <div className="container">
          <div className="row justify-content-center">
            {/* Columna responsiva para mejor lectura en desktop y móvil */}
            <div className="col-12 col-md-10 col-lg-8">
              {/* Tarjeta con sombra suave y borde limpio */}
              <div className="card shadow-sm border-0">
                <div className="card-body p-4">
                  {/* Título con contador de tareas en una badge */}
                  <h1 className="h4 mb-4 d-flex align-items-center">
                    <span className="me-2">📋 Lista de Tareas</span>
                    {/* Badge que muestra el total de tareas */}
                    <span className="badge bg-secondary">{listaTareas.length}</span>
                  </h1>

                  {/* Lista visual de tareas usando list-group de Bootstrap */}
                  <ul className="list-group list-group-flush mb-4">
                    {listaTareas.map((tarea, indice) => (
                      // Cada elemento de la lista
                      // NOTA: aquí se usa "indice" como key para mantener el código original.
                      // Idealmente se usaría tarea.id como key única y estable.
                      <li
                        key={indice}
                        className="list-group-item d-flex align-items-center justify-content-between px-0"
                      >
                        {/* Texto de la tarea */}
                        <span className="text-body">{tarea.label}</span>

                        {/* Botón para eliminar la tarea (visual: pequeño y contorno rojo) */}
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

                  {/* Formulario para añadir nueva tarea */}
                  <div>
                    {/* Etiqueta accesible conectada al input por id/htmlFor */}
                    <label htmlFor="nueva-tarea" className="form-label fw-semibold">
                      Nueva tarea
                    </label>

                    {/* Input + botón alineados en una sola fila (input-group) */}
                    <div className="input-group">
                      <input
                        id="nueva-tarea"         // Id para accesibilidad
                        className="form-control" // Estilo Bootstrap del input
                        type="text"
                        onChange={handleChange}  // Actualiza el estado al escribir
                        placeholder="Escribe aquí tu tarea…"
                      />
                      {/* Botón que toma el valor actual del estado y lo envía a la API */}
                      <button className="btn btn-primary" onClick={() => crearTarea(nuevaTarea)}>
                        Guardar tarea
                      </button>
                    </div>

                    {/* Texto de ayuda debajo del input (estilo Bootstrap) */}
                    <div className="form-text">Pulsa “Guardar tarea” para añadirla a la lista.</div>
                  </div>
                </div>
              </div>

              {}
              <div className="my-3" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

// Exportamos el componente para poder usarlo en la app
export default Home;