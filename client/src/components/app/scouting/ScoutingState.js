/// Modules
import React from "react";

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
   return (
      <div className={classes.sidebar}>
         <button
            className={defendedOn ? classes.on : ""}
            onClick={() => toggleState("defended")}>
            DEFENDED
            <br />
            {defendedTime}
         </button>
         <button
            className={defendingOn ? classes.on : ""}
            onClick={() => toggleState("defending")}>
            DEFENDING
            <br />
            {defendingTime}
         </button>
         <button
            className={malOn ? classes.on : ""}
            onClick={() => toggleState("mal")}>
            MALFUNCTION
            <br />
            {malTime}
         </button>
         <div className={classes.buttonSet}>
            <button
               className={endgame === "parked" ? classes.on : ""}
               onClick={() => toggleEndgame("parked")}>
               PARKED
            </button>
            <button
               className={endgame === "hanged" ? classes.on : ""}
               onClick={() => toggleEndgame("hanged")}>
               HANGED
            </button>
         </div>
      </div>
   );
};

const classes = {
   sidebar: "sidebar",
   on: "on",
   buttonSet: "buttonSet",
};

export default ScoutingState;
