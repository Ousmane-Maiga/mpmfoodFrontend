// // contexts/AuthContext.tsx (No changes needed)
// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { loginEmployee } from '../services/api';

// interface AuthUser {
//   id: string;
//   role: string;
//   name: string;
//   email?: string;
// }

// interface AuthContextType {
//   user: AuthUser | null;
//   loading: boolean;
//   login: (credentials: { employee_name: string; pin: string }) => Promise<void>;
//   logout: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<AuthUser | null>(null);
//   const [loading, setLoading] = useState(true);


//   const login = async ({ employee_name, pin }: { employee_name: string; pin: string }) => {
//     setLoading(true);
//     try {
//       const response = await loginEmployee(employee_name, pin);
      
//       if (!response?.employee_role) {
//         throw new Error('Invalid credentials');
//       }

//       const userData = {
//         id: response.employee_id.toString(),
//         role: response.employee_role,
//         name: employee_name
//       };

//       await AsyncStorage.setItem('@userData', JSON.stringify(userData));
//       setUser(userData);
//     } catch (error) {
//       console.error('Login error:', error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = async () => {
//     try {
//       await AsyncStorage.removeItem('@userData');
//       setUser(null);
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   };

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const userData = await AsyncStorage.getItem('@userData');
//         if (userData) {
//           setUser(JSON.parse(userData));
//         }
//       } catch (error) {
//         console.error('Auth check error:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     checkAuth();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, loading, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };



import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginEmployee } from '@/services/api';

interface AuthUser {
  id: string;
  role: string;
  name: string;
  email?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  onBreak: boolean;
  login: (credentials: { employee_name: string; pin: string }) => Promise<void>;
  logout: () => Promise<void>;
  toggleBreak: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [onBreak, setOnBreak] = useState(false);

  // Load break status from storage on app start
  useEffect(() => {
    const loadBreakStatus = async () => {
      try {
        const breakStatus = await AsyncStorage.getItem('@breakStatus');
        if (breakStatus) {
          setOnBreak(JSON.parse(breakStatus));
        }
      } catch (error) {
        console.error('Error loading break status:', error);
      } finally {
        setLoading(false);
      }
    };
    loadBreakStatus();
  }, []);

  const login = async ({ employee_name, pin }: { employee_name: string; pin: string }) => {
    setLoading(true);
    try {
      const response = await loginEmployee(employee_name, pin);
      
      if (!response?.employee_role) {
        throw new Error('Invalid credentials');
      }

      const userData: AuthUser = {
        id: response.employee_id,
        role: response.employee_role,
        name: employee_name
      };

      await AsyncStorage.setItem('@userData', JSON.stringify(userData));
      setUser(userData);
      await AsyncStorage.removeItem('@breakStatus');
      setOnBreak(false);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await AsyncStorage.removeItem('@userData');
      await AsyncStorage.removeItem('@breakStatus');
      setUser(null);
      setOnBreak(false);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const toggleBreak = async () => {
    const newBreakStatus = !onBreak;
    setLoading(true);
    try {
      setOnBreak(newBreakStatus);
      await AsyncStorage.setItem('@breakStatus', JSON.stringify(newBreakStatus));
    } catch (error) {
      console.error('Error saving break status:', error);
      setOnBreak(!newBreakStatus); // Revert on error
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Load user data on initial render
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('@userData');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    loadUserData();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      onBreak,
      login, 
      logout,
      toggleBreak
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};