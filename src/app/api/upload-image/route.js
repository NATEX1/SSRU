import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("image");

  if (!file) {
    return NextResponse.json(
      { success: 0, message: "No file uploaded" },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public/uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filename = `${Date.now()}-${file.name}`;
  const filePath = path.join(uploadDir, filename);

  await fs.promises.writeFile(filePath, buffer);

  return NextResponse.json({
    success: 1,
    file: {
      url: `/uploads/${filename}`,
    },
  });
}
