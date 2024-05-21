import connectToDatabase from '@src/utils/db';

export default async function handler(req, res) {
  try {
    await connectToDatabase();
    res.status(200).json({ message: 'Connected to MongoDB successfully!' });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    res.status(500).json({ message: 'Failed to connect to MongoDB' });
  }
}