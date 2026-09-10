const fs = require('fs');
let content = fs.readFileSync('src/app/App.tsx', 'utf8');

content = content.replace(/import \{.*?isSupabaseConfigured.*\} from '\.\.\/lib\/supabase';\n/, '');

content = content.replace(/\/\/ Initialize Supabase auth listener.*?\}\), \[\]\);\n/s, '');

content = content.replace(/\/\/ Auto-sync state to Supabase.*?\}\], 1500\).*?\}\), \[.*?\]\);\n/s, '');

content = content.replace(/await signOutSupabase\(\);\n/g, '');

fs.writeFileSync('src/app/App.tsx', content, 'utf8');
