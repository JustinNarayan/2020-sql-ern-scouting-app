/// Modules
import React, { Fragment } from "react";

const ScoutingTimer = ({
   time,
   showTimer,
   isRunning,
   mustChange,
   setupComplete,
   clickTimer,
   prepareConfirmModal,
}) => {
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
               {mustChange
                  ? "TELE-OP"
                  : setupComplete || isRunning
                  ? time
                  : "! ! ! ! !"}
            </button>
         ) : (
            <Fragment>
               <button
                  className={classes.options}
                  onClick={() => prepareConfirmModal("Submit")}>
                  SUBMIT
               </button>
               <button
                  className={classes.options}
                  onClick={() => prepareConfirmModal("Home")}>
                  HOME
               </button>
            </Fragment>
         )}
      </div>
   );
};

const classes = {
   timerButtons: "timerButtons",
   mustChangeRed: "mustChange red",
   mustChangeBlue: "mustChange blue",
   timer: "timer",
   on: "timer on",
   options: "options",
};

export default ScoutingTimer;
