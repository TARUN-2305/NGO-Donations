import { createRequire } from 'module';
const require = createRequire(import.meta.url);

try {
    const pdf = require('pdf-parse');
    console.log('Own Property Names:', Object.getOwnPropertyNames(pdf));
    console.log('Has default?', 'default' in pdf);
    console.log('Type of default:', typeof pdf.default);
} catch (e) {
    console.error(e);
}
