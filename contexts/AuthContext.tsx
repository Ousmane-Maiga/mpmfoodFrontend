// // sc/contexts/AuthContexts

// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { loginEmployee } from '@/services/api';

// interface AuthUser {
//   id: string;
//   role: string;
//   name: string;
//   email?: string;
// }

// interface AuthContextType {
//   user: AuthUser | null;
//   loading: boolean;
//   onBreak: boolean;
//   login: (credentials: { employee_name: string; pin: string }) => Promise<void>;
//   logout: () => Promise<void>;
//   toggleBreak: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export function AuthProvider({ children }: AuthProviderProps) {
//   const [user, setUser] = useState<AuthUser | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [onBreak, setOnBreak] = useState(false);

//   // Load break status from storage on app start
//   useEffect(() => {
//     const loadBreakStatus = async () => {
//       try {
//         const breakStatus = await AsyncStorage.getItem('@breakStatus');
//         if (breakStatus) {
//           setOnBreak(JSON.parse(breakStatus));
//         }
//       } catch (error) {
//         console.error('Error loading break status:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadBreakStatus();
//   }, []);

//   const login = async ({ employee_name, pin }: { employee_name: string; pin: string }) => {
//     setLoading(true);
//     try {
//       const response = await loginEmployee(employee_name, pin);
      
//       if (!response?.employee_role) {
//         throw new Error('Invalid credentials');
//       }

//       const userData: AuthUser = {
//         id: response.employee_id,
//         role: response.employee_role,
//         name: employee_name
//       };

//       await AsyncStorage.setItem('@userData', JSON.stringify(userData));
//       setUser(userData);
//       await AsyncStorage.removeItem('@breakStatus');
//       setOnBreak(false);
//     } catch (error) {
//       console.error('Login error:', error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = async () => {
//     setLoading(true);
//     try {
//       await AsyncStorage.removeItem('@userData');
//       await AsyncStorage.removeItem('@breakStatus');
//       setUser(null);
//       setOnBreak(false);
//     } catch (error) {
//       console.error('Logout error:', error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleBreak = async () => {
//     const newBreakStatus = !onBreak;
//     setLoading(true);
//     try {
//       setOnBreak(newBreakStatus);
//       await AsyncStorage.setItem('@breakStatus', JSON.stringify(newBreakStatus));
//     } catch (error) {
//       console.error('Error saving break status:', error);
//       setOnBreak(!newBreakStatus); // Revert on error
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Load user data on initial render
//   useEffect(() => {
//     const loadUserData = async () => {
//       try {
//         const userData = await AsyncStorage.getItem('@userData');
//         if (userData) {
//           setUser(JSON.parse(userData));
//         }
//       } catch (error) {
//         console.error('Error loading user data:', error);
//       }
//     };
//     loadUserData();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ 
//       user, 
//       loading, 
//       onBreak,
//       login, 
//       logout,
//       toggleBreak
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };




// src/contexts/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
    loginEmployee, 
    logoutEmployee, // Keep logoutEmployee if you have a backend logout API
    logShiftStart,  // NEW import
    logShiftEnd,    // NEW import
    logBreakStart,  // NEW import
    logBreakEnd     // NEW import
} from '@/services/api';

// Assuming Employee type from backend for login response, or define it locally
interface AuthUser {
    id: string;
    role: string;
    name: string;
    email?: string; // Optional email
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
    const breakStartTime = useRef<Date | null>(null); // To track the exact start time of a break

    // Load break status and user data from storage on app start
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoading(true);
                // Load break status
                const breakStatus = await AsyncStorage.getItem('@breakStatus');
                if (breakStatus) {
                    setOnBreak(JSON.parse(breakStatus));
                }

