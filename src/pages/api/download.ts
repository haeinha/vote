import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// Add 'export default' here
export default async function downloadHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const CSV_PATH = path.join(process.cwd(), 'data', 'votes.csv');

  try {
    if (!fs.existsSync(CSV_PATH)) {
      return res.status(404).json({ message: 'No voting data available' });
    }

    const fileContent = fs.readFileSync(CSV_PATH);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=votes.csv');
    
    return res.status(200).send(fileContent);
  } catch (error) {
    console.error('Download error:', error);
    return res.status(500).json({ message: 'Error downloading file' });
  }
}