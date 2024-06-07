import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  let selectedFecha = searchParams.get("fecha");

  if (!selectedFecha) {
    return NextResponse.json(
      { error: "Fecha no proporcionada" },
      { status: 400 }
    );
  }

  selectedFecha = selectedFecha.padStart(2, "0");

  const filePath = path.join(
    process.cwd(),
    "public",
    `Fecha${selectedFecha}.csv`
  );

  try {
    const fileContents = fs.readFileSync(filePath, "utf8");
    const data = parseCSV(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading CSV:", error);
    return NextResponse.json(
      { error: "Error leyendo el archivo CSV" },
      { status: 500 }
    );
  }
}

function parseCSV(fileContents) {
  return fileContents.split("\n").map((line) => {
    const [Partido, Fecha, ZonaL, Local, GolL, GolV, Visitante, ZonaV] =
      line.split(",");
    return { Partido, Fecha, ZonaL, Local, GolL, GolV, Visitante, ZonaV };
  });
}
