const fs = require('fs');
const path = require('path');
const glob = require('glob'); // Note: we can use simple recursive walk instead to avoid glob dependency

function walkSync(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = fs.statSync(dirFile).isDirectory() ? walkSync(dirFile, filelist) : filelist.concat(dirFile);
    } catch (err) {
      if (err.code === 'ENOENT' || err.code === 'EACCES') return;
    }
  });
  return filelist;
}

const files = walkSync('./src');
files.forEach(file => {
  if (file.endsWith('.tsx') || file.endsWith('.ts')) {
    let content = fs.readFileSync(file, 'utf8');
    const isFeatureOrComponent = file.includes('src/features/') || file.includes('src/components/');
    
    // First, let's revert any bad multiple replacements like ../../../types
    content = content.replace(/\.\.\/\.\.\/\.\.\/types/g, '../../types');
    
    // If it's in a subfolder like src/features/finance/ or src/components/ui/
    // It's 2 levels deep from src (e.g. src/features/finance).
    // So to get to src/types.ts it needs ../../types
    // Let's just do a naive replace for files in exactly 2-level deep folders
    
    const parts = file.split(path.sep);
    // e.g. ['src', 'features', 'finance', 'FinanceTab.tsx'] -> length 4
    if (parts.length === 4) {
      content = content.replace(/from '\.\.\/types'/g, "from '../../types'");
      content = content.replace(/from '\.\.\/data/g, "from '../../data");
      content = content.replace(/from '\.\.\/utils/g, "from '../../utils");
      content = content.replace(/from '\.\.\/lib/g, "from '../../lib");
      content = content.replace(/from '\.\.\/components/g, "from '../../components");
    }
    
    fs.writeFileSync(file, content, 'utf8');
  }
});
