import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf8');

if (!html.includes('<script type="module" src="/src/main.tsx"></script>')) {
    html = html.replace('</html>', '    <script type="module" src="/src/main.tsx"></script>\n</html>');
    fs.writeFileSync('index.html', html);
    console.log('Fixed script tag');
} else {
    console.log('Script tag already exists');
}
