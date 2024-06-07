import fs from "fs";
import path from "path";
import Papa from "papaparse";

export async function GET(request) {
  const filePath = path.join(process.cwd(), "public", "data.csv");
  const file = fs.readFileSync(filePath, "utf8");

  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        resolve(new Response(JSON.stringify(results.data), { status: 200 }));
      },
      error: (error) => {
        reject(
          new Response(JSON.stringify({ error: error.message }), {
            status: 500,
          })
        );
      },
    });
  });
}
