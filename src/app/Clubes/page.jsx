"use client";
import { useEffect, useState } from "react";

export default function CsvDisplay() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedZona, setSelectedZona] = useState("B"); // Valor por defecto: 'B'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/clubes");
        const result = await response.json();
        const filteredData = result.filter(
          (club) => club.Zona === selectedZona
        ); // Filtrar por la zona seleccionada
        setData(filteredData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching clubes data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedZona]); // Ejecutar el efecto cuando cambie el valor de selectedZona

  const handleZonaChange = (event) => {
    setSelectedZona(event.target.value);
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
          {data.map((club, index) => (
            <tr key={index}>
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
