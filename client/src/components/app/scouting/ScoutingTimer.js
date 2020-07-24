/// Modules
import React, { Fragment } from "react";
import PropTypes from "prop-types";

/**
 * ScoutingTimer Component
 * -----------------------
 * Manage Timer, Go Home, and Submit functions.
 */
const ScoutingTimer = ({
   time,
   showTimer,
   isRunning,
   mustChange,
   setupComplete,
   clickTimer,
   compileForConfirm,
}) => {
   /**
    * Render component
    */
   return (
      <div className={classes.timerButtons}>
         {showTimer ? (
            <button
               className={
                  mustChange
                     ? parseInt(time.slice(-1)) % 2
                        ? classes.mustChangeRed
                        : classes.mustChangeBlue
                     : isRunning
                     ? classes.on
                     : classes.timer
               }
               onClick={clickTimer}>
               {/* Set inner text */}
               {mustChange
                  ? "TELE-OP"
                  : setupComplete || isRunning
                  ? time
                  : "! ! ! ! !"}
            </button>
         ) : (
            <Fragment>
               {/* Submit button */}
               <button
                  className={classes.options}
                  onClick={() => compileForConfirm("Submit")}>
                  SUBMIT
               </button>
               {/* Go Home button */}
               <button
                  className={classes.options}
                  onClick={() => compileForConfirm("Home")}>
                  HOME
               </button>
            </Fragment>
         )}
      </div>
   );
};

/// Inline class manager
const classes = {
   timerButtons: "timerButtons",
   mustChangeRed: "mustChange red",
   mustChangeBlue: "mustChange blue",
   timer: "timer",
   on: "timer on",
   options: "options",
};

/// Prop Types
ScoutingTimer.propTypes = {
   time: PropTypes.string, // Readable representation of elapsed time
   showTimer: PropTypes.bool, // Whether to show the timer or option buttons
   isRunning: PropTypes.number, // Whether the timer has begun running
   mustChange: PropTypes.bool, // Whether the user is on the auto screen during the teleop period
   setupComplete: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // (Treated as boolean) Whether the setup inputs have been filled out
   clickTimer: PropTypes.func, // Function to handle behaviour when clicking the timer
   compileForConfirm: PropTypes.func, // Function to compile data and prepareConfirmModal
};

/// Export
export default ScoutingTimer;
