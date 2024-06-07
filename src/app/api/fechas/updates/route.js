import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { fecha, data } = await request.json();

    if (!fecha || !Array.isArray(data)) {
      return new NextResponse("Invalid data format", { status: 400 });
    }

    const filePath = path.join(process.cwd(), "public", `Fecha${fecha}.csv`);

    const csvContent = [
      [
        "Partido",
        "Fecha",
        "ZonaL",
        "Local",
        "GolL",
        "GolV",
        "Visitante",
        "ZonaV",
      ],
      ...data.map((row) => [
        row.Partido,
        row.Fecha,
        row.ZonaL,
        row.Local,
        row.GolL,
        row.GolV,
        row.Visitante,
        row.ZonaV,
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    fs.writeFileSync(filePath, csvContent, "utf8");
    return new NextResponse("CSV updated successfully", { status: 200 });
  } catch (error) {
    console.error("Error writing CSV:", error);
    return new NextResponse("Error updating CSV", { status: 500 });
  }
}
