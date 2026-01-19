import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const path = require.resolve('pdf-parse');
console.log('Path:', path);
console.log('--- Content Start ---');
console.log(fs.readFileSync(path, 'utf8').slice(0, 500));
console.log('--- Content End ---');
