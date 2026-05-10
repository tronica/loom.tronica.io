const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const indexPath = path.join(__dirname, '..', 'content', 'index.njk');

// Read current index.njk
const content = fs.readFileSync(indexPath, 'utf8');
const match = content.match(/countdown:\s*(\d+)/);

if (!match) {
  console.error('Could not find countdown in index.njk');
  process.exit(1);
}

let current = parseInt(match[1]);
current = Math.max(0, current - 1); // Don't go below 0

// Update the file
const newContent = content.replace(/countdown:\s*\d+/, `countdown: ${current}`);
fs.writeFileSync(indexPath, newContent);

console.log(`Countdown decremented to ${current}`);

// Build and deploy
console.log('Building...');
execSync('npm run build', { stdio: 'inherit' });

console.log('Deploying to prod...');
execSync('npx loom deployStatic --source=_site --environment=prod', { stdio: 'inherit' });

console.log('Done!');
