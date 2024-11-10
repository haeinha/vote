import fs from 'fs';
import path from 'path';
import { parse, stringify } from 'csv/sync';

const CSV_PATH = path.join(process.cwd(), 'data', 'votes.csv');

export interface Vote {
  employeeNumber: string;
  name: string;
  option: string;
}

export const saveVote = async (vote: Vote): Promise<{ isUpdate: boolean }> => {
  // Create directory if it doesn't exist
  const dir = path.dirname(CSV_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Create file with headers if it doesn't exist
  if (!fs.existsSync(CSV_PATH)) {
    fs.writeFileSync(CSV_PATH, 'employeeNumber,name,option\n');
    // First vote, just append it
    const newContent = stringify([vote], { header: false });
    fs.appendFileSync(CSV_PATH, newContent);
    return { isUpdate: false };
  }

  const content = fs.readFileSync(CSV_PATH, 'utf-8');
  const records = parse(content, { columns: true }) as Vote[];

  // Check if employee has already voted
  const existingVoteIndex = records.findIndex(
    (record) => record.employeeNumber === vote.employeeNumber
  );

  if (existingVoteIndex !== -1) {
    // Update existing vote
    records[existingVoteIndex] = vote;
    
    // Write all records back to file
    const newContent = stringify(records, { header: true });
    fs.writeFileSync(CSV_PATH, newContent);
    return { isUpdate: true };
  }

  // New vote, append to file
  const newContent = stringify([vote], { header: false });
  fs.appendFileSync(CSV_PATH, newContent);
  return { isUpdate: false };
}


export const getResults = async () => {
  if (!fs.existsSync(CSV_PATH)) {
    return {
      totalVotes: 0,
      results: {
        'Option 1': 0,
        'Option 2': 0,
        'Option 3': 0,
        'Option 4': 0,
        'Option 5': 0,
      }
    };
  }

  const content = fs.readFileSync(CSV_PATH, 'utf-8');
  const records = parse(content, { columns: true });

  const results = {
    'Option 1': 0,
    'Option 2': 0,
    'Option 3': 0,
    'Option 4': 0,
    'Option 5': 0,
  };

  records.forEach((record: Vote) => {
    results[record.option as keyof typeof results]++;
  });

  return {
    totalVotes: records.length,
    results
  };
} 