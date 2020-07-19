/// Modules
import React from "react";
import PropTypes from "prop-types";

/**
 * ScoutingSetup Component
 * -----------------------
 * Allow scouts to handle setup and autonomous movement scouting data
 */
const ScoutingSetup = ({
   setScoutName,
   setMatchNumber,
   setTeamNumber,
   setTeamColor,
   toggleFieldFlipped,
   crossLine,
   toggleCrossLine,
}) => {
   /**
    * Render component
    */
   return (
      <div className={classes.sidebar}>
         <div className={classes.buttonRow}>
            {/* ScoutName, MatchNumber, and TeamNumber info */}
            <button className={classes.info.button}>
               <div className={classes.info.longGroup}>
                  <label htmlFor='scoutName'>SCOUT NAME</label>
                  <input
                     type='text'
                     id='scoutName'
                     onChange={(e) => setScoutName(e.target.value)}
                  />
               </div>
               <div className={classes.info.row}>
                  <div className={classes.info.shortGroup}>
                     <label htmlFor='matchNumber'>MATCH</label>
                     <input
                        type='text'
                        id='matchNumber'
                        onChange={(e) => setMatchNumber(e.target.value)}
                     />
                  </div>
                  <div className={classes.info.shortGroup}>
                     <label htmlFor='teamNumber'>TEAM</label>
                     <input
                        type='number'
                        min='0'
                        id='teamNumber'
                        onChange={(e) => setTeamNumber(e.target.value)}
                     />
                  </div>
               </div>
            </button>
         </div>

         {/* Field orientation and Team color */}
         <div className={classes.buttonRow}>
            <button
               className={classes.flipRed}
               onClick={() => setTeamColor("red")}>
               RED
            </button>
            <button onClick={toggleFieldFlipped}>FLIP</button>
            <button
               className={classes.flipBlue}
               onClick={() => setTeamColor("blue")}>
               BLUE
            </button>
         </div>

         {/* Cross Line */}
         <button
            className={crossLine ? classes.on : classes.crossLine}
            onClick={toggleCrossLine}>
            CROSS LINE
         </button>
      </div>
   );
};

/// Inline class manager
const classes = {
   sidebar: "sidebar",
   buttonRow: "buttonRow",
   info: {
      button: "info button",
      row: "info row",
      longGroup: "info group",
      shortGroup: "info group short",
   },
   flipRed: "flipRed",
   flipBlue: "flipBlue",
   on: "crossLine on",
   crossLine: "crossLine",
};

/// Prop Types
ScoutingSetup.propTypes = {
   setScoutName: PropTypes.func, // Set scoutName field
   setMatchNumber: PropTypes.func, // Set matchNumber field
   setTeamNumber: PropTypes.func, // Set teamNumber field
   setTeamColor: PropTypes.func, // Set teamColor for team number in field
   toggleFieldFlipped: PropTypes.func, // Switch the orientation (colors) on field
   crossLine: PropTypes.bool, // If the initiation line has been crossed
   toggleCrossLine: PropTypes.func, // Toggle initiation line crossing
};

/// Export
export default ScoutingSetup;
