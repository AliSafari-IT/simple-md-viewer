// Debug front matter parsing
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Read the reference.md file
const filePath = path.join(__dirname, 'public', 'md-docs', 'docs', 'api', 'reference.md');
const content = fs.readFileSync(filePath, 'utf8');

console.log('=== DEBUG FRONT MATTER PARSING ===');
console.log('File content length:', content.length);
console.log('Starts with ---:', content.startsWith('---'));
console.log('First 100 characters:');
console.log(JSON.stringify(content.substring(0, 100)));

// Manual parsing logic
if (content.startsWith('---')) {
    console.log('\n=== SEARCHING FOR CLOSING DELIMITER ===');
    
    // Check for different line ending patterns
    const patterns = [
        '\n---\n',
        '\r\n---\r\n', 
        '\r\n---\n',
        '\n---\r\n'
    ];
    
    patterns.forEach((pattern, i) => {
        const pos = content.indexOf(pattern, 4);
        console.log(`Pattern ${i+1} (${JSON.stringify(pattern)}):`, pos);
    });
    
    // Find first valid delimiter
    let endDelimiter = -1;
    let usedPattern = '';
    
    for (const pattern of patterns) {
        const pos = content.indexOf(pattern, 4);
        if (pos !== -1) {
            endDelimiter = pos;
            usedPattern = pattern;
            break;
        }
    }
    
    if (endDelimiter !== -1) {
        console.log('\n=== EXTRACTING YAML ===');
        console.log('Delimiter found at:', endDelimiter);
        console.log('Using pattern:', JSON.stringify(usedPattern));
        
        const yamlContent = content.slice(4, endDelimiter);
        console.log('YAML content:');
        console.log('---YAML START---');
        console.log(yamlContent);
        console.log('---YAML END---');
        
        try {
            const parsed = yaml.load(yamlContent);
            console.log('\n=== PARSED YAML ===');
            console.log('Successfully parsed front matter:');
            console.log(JSON.stringify(parsed, null, 2));
            
            // Extract content after front matter
            const remainingContent = content.slice(endDelimiter + usedPattern.length);
            console.log('\n=== REMAINING CONTENT ===');
            console.log('Content after front matter (first 200 chars):');
            console.log(JSON.stringify(remainingContent.substring(0, 200)));
            
        } catch (error) {
            console.log('\n=== YAML PARSING ERROR ===');
            console.log('Error parsing YAML:', error.message);
        }
    } else {
        console.log('\n=== NO CLOSING DELIMITER FOUND ===');
        console.log('Could not find closing --- delimiter');
    }
} else {
    console.log('File does not start with ---');
}
