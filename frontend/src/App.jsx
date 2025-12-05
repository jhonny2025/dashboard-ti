import { useState, useEffect } from "react";

function App() {
  const [registros, setRegistros] = useState([]);

  useEffect(() => {
    // URL de ejemplo del backend en Railway; reemplaza solo cuando tengas la tuya
    const backendUrl = "https://mi-backend.up.railway.app/listar";

    fetch(backendUrl)
      .then(res => res.json())
      .then(data => setRegistros(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Dashboard TI</h1>
      <ul>
        {registros.map(r => (
          <li key={r.id}>
            <strong>{r.titulo}</strong>: {r.descripcion}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