                // Load user data
                const userData = await AsyncStorage.getItem('@userData');
                if (userData) {
                    setUser(JSON.parse(userData));
                }
            } catch (error) {
                console.error('Error loading initial data from AsyncStorage:', error);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, []);

    const login = async ({ employee_name, pin }: { employee_name: string; pin: string }) => {
        setLoading(true);
        try {
            const response = await loginEmployee(employee_name, pin);
            
            if (!response?.employee_id || !response?.employee_role || !response?.employee_name) {
                throw new Error('Invalid login response from server');
            }

            const userData: AuthUser = {
                id: response.employee_id,
                role: response.employee_role,
                name: response.employee_name // Use name from response if available, otherwise employee_name
            };

            await AsyncStorage.setItem('@userData', JSON.stringify(userData));
            setUser(userData);
            
            // Log shift start to backend
            const loginTimestamp = new Date().toISOString();
            console.log(`Frontend: Logging shift start for ${userData.id} at ${loginTimestamp}`);
            await logShiftStart(userData.id, loginTimestamp);

            // Clear any lingering break status from previous session on new login
            await AsyncStorage.removeItem('@breakStatus');
            setOnBreak(false);

        } catch (error) {
            console.error('Login error:', error);
            throw error; // Re-throw to propagate error to UI
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            if (user?.id) {
                // Log shift end to backend
                const logoutTimestamp = new Date().toISOString();
                console.log(`Frontend: Logging shift end for ${user.id} at ${logoutTimestamp}`);
                await logShiftEnd(user.id, logoutTimestamp);

                // If currently on break, end the break before logging out
                if (onBreak && breakStartTime.current) {
                    const breakEndTime = new Date().toISOString();
                    const durationMinutes = Math.round((new Date(breakEndTime).getTime() - breakStartTime.current.getTime()) / (1000 * 60));
                    console.log(`Frontend: Logging break end during logout for ${user.id} at ${breakEndTime}, duration ${durationMinutes}m`);
                    await logBreakEnd(user.id, breakEndTime, breakStartTime.current.toISOString(), durationMinutes);
                }
            }
            
            // Perform actual logout from API if you have one, or just clear local storage
            await logoutEmployee(); // This might be a dummy function if backend doesn't track sessions explicitly

            await AsyncStorage.removeItem('@userData');
            await AsyncStorage.removeItem('@breakStatus');
            setUser(null);
            setOnBreak(false);
            breakStartTime.current = null; // Clear break start time
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const toggleBreak = async () => {
        if (!user?.id) {
            console.warn('Cannot toggle break: User not logged in.');
            return;
        }

        const currentTimestamp = new Date();
        setLoading(true);
        try {
            if (onBreak) {
                // Ending break
                if (breakStartTime.current) {
                    const durationMinutes = Math.round((currentTimestamp.getTime() - breakStartTime.current.getTime()) / (1000 * 60));
                    console.log(`Frontend: Logging break end for ${user.id} at ${currentTimestamp.toISOString()}, duration ${durationMinutes}m`);
                    await logBreakEnd(user.id, currentTimestamp.toISOString(), breakStartTime.current.toISOString(), durationMinutes);
                } else {
                    console.warn('Break end requested, but breakStartTime was null. Logging with current time only.');
                    await logBreakEnd(user.id, currentTimestamp.toISOString(), currentTimestamp.toISOString(), 0); // Log with 0 duration if start time is missing
                }
                setOnBreak(false);
                breakStartTime.current = null;
            } else {
                // Starting break
                breakStartTime.current = currentTimestamp; // Store the actual start time
                console.log(`Frontend: Logging break start for ${user.id} at ${currentTimestamp.toISOString()}`);
                await logBreakStart(user.id, currentTimestamp.toISOString());
                setOnBreak(true);
            }
            await AsyncStorage.setItem('@breakStatus', JSON.stringify(!onBreak)); // Persist new break status
        } catch (error) {
            console.error('Error toggling break status:', error);
            // Revert UI state on error
            setOnBreak(prev => !prev); 
            throw error;
        } finally {
            setLoading(false);
        }
    };

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
