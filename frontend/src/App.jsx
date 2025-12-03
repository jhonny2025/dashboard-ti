import { useState, useEffect } from "react";
import * as XLSX from "xlsx";

function App() {
  const [registros, setRegistros] = useState([]);

  const [fecha, setFecha] = useState("");
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [carga, setCarga] = useState("");

  const [mttr, setMttr] = useState("");
  const [ir, setIr] = useState("");
  const [ath, setAth] = useState("");
  const [recontactos, setRecontactos] = useState("");
  const [csat, setCsat] = useState("");
  const [sla, setSla] = useState("");

  const [tiempo, setTiempo] = useState("");
  const [calificacion, setCalificacion] = useState("");

  // 🔥 Esta URL cambia cada vez que reinicies ngrok
  const API_BASE = "https://nonmotile-intercolumnar-lanie.ngrok-free.dev";



  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const res = await fetch(`${API_BASE}/listar`);
      const data = await res.json();
      setRegistros(data);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  const guardarManual = async (e) => {
    e.preventDefault();

    const body = {
      fecha,
      titulo,
      descripcion,
      carga,
      mttr,
      ir,
      ath,
      recontactos,
      csat,
      sla,
      tiempo_respuesta: tiempo,
      calificacion,
    };

    try {
      await fetch(`${API_BASE}/guardar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      // limpiar campos
      setFecha("");
      setTitulo("");
      setDescripcion("");
      setCarga("");

      setMttr("");
      setIr("");
      setAth("");
      setRecontactos("");
      setCsat("");
      setSla("");

      setTiempo("");
      setCalificacion("");

      cargarDatos();
    } catch (error) {
      console.error("Error guardando:", error);
    }
  };

  const eliminar = async (id) => {
    try {
      await fetch(`${API_BASE}/eliminar/${id}`, {
        method: "DELETE",
      });

      cargarDatos();
    } catch (error) {
      console.error("Error eliminando:", error);
    }
  };

  const procesarArchivo = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);

        for (const row of json) {
          await fetch(`${API_BASE}/guardar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(row),
          });
        }

        cargarDatos();
      } catch (error) {
        console.error("Error importando archivo:", error);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard IT - Métricas</h1>

      <form onSubmit={guardarManual}>
        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />

        <input placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
        <input placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
        <input type="number" placeholder="Carga" value={carga} onChange={(e) => setCarga(e.target.value)} />

        <input type="number" placeholder="MTTR" value={mttr} onChange={(e) => setMttr(e.target.value)} />
        <input type="number" placeholder="IR" value={ir} onChange={(e) => setIr(e.target.value)} />
        <input type="number" placeholder="ATH" value={ath} onChange={(e) => setAth(e.target.value)} />
        <input type="number" placeholder="Recontactos" value={recontactos} onChange={(e) => setRecontactos(e.target.value)} />
        <input type="number" placeholder="CSAT" value={csat} onChange={(e) => setCsat(e.target.value)} />
        <input type="number" placeholder="SLA" value={sla} onChange={(e) => setSla(e.target.value)} />

        <input type="number" placeholder="Tiempo Respuesta" value={tiempo} onChange={(e) => setTiempo(e.target.value)} />
        <input type="number" placeholder="Calificación" value={calificacion} onChange={(e) => setCalificacion(e.target.value)} />

        <button type="submit">Guardar</button>
      </form>

      <br />

      <input type="file" accept=".csv,.xlsx" onChange={procesarArchivo} />

      <table border="1" cellPadding="5" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Título</th>
            <th>Carga</th>
            <th>MTTR</th>
            <th>IR</th>
            <th>ATH</th>
            <th>Recontactos</th>
            <th>CSAT</th>
            <th>SLA</th>
            <th>Tiempo</th>
            <th>Calificación</th>
            <th>❌</th>
          </tr>
        </thead>

        <tbody>
          {registros.map((r) => (
            <tr key={r.id}>
              <td>{r.fecha}</td>
              <td>{r.titulo}</td>
              <td>{r.carga}</td>
              <td>{r.mttr}</td>
              <td>{r.ir}</td>
              <td>{r.ath}</td>
              <td>{r.recontactos}</td>
              <td>{r.csat}</td>
              <td>{r.sla}</td>
              <td>{r.tiempo_respuesta}</td>
              <td>{r.calificacion}</td>

              <td>
                <button onClick={() => eliminar(r.id)}>❌</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
