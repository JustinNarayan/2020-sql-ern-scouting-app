/// Modules
import React from "react";

/**
 * ScoutingMode Component
 * ------------------
 * Switches between the stages of a match.
 */
const ScoutingMode = ({ mode, onChangeMode }) => {
   /**
    * Render component
    */
   return (
      <div className={classes.mode}>
         <button
            className={mode === "auto" ? classes.buttons.auto : ""}
            onClick={() => onChangeMode("auto")}>
            AUTONOMOUS
         </button>
         <button
            className={mode === "teleop" ? classes.buttons.teleop : ""}
            onClick={() => onChangeMode("teleop")}>
            TELE-OPERATED
         </button>
         <button
            className={mode === "endgame" ? classes.buttons.endgame : ""}
            onClick={() => onChangeMode("endgame")}>
            ENDGAME
         </button>
         <button
            className={mode === "misc" ? classes.buttons.misc : ""}
            onClick={() => onChangeMode("misc")}>
            MISCELLANEOUS
         </button>
      </div>
   );
};

/// Inline class manager
const classes = {
   mode: "mode",
   buttons: {
      auto: "auto",
      teleop: "teleop",
      endgame: "endgame",
      misc: "misc",
   },
};

/// Export
export default ScoutingMode;
