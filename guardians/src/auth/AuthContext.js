// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { setCookie, destroyCookie, parseCookies  } from 'nookies';

import api, {setAuthToken} from 'src/axiosInstance';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('dcdcd---');
    const cookies = parseCookies();
    const storedUser = cookies.user ? JSON.parse(cookies.user) : null;
    if (storedUser) {
      const checkExpiration = async()=>{
        try{
          setAuthToken(storedUser.token)
          const res = await api.get('users/doormans');
        }catch(er){
          const resp = await api.post('users/token/regenerate', {refreshToken: storedUser.refreshToken});
          setUser({...storedUser, token: resp.data.accessToken});
          setIsAuthenticated(true);
          setCookie(null, 'user', JSON.stringify({...storedUser, token: resp.data.accessToken,refreshToken: resp.data.refreshToken }), { path: '/' });
        }
      }
      
      setUser(storedUser);
      setIsAuthenticated(true);
      // checkExpiration();
    }
    setLoading(false);
  }, []);

  // Simulate a login function
  const login = async (values) => {
    const user = values;
    const data = values;
    try{
      const res = await api.post('users/login', data);

      if(res.data){
        setUser(res.data);
        setIsAuthenticated(true);
        setCookie(null, 'user', JSON.stringify(res.data), { path: '/' });
        return true;
      }else{
        return false;
      }
    }catch (er){
      return false;
    }
  };

  // Simulate a logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    destroyCookie(null, 'user', { path: '/' });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user,loading,  login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
