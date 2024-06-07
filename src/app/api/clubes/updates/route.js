import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

// Función para parsear el contenido del archivo CSV
const parseCSV = (fileContents) => {
  const [headerLine, ...lines] = fileContents.split("\n");
  const headers = headerLine.split(",");
  return lines.map((line) => {
    const values = line.split(",");
    return headers.reduce((acc, header, index) => {
      acc[header] = values[index];
      return acc;
    }, {});
  });
};

// Función para convertir datos en formato CSV
const convertToCSV = (data) => {
  const headers = Object.keys(data[0]);
  const csvLines = data.map((row) =>
    headers.map((header) => row[header]).join(",")
  );
  return [headers.join(","), ...csvLines].join("\n");
};

// Función para actualizar los datos de los clubes con los resultados de una fecha
const updateClubesData = (clubesData, fechaData) => {
  fechaData.forEach(({ Local, Visitante, GolL, GolV }) => {
    const localClub = clubesData.find((club) => club.Equipo === Local);
    const visitanteClub = clubesData.find((club) => club.Equipo === Visitante);

    if (localClub) {
      localClub.GF = parseInt(localClub.GF, 10) + parseInt(GolL, 10);
      localClub.GC = parseInt(localClub.GC, 10) + parseInt(GolV, 10);
      localClub.DG = parseInt(localClub.GF, 10) - parseInt(localClub.GC, 10);
      localClub.PJ += 1;
      if (GolL > GolV) {
        localClub.PG += 1;
        localClub.puntos += 3;
      } else if (GolL < GolV) {
        localClub.PP += 1;
      } else {
        localClub.PE += 1;
        localClub.puntos += 1;
      }
    }

    if (visitanteClub) {
      visitanteClub.GF = parseInt(visitanteClub.GF, 10) + parseInt(GolV, 10);
      visitanteClub.GC = parseInt(visitanteClub.GC, 10) + parseInt(GolL, 10);
      visitanteClub.DG =
        parseInt(visitanteClub.GF, 10) - parseInt(visitanteClub.GC, 10);
      visitanteClub.PJ += 1;
      if (GolV > GolL) {
        visitanteClub.PG += 1;
        visitanteClub.puntos += 3;
      } else if (GolV < GolL) {
        visitanteClub.PP += 1;
      } else {
        visitanteClub.PE += 1;
        visitanteClub.puntos += 1;
      }
    }
  });
  return clubesData;
};

export async function POST(request) {
  const { fecha } = await request.json();
  const clubesFilePath = path.join(process.cwd(), "public", "Clubes.csv");
  const clubesFileContents = fs.readFileSync(clubesFilePath, "utf8");
  let clubesData = parseCSV(clubesFileContents);

  for (let i = 1; i <= parseInt(fecha, 10); i++) {
    const fechaStr = String(i).padStart(2, "0");
    const fechaFilePath = path.join(
      process.cwd(),
      "public",
      `Fecha${fechaStr}.csv`
    );
    const fechaFileContents = fs.readFileSync(fechaFilePath, "utf8");
    const fechaData = parseCSV(fechaFileContents);
    clubesData = updateClubesData(clubesData, fechaData);

    const updatedClubesCSV = convertToCSV(clubesData);
    const newClubesFilePath = path.join(
      process.cwd(),
      "public",
      `Clubes${fechaStr}.csv`
    );
    fs.writeFileSync(newClubesFilePath, updatedClubesCSV, "utf8");
  }

  return new NextResponse(
    "Datos de Clubes actualizados y archivos guardados exitosamente",
    { status: 200 }
  );
}
