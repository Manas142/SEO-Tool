import React, { useState } from "react";
import MyContext from "./context";


const ContextProvider = ({ children }) => {
  const [value, setValue] = useState();

  return (
    <MyContext.Provider value={{ value, setValue }}>
      {children}
    </MyContext.Provider>
  );
};

export default ContextProvider;
