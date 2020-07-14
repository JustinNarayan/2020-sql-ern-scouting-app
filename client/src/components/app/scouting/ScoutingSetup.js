/// Modules
import React from "react";

const ScoutingSetup = ({
   setScoutName,
   setMatchNumber,
   setTeamNumber,
   setTeamColor,
   toggleFieldFlipped,
}) => {
   return (
      <div className={classes.sidebar}>
         <div className={classes.buttonRow}>
            <button className={classes.info.button}>
               <div className={classes.info.longGroup}>
                  <label htmlFor='scoutName'>SCOUT NAME</label>
                  <input
                     type='text'
                     name='scoutName'
                     id='scoutName'
                     onChange={(e) => setScoutName(e.target.value)}
                  />
               </div>
               <div className={classes.info.row}>
                  <div className={classes.info.shortGroup}>
                     <label htmlFor='matchNumber'>MATCH</label>
                     <input
                        type='text'
                        name='matchNumber'
                        id='matchNumber'
                        onChange={(e) => setMatchNumber(e.target.value)}
                     />
                  </div>
                  <div className={classes.info.shortGroup}>
                     <label htmlFor='teamNumber'>TEAM</label>
                     <input
                        type='number'
                        min='0'
                        name='teamNumber'
                        id='teamNumber'
                        onChange={(e) => setTeamNumber(e.target.value)}
                     />
                  </div>
               </div>
            </button>
         </div>
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
         <button className={classes.crossLine}>CROSS LINE</button>
      </div>
   );
};

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
   crossLine: "crossLine",
};

export default ScoutingSetup;
