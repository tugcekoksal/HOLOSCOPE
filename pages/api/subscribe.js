// pages/api/subscribe.js
import { connectToDatabase } from '../../lib/mongodb'; // Ensure this path is correct
import Email from '../../models/Email'; // Make sure your model import is correct

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    try {
      const { db } = await connectToDatabase();
      
      // Optional: Check if email already exists
      const existingEmail = await db.collection('subscribers').findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already subscribed' });
      }

      await db.collection('subscribers').insertOne({ email, createdAt: new Date() });
      return res.status(201).json({ message: 'Subscription successful' });

    } catch (error) {
      // Log the detailed error for debugging
      console.error('Error in /api/subscribe:', error);
      return res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
