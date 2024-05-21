import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import jwt_decode from 'jwt-decode';

const AdminPage = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signin');
    } else {
      try {
        const decoded = jwt_decode(token);
        if (decoded.user.role !== 'admin') {
          router.push('/');
        } else {
          setUser(decoded.user);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        router.push('/signin');
      }
    }
  }, [router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, Admin</h1>
      <button onClick={() => {
        localStorage.removeItem('token');
        router.push('/signin');
      }}>Sign Out</button>
    </div>
  );
};

export default AdminPage;