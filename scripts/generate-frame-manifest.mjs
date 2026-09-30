import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SEQ_DIR = path.join(ROOT, 'public', 'ai-sequence');
const OUT_FILE = path.join(ROOT, 'src', 'generated', 'frameManifest.json');
const ALLOWED = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif']);

function naturalKey(name) {
  return name
    .toLowerCase()
    .split(/(\d+)/)
    .map((part) => (/^\d+$/.test(part) ? { n: parseInt(part, 10), s: part } : { s: part }));
}

function naturalCompare(a, b) {
  const ka = naturalKey(a);
  const kb = naturalKey(b);
  const len = Math.max(ka.length, kb.length);
  for (let i = 0; i < len; i++) {
    const x = ka[i];
    const y = kb[i];
    if (!x) return -1;
    if (!y) return 1;
    if (x.n !== undefined && y.n !== undefined) {
      if (x.n !== y.n) return x.n - y.n;
      if (x.s !== y.s) return x.s < y.s ? -1 : 1;
    } else {
      const xs = x.n !== undefined ? String(x.n) : x.s;
      const ys = y.n !== undefined ? String(y.n) : y.s;
      if (xs !== ys) return xs < ys ? -1 : 1;
    }
  }
  return 0;
}

try {
  if (!fs.existsSync(SEQ_DIR)) {
    fs.mkdirSync(SEQ_DIR, { recursive: true });
  }
  const entries = fs.existsSync(SEQ_DIR) ? fs.readdirSync(SEQ_DIR) : [];
  const frames = entries
    .filter((f) => {
      const full = path.join(SEQ_DIR, f);
      try {
        return fs.statSync(full).isFile() && ALLOWED.has(path.extname(f).toLowerCase());
      } catch {
        return false;
      }
    })
    .sort(naturalCompare)
    .map((f) => `/ai-sequence/${f}`);

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(frames, null, 2) + '\n');
  console.log(`[frames] found ${frames.length} frame(s) -> src/generated/frameManifest.json`);
  if (frames.length === 0) {
    console.log('[frames] empty: drop images into public/ai-sequence/ then re-run. Site will use fallback.');
  } else {
    console.log(`[frames] first: ${frames[0]} | last: ${frames[frames.length - 1]}`);
  }
} catch (err) {
  console.error('[frames] manifest generation failed (non-fatal):', err?.message || err);
  try {
    fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
    if (!fs.existsSync(OUT_FILE)) fs.writeFileSync(OUT_FILE, '[]\n');
  } catch {}
  process.exit(0);
}
