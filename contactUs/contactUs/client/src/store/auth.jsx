import { createContext,useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const storeTokenInLs = (serverToken) => {
    return localStorage.setItem("token", serverToken);
  };

  return (
    <AuthContext.Provider value={{ storeTokenInLs}}>
      {children}
    </AuthContext.Provider>
  );
};
  
export const useAuth = () => {
  const authContextvalue = useContext(AuthContext);
  if (!authContextvalue) {
    throw new Error('useAuth hook can only be used inside an AuthProvider');
  }
  return authContextvalue;
};

  


