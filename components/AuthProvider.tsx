// // import { createContext, useContext, useState } from 'react';
// // import { router } from 'expo-router';

// // interface User {
// //   employee_id: number;
// //   employee_name: string;
// //   employee_role: string;
// // }

// // interface AuthContextType {
// //   isAuthenticated: boolean;
// //   user: User | null;
// //   login: (employeeName: string, pin: string) => Promise<void>;
// //   logout: () => void;
// // }

// // const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // export default function AuthProvider({ children }: { children: React.ReactNode }) {
// //   const [isAuthenticated, setIsAuthenticated] = useState(false);
// //   const [user, setUser] = useState<User | null>(null);

// //   const login = async (employeeName: string, pin: string) => {
// //     try {
// //       const response = await fetch('http://192.168.129.1:3000/api/auth/login', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({ employee_name: employeeName, pin }),
// //       });

// //       if (!response.ok) {
// //         const errorData = await response.json();
// //         throw new Error(errorData.message || 'Login failed');
// //       }

// //       const data = await response.json();
      
// //       setUser({
// //         employee_id: data.employee_id,
// //         employee_name: employeeName, // Send back from frontend since backend doesn't return it
// //         employee_role: data.employee_role
// //       });
      
// //       setIsAuthenticated(true);
// //       router.replace('/(tabs)/home');
// //     } catch (error) {
// //       console.error('Login error:', error);
// //       throw error;
// //     }
// //   };

// //   const logout = () => {
// //     setUser(null);
// //     setIsAuthenticated(false);
// //     router.replace('/(auth)/login');
// //   };

 

// //   return (
// //     <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // }

// // export const useAuth = () => {
// //   const context = useContext(AuthContext);
// //   if (!context) {
// //     throw new Error('useAuth must be used within an AuthProvider');
// //   }
// //   return context;
// // };

// import { createContext, useContext, useState, ReactNode } from 'react';
// import { router } from 'expo-router';

// interface User {
//   employee_id: number;
//   employee_name: string;
//   employee_role: string;
// }

// interface AuthContextType {
//   user: User | null;
//   isLoading: boolean;
//   login: (employeeName: string, pin: string) => Promise<void>;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const login = async (employeeName: string, pin: string) => {
//     try {
//       setIsLoading(true);
//       // Replace with your actual API call
//       const response = await fetch('http://192.168.129.1:3000/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ employee_name: employeeName, pin }),
//       });
      
//       const data = await response.json();
//       setUser({
//         employee_id: data.employee_id,
//         employee_name: employeeName,
//         employee_role: data.employee_role
//       });
//       router.replace('/(tabs)/home');
//     } catch (error) {
//       console.error('Login error:', error);
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     router.replace('/(auth)/login');
//   };

//   return (
//     <AuthContext.Provider value={{ user, isLoading, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

