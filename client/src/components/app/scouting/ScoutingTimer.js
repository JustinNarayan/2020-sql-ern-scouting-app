/// Modules
import React, { Fragment } from "react";

const ScoutingTimer = ({
   time,
   showTimer,
   isRunning,
   setupComplete,
   clickTimer,
   prepareConfirmModal,
}) => {
   return (
      <div className={classes.timerButtons}>
         {showTimer ? (
            <button
               className={isRunning ? classes.on : classes.timer}
               onClick={clickTimer}>
               {setupComplete || isRunning ? time : "! ! ! ! !"}
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
   timer: "timer",
   on: "timer on",
   options: "options",
};

export default ScoutingTimer;
