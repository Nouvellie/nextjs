import connectToDatabase from '@src/utils/db';
import User from '@src/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await connectToDatabase();

      const { email, password } = req.body;

      // Verificar si los datos están completos
      if (!email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields' });
      }

      // Verificar si el usuario existe
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Verificar si la contraseña coincide
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Crear el token JWT
      const payload = {
        user: {
          id: user.id,
          role: user.role,
        },
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      return res.status(200).json({ token });
    } catch (error) {
      console.error('Error in signin route:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}