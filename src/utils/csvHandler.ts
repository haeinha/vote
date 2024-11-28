import fs from 'fs';
import path from 'path';
import { parse, stringify } from 'csv/sync';
import { OPTION_NAMES } from './constants';

const CSV_PATH = path.join(process.cwd(), 'data', 'votes.csv');

export interface Vote {
  employeeNumber: string;
  name: string;
  options: string;
  option?: string;
}

export const saveVote = async (vote: {
  employeeNumber: string;
  name: string;
  options: string[]
}): Promise<{ isUpdate: boolean }> => {
  // Create directory if it doesn't exist
  const dir = path.dirname(CSV_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Convert options array to string
  const voteToSave = {
    employeeNumber: vote.employeeNumber,
    name: vote.name,
    options: vote.options.join('|') // Use pipe as separator to avoid conflicts with CSV commas
  };

  // Create file with headers if it doesn't exist
  if (!fs.existsSync(CSV_PATH)) {
    fs.writeFileSync(CSV_PATH, 'employeeNumber,name,options\n');
    const newContent = stringify([voteToSave], { header: false });
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
    records[existingVoteIndex] = voteToSave;
    const newContent = stringify(records, { header: true });
    fs.writeFileSync(CSV_PATH, newContent);
    return { isUpdate: true };
  }

  // New vote, append to file
  const newContent = stringify([voteToSave], { header: false });
  fs.appendFileSync(CSV_PATH, newContent);
  return { isUpdate: false };
};

// Add a function to process the results
export const getResults = () => {
  if (!fs.existsSync(CSV_PATH)) {
    return { results: {}, totalVotes: 0 };
  }

  try {
    const content = fs.readFileSync(CSV_PATH, 'utf-8');
    // Add relaxed parsing options
    const records = parse(content, { 
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true // This helps handle inconsistent columns
    }) as Vote[];
    
    const results: Record<string, number> = {};
    
    records.forEach(record => {
      try {
        // Handle both old and new format
        if (record.options) {
          const options = record.options.split('|');
          options.forEach(option => {
            if (option) results[option] = (results[option] || 0) + 1;
          });
        } else if (record.option) {
          // Handle legacy single-option format
          results[record.option] = (results[record.option] || 0) + 1;
        }
      } catch (e) {
        console.error('Error processing record:', record);
      }
    });

    return {
      results,
      totalVotes: records.length
    };
  } catch (error) {
    console.error('Error reading votes:', error);
    return { results: {}, totalVotes: 0 };
  }
}; 