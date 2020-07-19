/// Modules
import React from "react";
import PropTypes from "prop-types";

/**
 * ScoutingState Component
 * -----------------------
 * Allow scouts to manage robot state (defense, malfunction, endgame).
 */
const ScoutingState = ({
   toggleState,
   defendedTime,
   defendingTime,
   malTime,
   defendedOn,
   defendingOn,
   malOn,
   endgame,
   toggleEndgame,
}) => {
   /**
    * Render component
    */
   return (
      <div className={classes.sidebar}>
         {/* Defended button */}
         <button
            className={defendedOn ? classes.on : ""}
            onClick={() => toggleState("defended")}>
            DEFENDED
            <br />
            {defendedTime}
         </button>

         {/* Defending Button */}
         <button
            className={defendingOn ? classes.on : ""}
            onClick={() => toggleState("defending")}>
            DEFENDING
            <br />
            {defendingTime}
         </button>

         {/* Mal Button */}
         <button
            className={malOn ? classes.on : ""}
            onClick={() => toggleState("mal")}>
            MALFUNCTION
            <br />
            {malTime}
         </button>

         {/* Endgame Buttons */}
         <div className={classes.buttonSet}>
            <button
               className={endgame === "Parked" ? classes.on : ""}
               onClick={() => toggleEndgame("Parked")}>
               PARKED
            </button>
            <button
               className={endgame === "Hanged" ? classes.on : ""}
               onClick={() => toggleEndgame("Hanged")}>
               HANGED
            </button>
         </div>
      </div>
   );
};

/// Inline class manager
const classes = {
   sidebar: "sidebar",
   on: "on",
   buttonSet: "buttonSet",
};

/// Prop Types
ScoutingState.propTypes = {
   toggleState: PropTypes.func, // Toggle a time-based state (defended, defending, mal)
   defendedTime: PropTypes.string, // Readable representation of elapsed defended time
   defendingTime: PropTypes.string, // Readable representation of elapsed defending time
   malTime: PropTypes.string, // Readable representation of elapsed mal time
   defendedOn: PropTypes.number, // Numeric setInterval ID (treated as boolean) for if currently defended
   defendingOn: PropTypes.number, // Numeric setInterval ID (treated as boolean) for if currently defending
   malOn: PropTypes.number, // Numeric setInterval ID (treated as boolean) for if currently mal-ing
   endgame: PropTypes.string, // Selected endgame option (or nothing)
   toggleEndgame: PropTypes.func, // Select (or deselect) an endgame option
};

/// Export
export default ScoutingState;
