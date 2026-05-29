// Client-side photo normalizer: HEIC -> JPEG, downscale large photos,
// recompress to keep uploads under storage/edge limits. iPhone camera
// photos are routinely 6-12MB and HEIC by default, which silently breaks
// uploads at the event. Run every photo through this before uploading.

const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.85;

export async function processPhotoForUpload(input: File): Promise<File> {
  let file = input;

  // 1. HEIC/HEIF -> JPEG
  const isHeic = /\.(heic|heif)$/i.test(file.name) || /hei[cf]/i.test(file.type);
  if (isHeic) {
    const heic2any = (await import("heic2any")).default;
    const converted = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.9 });
    const blob = Array.isArray(converted) ? converted[0] : converted;
    const newName = file.name.replace(/\.(heic|heif)$/i, ".jpg");
    file = new File([blob], newName, { type: "image/jpeg" });
  }

  // 2. Downscale + recompress via canvas. If anything fails, fall back to
  // the original file so we never block a user from uploading.
  try {
    const dataUrl = await readAsDataURL(file);
    const img = await loadImage(dataUrl);
    const { width, height } = fitWithin(img.naturalWidth, img.naturalHeight, MAX_DIMENSION);
    if (width === img.naturalWidth && height === img.naturalHeight && file.size < 1.5 * 1024 * 1024) {
      return file;
    }
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, width, height);
    const blob: Blob = await new Promise((resolve, reject) =>
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/jpeg", JPEG_QUALITY),
    );
    const baseName = file.name.replace(/\.[^.]+$/, "") || "photo";
    return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
  } catch {
    return file;
  }
}

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function fitWithin(w: number, h: number, max: number) {
  if (w <= max && h <= max) return { width: w, height: h };
  const ratio = w > h ? max / w : max / h;
  return { width: Math.round(w * ratio), height: Math.round(h * ratio) };
}
