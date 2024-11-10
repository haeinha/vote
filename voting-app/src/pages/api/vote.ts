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
    const { isUpdate } = await saveVote(req.body);
    res.status(200).json({ 
      message: isUpdate ? 'Vote updated successfully' : 'Vote recorded successfully',
      isUpdate 
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}