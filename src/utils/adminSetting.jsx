import { createContext, useContext, useState } from "react";


const settingsContext = createContext({});

export const ProvideSettings = ({ children }) => {
  const settings = useProvideSettings();
  return <settingsContext.Provider value={settings}>{children}</settingsContext.Provider>
}

export const useSettings = () => {
    return useContext(settingsContext);
}

const useProvideSettings = () => {
    const [ isHome, setIsHome ] = useState(true);

    return {
        isHome,
        setIsHome
    }
}
