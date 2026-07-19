import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const splashPath = join(root, "public/splashLogo.png");
const appDir = join(root, "src/app");

const BG = { r: 39, g: 25, b: 11, alpha: 255 };

function replaceBackground(data) {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r > 200 && g > 195 && b > 175) {
      data[i] = BG.r;
      data[i + 1] = BG.g;
      data[i + 2] = BG.b;
      data[i + 3] = 255;
    }
  }
}

async function prepareLogo() {
  const { data, info } = await sharp(splashPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  replaceBackground(data);

  return sharp(Buffer.from(data), {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .trim({ threshold: 10 })
    .toBuffer();
}

async function createSquareIcon(size, outputPath) {
  const logoBuffer = await prepareLogo();
  const { width, height } = await sharp(logoBuffer).metadata();

  const padding = Math.round(size * 0.06);
  const inner = size - padding * 2;

  // Scale up to fill the square height, then center-crop the width
  const scale = inner / height;
  const scaledW = Math.round(width * scale);
  const scaledH = inner;

  const scaled = await sharp(logoBuffer)
    .resize(scaledW, scaledH, {
      fit: "fill",
      kernel: sharp.kernel.lanczos3,
    })
    .modulate({ brightness: 1.1, saturation: 1.2 })
    .sharpen({ sigma: 0.6 })
    .toBuffer();

  const cropLeft = Math.max(0, Math.round((scaledW - inner) / 2));
  const cropped =
    scaledW > inner
      ? await sharp(scaled)
          .extract({ left: cropLeft, top: 0, width: inner, height: scaledH })
          .toBuffer()
      : scaled;

  const finalW = Math.min(scaledW, inner);
  const left = padding + Math.round((inner - finalW) / 2);

  await sharp({
    create: { width: size, height: size, channels: 4, background: BG },
  })
    .composite([{ input: cropped, left, top: padding }])
    .png()
    .toFile(outputPath);

  console.log(`Created ${outputPath} (${size}x${size})`);
}

await createSquareIcon(512, join(appDir, "icon.png"));
await createSquareIcon(180, join(appDir, "apple-icon.png"));
