import { createContext, useContext, useState } from "react";


const authContext = createContext({});

export const AuthProvider = ({ children }) => {
  const auth = useAuthSettings();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => {
    return useContext(authContext);
}

const useAuthSettings = () => {
    const [ userId, setUserId ] = useState('');
    const [ username, setUsername ] = useState('');
    const [ isAdmin, setIsAdmin ] = useState(false);
    const [ isLoggedIn, setIsLoggedIn ] = useState(false);

    return {
        userId,
        setUserId,
        username,
        setUsername,
        isAdmin,
        setIsAdmin,
        isLoggedIn,
        setIsLoggedIn
    }
}
