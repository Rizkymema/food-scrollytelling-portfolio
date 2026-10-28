// Menyalin hasil Flow ke public/ dan mengekstrak frame sequence (pengganti langkah Ezgif 24 FPS).
// Pakai: node scripts/prepare-assets.mjs [folder-flow] [--test]
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);
const testMode = args.includes("--test");
const flowDir = args.find((a) => !a.startsWith("--")) ?? join(homedir(), "flow-mcp-out", "web1_food");
// Video diunduh terpisah dengan flow_download ke folder <proyek>_video.
const videoDir = `${flowDir}_video`;

const FPS = 24;
const MAX_WIDTH = 1600;
const JPEG_QSCALE = "8"; // ~115 KB per frame 1600 px; masih bersih untuk footage makanan

// Nama file Flow -> nama file di public/
const images = {
  "scene-03": "about-wagyu-table.jpg",
  "scene-04": "work-wagyu.jpg",
  "scene-05": "services-explosion.jpg",
  "scene-06": "work-ramen.jpg",
  "scene-07": "work-sushi.jpg",
  "scene-08": "work-lava-cake.jpg",
  "scene-09": "work-nasi-goreng.jpg",
  "scene-10": "process-raw.jpg",
  "scene-11": "seq-start.jpg",
  "scene-12": "seq-end.jpg",
};
const videos = {
  sequence: join(videoDir, "plating.mp4"), // Prompt Video 1: plating reveal -> frame scroll
  process: join(videoDir, "timelapse.mp4"), // Prompt Video 2: timelapse -> section Process
};

const findFlowFile = (base) =>
  readdirSync(flowDir).find((f) => f.toLowerCase().startsWith(base.toLowerCase()));

mkdirSync(join(root, "public", "images"), { recursive: true });
mkdirSync(join(root, "public", "video"), { recursive: true });

for (const [scene, name] of Object.entries(images)) {
  const file = findFlowFile(scene);
  if (!file) {
    console.warn(`! ${scene} belum ada di ${flowDir}`);
    continue;
  }
  copyFileSync(join(flowDir, file), join(root, "public", "images", name));
  console.log(`✓ ${file} -> public/images/${name}`);
}

if (existsSync(videos.process)) {
  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error", "-i", videos.process,
    "-an", "-vf", `scale='min(${MAX_WIDTH},iw)':-2`, "-c:v", "libx264", "-crf", "24",
    "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
    join(root, "public", "video", "process-timelapse.mp4"),
  ]);
  console.log("✓ timelapse.mp4 -> public/video/process-timelapse.mp4");
}

// Sumber sequence: klip plating dari Flow, atau (mode --test) zoom pelan dari gambar diam.
const seqDir = join(root, "public", "sequence");
let input;
if (testMode) {
  const still = join(root, "public", "images", existsSync(join(root, "public", "images", "seq-end.jpg")) ? "seq-end.jpg" : "work-wagyu.jpg");
  input = ["-loop", "1", "-t", "8", "-i", still, "-vf", `zoompan=z='1+0.25*on/192':d=1:s=${MAX_WIDTH}x900:fps=${FPS}`];
} else {
  if (!existsSync(videos.sequence)) {
    console.warn("! klip sequence belum ada; jalankan dengan --test untuk frame sementara");
    process.exit(0);
  }
  input = ["-i", videos.sequence, "-vf", `fps=${FPS},scale='min(${MAX_WIDTH},iw)':-2`];
}

rmSync(seqDir, { recursive: true, force: true });
mkdirSync(seqDir, { recursive: true });
execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...input, "-q:v", JPEG_QSCALE, join(seqDir, "frame_%04d.jpg")]);

const frames = readdirSync(seqDir).filter((f) => f.endsWith(".jpg")).sort();
const frameCount = frames.length;

// Ambil warna rata-rata sudut kiri atas frame pertama untuk background situs.
const rgb = execFileSync("ffmpeg", [
  "-loglevel", "error", "-i", join(seqDir, frames[0]),
  "-vf", "crop=24:24:0:0,scale=1:1", "-f", "rawvideo", "-pix_fmt", "rgb24", "-",
]);
const hex = `#${[...rgb.subarray(0, 3)].map((v) => v.toString(16).padStart(2, "0")).join("")}`;

writeFileSync(
  join(root, "src", "lib", "sequence-manifest.json"),
  `${JSON.stringify({ frameCount, background: hex, test: testMode }, null, 2)}\n`,
);
console.log(`✓ ${frameCount} frame di public/sequence, warna tepi ${hex}`);
