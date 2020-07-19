/// Modules
import React from "react";

const ScoutingMisc = ({ setComments, setDefenseQuality, defenseQuality }) => {
   return (
      <div className={classes.misc}>
         <textarea onChange={(e) => setComments(e.target.value)}></textarea>
         <div className={classes.buttonLine}>
            <button
               className={defenseQuality === 0 ? classes.on : ""}
               onClick={() => setDefenseQuality(0)}>
               NO DEFENSE
               <br />0
            </button>
            <button
               className={defenseQuality === 1 ? classes.on : ""}
               onClick={() => setDefenseQuality(1)}>
               NEGLIGIBLE
               <br />1
            </button>
            <button
               className={defenseQuality === 2 ? classes.on : ""}
               onClick={() => setDefenseQuality(2)}>
               WEAK
               <br />2
            </button>
            <button
               className={defenseQuality === 3 ? classes.on : ""}
               onClick={() => setDefenseQuality(3)}>
               EFFECTIVE
               <br />3
            </button>
            <button
               className={defenseQuality === 4 ? classes.on : ""}
               onClick={() => setDefenseQuality(4)}>
               UNBREAKABLE
               <br />4
            </button>
         </div>
      </div>
   );
};

const classes = {
   misc: "misc",
   on: "on",
   buttonLine: "buttonLine",
};

export default ScoutingMisc;
