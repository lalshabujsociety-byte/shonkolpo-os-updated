const AdmZip = require('adm-zip');
const path = require('path');
const zip = new AdmZip();

zip.addLocalFolder(process.cwd(), '', (filename) => {
  return !filename.includes('node_modules') && 
         !filename.includes('.git') && 
         !filename.includes('dist') && 
         !filename.includes('.aistudio') && 
         !filename.endsWith('.zip');
});

zip.writeZip('./public/sonkolpo-os-v4-updated.zip');
console.log('Successfully generated public/sonkolpo-os-v4-updated.zip');
