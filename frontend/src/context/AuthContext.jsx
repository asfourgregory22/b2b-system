import { createContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }){
    return (
        <AuthContext.Provider value ={null}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;