/// Modules
import React from "react";
import PropTypes from "prop-types";

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
      misc: "misc",
   },
};

/// Prop Types
ScoutingMode.propTypes = {
   mode: PropTypes.string, // Current mode to get selected css for correct box
   onChangeMode: PropTypes.func, // Function to handle changing mode
};

/// Export
export default ScoutingMode;
