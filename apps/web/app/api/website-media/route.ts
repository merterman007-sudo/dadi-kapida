import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const allowedTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
  ["image/svg+xml", "svg"]
]);

const maxSize = 5 * 1024 * 1024;

function slugifyFileName(name: string) {
  const parsed = path.parse(name);
  return parsed.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Gorsel dosyasi secilmedi." }, { status: 400 });
  }

  const extension = allowedTypes.get(file.type);
  if (!extension) {
    return NextResponse.json({ error: "Sadece jpg, png, webp, avif veya svg yuklenebilir." }, { status: 400 });
  }

  if (file.size > maxSize) {
    return NextResponse.json({ error: "Gorsel en fazla 5 MB olabilir." }, { status: 400 });
  }

  const uploadsDir = path.resolve(process.cwd(), "..", "..", "website", "public", "images", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const safeName = slugifyFileName(file.name) || "site-gorseli";
  const fileName = `${safeName}-${Date.now()}.${extension}`;
  const target = path.join(uploadsDir, fileName);
  const bytes = Buffer.from(await file.arrayBuffer());

  await writeFile(target, bytes);

  return NextResponse.json({
    path: `/images/uploads/${fileName}`
  });
}
