"use client";
import { useEffect, useState } from "react";

export default function FechasPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFecha, setSelectedFecha] = useState("01");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/fechas?fecha=${selectedFecha}`);
        const result = await response.json();
        const filteredData = result.filter(
          (fecha) => fecha.Fecha === selectedFecha
        );
        setData(filteredData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Fechas data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedFecha]);

  const handleFechaChange = (event) => {
    setSelectedFecha(event.target.value);
  };

  const handleInputChange = (index, field, value) => {
    const newData = [...data];
    newData[index][field] = value;
    setData(newData);
  };

  const updateClubes = async () => {
    try {
      const response = await fetch("/api/clubes/updates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fecha: selectedFecha }),
      });

      if (response.ok) {
        console.log("Datos guardados exitosamente");
      } else {
        const result = await response.json();
        console.log(`Error al guardar los datos: ${result.error}`);
      }
    } catch (error) {
      console.error("Error saving data:", error);      
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch("/api/fechas/updates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fecha: selectedFecha, data }),
      });

      if (response.ok) {
        alert("Datos guardados exitosamente");
      } else {
        const result = await response.json();
        alert(`Error al guardar los datos: ${result.error}`);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Error al guardar los datos");
    }

    updateClubes();
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>FECHAS</h1>
      <label htmlFor="fecha-select">Seleccionar Fecha:</label>
      <select
        id="fecha-select"
        value={selectedFecha}
        onChange={handleFechaChange}
      >
        {[...Array(38).keys()].map((i) => (
          <option key={i} value={String(i + 1).padStart(2, "0")}>
            {`Fecha ${i + 1}`}
          </option>
        ))}
      </select>
      <table>
        <thead>
          <tr>
            <th>Partido</th>
            <th>Fecha</th>
            <th>ZonaL</th>
            <th>Local</th>
            <th>GolL</th>
            <th>GolV</th>
            <th>Visitante</th>
            <th>ZonaV</th>
          </tr>
        </thead>
        <tbody>
          {data.map((match, index) => (
            <tr key={index}>
              <td>{match.Partido}</td>
              <td>{match.Fecha}</td>
              <td>{match.ZonaL}</td>
              <td>{match.Local}</td>
              <td>
                <input
                  type="number"
                  value={match.GolL}
                  onChange={(e) =>
                    handleInputChange(index, "GolL", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  value={match.GolV}
                  onChange={(e) =>
                    handleInputChange(index, "GolV", e.target.value)
                  }
                />
              </td>
              <td>{match.Visitante}</td>
              <td>{match.ZonaV}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleSave}>UPDATE</button>
    </div>
  );
}
