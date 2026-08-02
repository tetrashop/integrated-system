import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // بررسی session در localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (username, password) => {
    try {
      // در محیط واقعی، درخواست به API ارسال می‌شود
      const validUsers = {
        'admin': { password: 'admin123', name: 'مدیر سیستم', role: 'admin' },
        'user': { password: 'user123', name: 'کاربر عادی', role: 'user' }
      };

      const userData = validUsers[username];
      if (!userData || userData.password !== password) {
        throw new Error('نام کاربری یا رمز عبور اشتباه است');
      }

      const sessionUser = {
        username,
        name: userData.name,
        role: userData.role,
        loginTime: new Date().toISOString()
      };

      localStorage.setItem('user', JSON.stringify(sessionUser));
      setUser(sessionUser);
      return sessionUser;
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
