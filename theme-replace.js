const fs = require('fs');
const path = require('path');

const directories = [
    'src/app/dashboard/panna-pramukh',
    'src/app/dashboard/booth-adhyaksh',
    'src/app/dashboard/eci-observer',
    'src/app/dashboard/data-analyst',
    'src/app/dashboard/party-central',
    'src/app/dashboard/super-admin',
    'src/app/dashboard/manager', // re-run just in case
    'src/components/panna-pramukh',
    'src/components/booth-adhyaksh',
    'src/components/eci',
    'src/components/data-analyst',
    'src/components/party-central',
    'src/components/super-admin',
    'src/components/manager', // re-run just in case
];

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Core colors
    content = content.replace(/#c9a84c/g, '#1e293b');
    content = content.replace(/bg-\[#111520\]/g, 'bg-white shadow-sm');
    content = content.replace(/bg-\[#161b28\]/g, 'bg-slate-50');
    content = content.replace(/bg-\[#08090f\]/g, 'bg-stone-50');
    content = content.replace(/text-\[#f0ece3\]/g, 'text-slate-700');
    content = content.replace(/bg-background-dark/g, 'bg-stone-50');
    content = content.replace(/bg-surface-dark/g, 'bg-white shadow-sm');
    content = content.replace(/text-cream/g, 'text-slate-700');
    content = content.replace(/text-accent-gold/g, 'text-slate-800');
    content = content.replace(/border-accent-gold/g, 'border-slate-800');
    content = content.replace(/bg-accent-gold/g, 'bg-slate-800');
    
    // Borders
    content = content.replace(/border-\[rgba\(255,255,255,0\.05\)\]/g, 'border-slate-200');
    content = content.replace(/border-\[rgba\(201,168,76,0\.14\)\]/g, 'border-slate-200');
    content = content.replace(/border-\[rgba\(201,168,76,0\.08\)\]/g, 'border-slate-200');
    content = content.replace(/border-white\/(?:10|20|\[0\.02\]|\[0\.03\]|\[0\.04\]|\[0\.05\]|\[0\.06\]|\[0\.1\])/g, 'border-slate-200');
    
    // Text whites with opacities
    content = content.replace(/text-white\/20/g, 'text-slate-400');
    content = content.replace(/text-white\/25/g, 'text-slate-400');
    content = content.replace(/text-white\/30/g, 'text-slate-500');
    content = content.replace(/text-white\/35/g, 'text-slate-500');
    content = content.replace(/text-white\/40/g, 'text-slate-500');
    content = content.replace(/text-white\/50/g, 'text-slate-500');
    content = content.replace(/text-white\/60/g, 'text-slate-600');
    content = content.replace(/text-white\/65/g, 'text-slate-600');
    content = content.replace(/text-white\/70/g, 'text-slate-600');
    content = content.replace(/text-white\/75/g, 'text-slate-700');
    content = content.replace(/text-white\/80/g, 'text-slate-700');
    
    // Some specific white text that was meant to be pure white in dark mode
    content = content.replace(/text-white/g, 'text-slate-900'); 
    
    // Fix artifact from text-white/20 replace combined with text-white replace
    content = content.replace(/text-slate-900\/(\d+)/g, 'text-slate-500'); 

    // Specific Status Colors mentioned (e.g. #4ade80)
    content = content.replace(/#4ade80/g, '#10b981');
    content = content.replace(/#fbbf24/g, '#f59e0b');
    content = content.replace(/#f87171/g, '#ef4444');
    
    // Missing Edge Cases
    content = content.replace(/rgba\(201,168,76,[0-9.]+\)/g, 'rgba(30,41,59,0.2)');
    content = content.replace(/rgba\(255,255,255,[0-9.]+\)/g, 'rgba(30,41,59,0.1)');
    content = content.replace(/#08090f/gi, '#f8fafc'); // replace dark backgrounds with slate-50 hex
    content = content.replace(/#111520/gi, '#ffffff'); // replace card backgrounds with white hex
    content = content.replace(/#161b28/gi, '#f1f5f9'); // replace hover backgrounds with slate-100 hex
    content = content.replace(/#f0ece3/gi, '#334155'); // replace light text with slate-700 hex

    
    fs.writeFileSync(filePath, content, 'utf8');
}

function processDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            replaceInFile(fullPath);
        }
    }
}

for (const dir of directories) {
    processDirectory(dir);
    console.log('Processed', dir);
}
console.log('Done replacing theme colors in all admin dashboards.');
