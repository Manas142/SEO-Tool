// import React, { useState } from "react";
// import MyContext from "./context";


// const ContextProvider = ({ children }) => {
//   const [value, setValue] = useState();

//   return (
//     <MyContext.Provider value={{ value, setValue }}>
//       {children}
//     </MyContext.Provider>
//   );
// };

// export default ContextProvider;

import React, { useState } from "react";
import appContext from "./context";

const ContextProvider = ({ children }) => {
  const [value, setValue] = useState({
    scrapedData: null,
    // Add other initial values if needed
  });

  return (
    <appContext.Provider value={{ value, setValue }}>
      {children}
    </appContext.Provider>
  );
};

export default ContextProvider;
