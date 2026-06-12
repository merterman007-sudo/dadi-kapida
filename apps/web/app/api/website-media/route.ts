import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const allowedTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"]
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

function detectImageExtension(bytes: Buffer): string | null {
  if (bytes.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) {
    return "jpg";
  }
  if (bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return "png";
  }
  if (bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP") {
    return "webp";
  }
  if (bytes.subarray(4, 8).toString("ascii") === "ftyp") {
    const brand = bytes.subarray(8, 12).toString("ascii");
    if (brand === "avif" || brand === "avis") {
      return "avif";
    }
  }
  return null;
}

async function canManageWebsite(request: Request): Promise<boolean> {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return false;
  }

  const apiBaseUrl = (process.env.API_INTERNAL_URL ?? process.env.API_BASE_URL ?? "http://localhost:3001").replace(
    /\/$/,
    ""
  );
  try {
    const response = await fetch(`${apiBaseUrl}/api/v1/admin/website/settings`, {
      headers: { authorization },
      cache: "no-store"
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!(await canManageWebsite(request))) {
    return NextResponse.json({ error: "Bu islem icin yetkiniz bulunmuyor." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Gorsel dosyasi secilmedi." }, { status: 400 });
  }

  const extension = allowedTypes.get(file.type);
  if (!extension) {
    return NextResponse.json({ error: "Sadece jpg, png, webp veya avif yuklenebilir." }, { status: 400 });
  }

  if (file.size > maxSize) {
    return NextResponse.json({ error: "Gorsel en fazla 5 MB olabilir." }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const detectedExtension = detectImageExtension(bytes);
  if (detectedExtension !== extension) {
    return NextResponse.json({ error: "Dosya icerigi gecerli bir gorsel degil." }, { status: 400 });
  }

  const uploadsDir = path.resolve(process.cwd(), "..", "..", "website", "public", "images", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const safeName = slugifyFileName(file.name) || "site-gorseli";
  const fileName = `${safeName}-${Date.now()}.${extension}`;
  const target = path.join(uploadsDir, fileName);

  await writeFile(target, bytes);

  return NextResponse.json({
    path: `/images/uploads/${fileName}`
  });
}
