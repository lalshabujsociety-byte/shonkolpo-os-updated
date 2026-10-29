import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const output = fs.createWriteStream(path.join(process.cwd(), 'public', 'sonkolpo-os-v4-updated.zip'));
const archive = new archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log(`Archive created successfully: ${archive.pointer()} total bytes`);
});

archive.on('error', (err: any) => {
  throw err;
});

archive.pipe(output);

archive.glob('**/*', {
  ignore: ['node_modules/**', '.git/**', 'dist/**', '.aistudio/**', 'sonkolpo-os-v4-updated.zip', 'public/sonkolpo-os-v4-updated.zip', 'scripts/make-zip.ts', 'scripts/make-zip.cjs']
});

archive.finalize();
