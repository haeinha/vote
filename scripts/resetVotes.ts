import fs from 'fs';
import path from 'path';

const CSV_PATH = path.join(process.cwd(), 'data', 'votes.csv');

// Create fresh CSV file with new headers
fs.writeFileSync(CSV_PATH, 'employeeNumber,name,options\n');
console.log('Votes reset successfully'); 