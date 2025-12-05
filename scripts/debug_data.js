
const fs = require('fs');
const path = require('path');

// Read the file content directly
const content = fs.readFileSync('e:/Ineleg/ineleg-app/public/assets/js/data-normalizado.js', 'utf8');

// Extract the JSON part (assuming it's assigned to window.__INELEG_NORMALIZADO__)
const match = content.match(/window\.__INELEG_NORMALIZADO__\s*=\s*(\[.*\]);/s);

if (match) {
    const data = JSON.parse(match[1]);
    console.log("Total items:", data.length);
    
    // Find items that might be related to Código Penal
    const cpItems = data.filter(item => 
        item.codigo === 'CP' || 
        item.codigo === 'CPM' ||
        (item.norma && item.norma.toLowerCase().includes('penal')) ||
        (item.norma && item.norma.includes('2.848'))
    );
    
    console.log("\nPotential CP items:");
    console.log(JSON.stringify(cpItems, null, 2));
    
    // List all unique codes
    const codes = [...new Set(data.map(d => d.codigo))];
    console.log("\nAll Codes:", codes.sort().join(', '));
} else {
    console.log("Could not extract data");
}
