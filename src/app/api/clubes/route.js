import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  let selectedZona = searchParams.get("zona");
  let selectedFecha = searchParams.get("fecha");

  if (!selectedZona || !selectedFecha) {
    return NextResponse.json(
      { error: "Zona o Fecha no proporcionada" },
      { status: 400 }
    );
  }

  selectedFecha = selectedFecha.padStart(2, "0");



  const filePath = path.join(
    process.cwd(),
    "public",
    "clubes",
    `Clubes${selectedFecha}.csv`
  );

  
  try {
    const fileContents = fs.readFileSync(filePath, "utf8");    
    const data = parseCSV( fileContents ).filter(
      (club) => club.Zona === selectedZona
    );    
    return NextResponse.json( data );
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
    const [key, Id, Equipo, Zona, puntos, PJ, PG, PE, PP, GF, GC, DG] =
      line.split(",");
    return { key, Id, Equipo, Zona, puntos, PJ, PG, PE, PP, GF, GC, DG };
  });
}
