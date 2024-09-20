// pages/api/check-auth.js
import { verify } from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export default function handler(req, res) {
  const { adminToken } = req.cookies;

  if (!adminToken) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const decoded = verify(adminToken, SECRET_KEY);
    res.status(200).json({ message: 'Authenticated', user: decoded });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
}
