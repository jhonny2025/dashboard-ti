import { useState } from "react";

function Formulario() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [carga, setCarga] = useState("");
  const [tiempo_respuesta, setTiempoRespuesta] = useState("");
  const [calificacion, setCalificacion] = useState("");
  const [nivel_satisfaccion, setNivelSatisfaccion] = useState("");
  const [se_soluciono, setSeSoluciono] = useState("");

  const guardarProyecto = async () => {
    const datos = {
      titulo,
      descripcion,
      carga,
      tiempo_respuesta,
      calificacion,
      nivel_satisfaccion,
      se_soluciono
    };

    try {
      const respuesta = await fetch("http://127.0.0.1:5000/guardar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
      });

      const resultado = await respuesta.json();
      alert(resultado.mensaje);
    } catch (error) {
      alert("Error conectando con el backend");
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Formulario Proyecto</h2>

      <input placeholder="Título" onChange={e => setTitulo(e.target.value)} />
      <input placeholder="Descripción" onChange={e => setDescripcion(e.target.value)} />
      <input placeholder="Carga" onChange={e => setCarga(e.target.value)} />
      <input placeholder="Tiempo respuesta" onChange={e => setTiempoRespuesta(e.target.value)} />
      <input placeholder="Calificación" onChange={e => setCalificacion(e.target.value)} />
      <input placeholder="Nivel satisfacción" onChange={e => setNivelSatisfaccion(e.target.value)} />
      <input placeholder="¿Se solucionó?" onChange={e => setSeSoluciono(e.target.value)} />

      <button onClick={guardarProyecto}>Guardar</button>
    </div>
  );
}

export default Formulario;
