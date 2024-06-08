"use client";

import { useEffect, useState } from "react";

export default function ClubesPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedZona, setSelectedZona] = useState("B");
  const [selectedFecha, setSelectedFecha] = useState("01");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/clubes?zona=${selectedZona}&fecha=${selectedFecha}`
        );
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching clubes data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedZona, selectedFecha]);

  const handleZonaChange = (event) => {
    setSelectedZona(event.target.value);
  };

  const handleFechaChange = (event) => {
    setSelectedFecha(event.target.value);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Club Data</h1>
      <label htmlFor="zona-select">Seleccionar Zona:</label>
      <select id="zona-select" value={selectedZona} onChange={handleZonaChange}>
        <option value="A">Zona A</option>
        <option value="B">Zona B</option>
      </select>
      <label htmlFor="fecha-select">Seleccionar Fecha:</label>
      <select
        id="fecha-select"
        value={selectedFecha}
        onChange={handleFechaChange}
      >
        {Array.from({ length: 38 }, (_, i) => i + 1).map((num) => (
          <option key={num} value={num.toString().padStart(2, "0")}>
            Fecha {num.toString().padStart(2, "0")}
          </option>
        ))}
      </select>
      <table>
        <thead>
          <tr>
            <th>Zona</th>
            <th>Equipo</th>
            <th>Puntos</th>
            <th>PJ</th>
            <th>PG</th>
            <th>PE</th>
            <th>PP</th>
            <th>GF</th>
            <th>GC</th>
            <th>DG</th>
          </tr>
        </thead>
        <tbody>
          {data.map((club) => (
            <tr key={club._key}>
              <td>{club.Zona}</td>
              <td>{club.Equipo}</td>
              <td>{club.puntos}</td>
              <td>{club.PJ}</td>
              <td>{club.PG}</td>
              <td>{club.PE}</td>
              <td>{club.PP}</td>
              <td>{club.GF}</td>
              <td>{club.GC}</td>
              <td>{club.DG}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
