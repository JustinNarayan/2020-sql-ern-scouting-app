/// Modules
import React, { useState, Fragment } from "react";

/// Components
import ScoutingField from "./ScoutingField";
import ScoutingMode from "./ScoutingMode";

/**
 * ScoutingControl Component
 * -------------------------
 * Isolates Scouting App functionality for simplicity (not in the same component as the modal/messages).
 * Stores relevant match scouting state data.
 * Contains all scouting app components and handles connective functionality.
 * Bundles scouting data before submission.
 */
const ScoutingControl = () => {
   // State
   const [mode, setMode] = useState("auto");

   // Methods
   const onChangeMode = (newMode) => {
      setMode(newMode);
   };

   // Render
   return (
      <Fragment>
         <div className='div'>
            <ScoutingField />
         </div>
         <ScoutingMode mode={mode} onChangeMode={onChangeMode} />
      </Fragment>
   );
};

/// Export
export default ScoutingControl;
