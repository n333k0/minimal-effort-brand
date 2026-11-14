// Verifies every local href/src in the HTML pages points to a file that exists.
import fs from 'fs'; import path from 'path';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
let bad = 0, n = 0;
for (const page of ['index.html', 'builder.html']) {
  const h = fs.readFileSync(path.join(ROOT, page), 'utf8');
  for (const m of h.matchAll(/(?:href|src|poster)="([^"#:]+?)"/g)) {
    const u = m[1]; if (/^(https?|mailto|data)/.test(u) || u.includes('${')) continue; n++;
    if (!fs.existsSync(path.join(ROOT, decodeURIComponent(u)))) { bad++; console.log('MISSING', page, u); }
  }
  for (const m of h.matchAll(/url\(([^)'"]+)\)/g)) { const u = m[1]; if (u.startsWith('data') || u.includes('${')) continue; n++; if (!fs.existsSync(path.join(ROOT, u))) { bad++; console.log('MISSING css', page, u); } }
}
console.log(`${n} local links checked, ${bad} missing`);
