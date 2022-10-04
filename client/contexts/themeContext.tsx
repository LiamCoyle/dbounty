import React, { createContext, ReactNode, useState } from "react";

interface IThemeContext {
  darkModeToggle: any;
  toggleDarkMode: () => void;
}

interface Props {
  children?: ReactNode;
  // any props that come into the component
}

const initThemeContext: IThemeContext = {
  darkModeToggle: false,
  toggleDarkMode: () => false,
};

const ThemeContext = createContext<IThemeContext>(initThemeContext);

const ThemeProvider = ({ children }: Props) => {
  const [darkModeToggle, setDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setDarkMode(!darkModeToggle);
  };
  return (
    <ThemeContext.Provider value={{ darkModeToggle, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
export { ThemeContext, ThemeProvider };
