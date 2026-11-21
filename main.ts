import { existsSync, mkdirSync, cpSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';
const root = fileURLToPath(new URL('.', import.meta.url));
const output = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? '/output');
mkdirSync(output, { recursive: true });
for (const name of ['app', 'screenshots']) {
  const target = join(output, name);
  if (name === 'screenshots') mkdirSync(target, { recursive: true });
  const source = join(root, name);
  if (existsSync(source)) cpSync(source, target, { recursive: true });
}
const policy = { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 };
writeFileSync(join(output, 'dossier.json'), buildDossier(output, policy));
