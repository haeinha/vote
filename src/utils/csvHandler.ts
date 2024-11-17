import fs from 'fs';
import path from 'path';
import { parse, stringify } from 'csv/sync';
import { OPTION_NAMES } from './constants';

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
  const initialResults = Object.fromEntries(
    Object.values(OPTION_NAMES).map(option => [option, 0])
  );

  if (!fs.existsSync(CSV_PATH)) {
    return {
      totalVotes: 0,
      results: initialResults
    };
  }

  const content = fs.readFileSync(CSV_PATH, 'utf-8');
  const records = parse(content, { columns: true });

  const results = { ...initialResults };
  records.forEach((record: Vote) => {
    results[record.option]++;
  });

  return {
    totalVotes: records.length,
    results
  };
} 