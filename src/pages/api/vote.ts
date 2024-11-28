import type { NextApiRequest, NextApiResponse } from 'next';
import { saveVote } from '../../utils/csvHandler';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { employeeNumber, name, options } = req.body;
    
    if (!Array.isArray(options) || options.length !== 3) {
      return res.status(400).json({ message: 'Please select exactly 3 options' });
    }

    const { isUpdate } = await saveVote({ employeeNumber, name, options });
    
    res.status(200).json({ 
      message: isUpdate ? 'Vote updated successfully' : 'Vote recorded successfully',
      isUpdate 
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}