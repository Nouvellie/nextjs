import connectToDatabase from '@src/utils/db';
import User from '@src/models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await connectToDatabase();
      
      const { name, email, password } = req.body;

      // Verificar si los datos están completos
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields' });
      }

      // Verificar si el usuario ya existe
      const userExists = await User.findOne({ email });

      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash de la contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Crear el usuario
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error('Error in signup route:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}