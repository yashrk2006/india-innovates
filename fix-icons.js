const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        if (fs.statSync(file).isDirectory()) results = results.concat(walk(file));
        else if (file.endsWith('.tsx')) results.push(file);
    });
    return results;
}

const files = walk('c:/Users/kushw/OneDrive/Desktop/antigravity/india innovates 2026/ai driven booth management system/booth-iq/src');

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Use string replace for the two common variants to be totally safe
    const v1Search = `function Icon({ name, className = "", size }: { name: string; className?: string; size?: number }) {\r\n    return <span className={\`material-symbols-outlined \${className}\`} style={size ? { fontSize: size } : undefined}>{name}</span>;\r\n}`;
    const v1Replace = `function Icon({ name, className = "", size, style }: { name: string; className?: string; size?: number; style?: React.CSSProperties }) {\r\n    return <span className={\`material-symbols-outlined \${className}\`} style={{ ...(size ? { fontSize: size } : {}), ...style }}>{name}</span>;\r\n}`;
    if (content.includes(v1Search)) {
        content = content.replace(v1Search, v1Replace);
        changed = true;
    }

    const v2Search = `function Icon({ name, size = 16, className = "" }: { name: string; size?: number; className?: string }) {\r\n    return <span className={\`material-symbols-outlined \${className}\`} style={{ fontSize: size }}>{name}</span>;\r\n}`;
    const v2Replace = `function Icon({ name, size = 16, className = "", style }: { name: string; size?: number; className?: string; style?: React.CSSProperties }) {\r\n    return <span className={\`material-symbols-outlined \${className}\`} style={{ fontSize: size, ...style }}>{name}</span>;\r\n}`;
    if (content.includes(v2Search)) {
        content = content.replace(v2Search, v2Replace);
        changed = true;
    }

    // fallback for LF newlines
    const v1SearchLF = `function Icon({ name, className = "", size }: { name: string; className?: string; size?: number }) {\n    return <span className={\`material-symbols-outlined \${className}\`} style={size ? { fontSize: size } : undefined}>{name}</span>;\n}`;
    const v1ReplaceLF = `function Icon({ name, className = "", size, style }: { name: string; className?: string; size?: number; style?: React.CSSProperties }) {\n    return <span className={\`material-symbols-outlined \${className}\`} style={{ ...(size ? { fontSize: size } : {}), ...style }}>{name}</span>;\n}`;
    if (content.includes(v1SearchLF)) {
        content = content.replace(v1SearchLF, v1ReplaceLF);
        changed = true;
    }

    const v2SearchLF = `function Icon({ name, size = 16, className = "" }: { name: string; size?: number; className?: string }) {\n    return <span className={\`material-symbols-outlined \${className}\`} style={{ fontSize: size }}>{name}</span>;\n}`;
    const v2ReplaceLF = `function Icon({ name, size = 16, className = "", style }: { name: string; size?: number; className?: string; style?: React.CSSProperties }) {\n    return <span className={\`material-symbols-outlined \${className}\`} style={{ fontSize: size, ...style }}>{name}</span>;\n}`;
    if (content.includes(v2SearchLF)) {
        content = content.replace(v2SearchLF, v2ReplaceLF);
        changed = true;
    }

    // also for ManagerSidebar.tsx and others where className is not there
    const v3Search = `function Icon({ name, size = 16 }: { name: string; size?: number }) {\r\n    return <span className="material-symbols-outlined" style={{ fontSize: size }}>{name}</span>;\r\n}`;
    const v3Replace = `function Icon({ name, size = 16, style }: { name: string; size?: number; style?: React.CSSProperties }) {\r\n    return <span className="material-symbols-outlined" style={{ fontSize: size, ...style }}>{name}</span>;\r\n}`;
    if (content.includes(v3Search)) {
        content = content.replace(v3Search, v3Replace);
        changed = true;
    }
    const v3SearchLF = `function Icon({ name, size = 16 }: { name: string; size?: number }) {\n    return <span className="material-symbols-outlined" style={{ fontSize: size }}>{name}</span>;\n}`;
    const v3ReplaceLF = `function Icon({ name, size = 16, style }: { name: string; size?: number; style?: React.CSSProperties }) {\n    return <span className="material-symbols-outlined" style={{ fontSize: size, ...style }}>{name}</span>;\n}`;
    if (content.includes(v3SearchLF)) {
        content = content.replace(v3SearchLF, v3ReplaceLF);
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Fixed', file);
    }
}
