"use client";
import style from "./clubes.module.css";
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

  const handleSave = async () => {
    try {
      const response = await fetch("/api/clubes/updates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ clubes: selectedZona, data }), //clubes??
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
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className={style.div}>
      <h1 className={style.h1}>POSICIONES</h1>
      <label className={style.label} htmlFor="zona-select">
        Seleccionar Zona:
      </label>
      <select
        className={style.select}
        id="zona-select"
        value={selectedZona}
        onChange={handleZonaChange}
      >
        <option className={style.option} value="A">
          Zona A
        </option>
        <option value="B">Zona B</option>
      </select>
      <label className={style.label} htmlFor="fecha-select">
        Seleccionar Fecha:
      </label>
      <select
        className={style.select}
        id="fecha-select"
        value={selectedFecha}
        onChange={handleFechaChange}
      >
        {Array.from({ length: 38 }, (_, i) => i + 1).map((num) => (
          <option
            className={style.option}
            key={num}
            value={num.toString().padStart(2, "0")}
          >
            Fecha {num.toString().padStart(2, "0")}
          </option>
        ))}
      </select>
      <table className={style.table}>
        <thead className={style.thead}>
          <tr className={style.tr}>
            <th className={style.th}>Zona</th>
            <th className={style.th}>Equipo</th>
            <th className={style.th}>Puntos</th>
            <th className={style.tbodyth}>PJ</th>
            <th className={style.tbodyth}>PG</th>
            <th className={style.tbodyth}>PE</th>
            <th className={style.tbodyth}>PP</th>
            <th className={style.tbodyth}>GF</th>
            <th className={style.tbodyth}>GC</th>
            <th className={style.tbodyth}>DG</th>
          </tr>
        </thead>
        <tbody className={style.tbody}>
          {data.map((club) => (
            <tr className={style.tr} key={club._key}>
              <td className={style.td}>{club.Zona}</td>
              <td className={style.td}>{club.Equipo}</td>
              <td className={style.td}>{club.puntos}</td>
              <td className={style.td}>{club.PJ}</td>
              <td className={style.td}>{club.PG}</td>
              <td className={style.td}>{club.PE}</td>
              <td className={style.td}>{club.PP}</td>
              <td className={style.td}>{club.GF}</td>
              <td className={style.td}>{club.GC}</td>
              <td className={style.td}>{club.DG}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
