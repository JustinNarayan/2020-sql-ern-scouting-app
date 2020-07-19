/// Modules
import React from "react";
import PropTypes from "prop-types";

/**
 * ScoutingMisc Component
 * ----------------------
 * Manage miscellaneous screen of scouting app.
 */
const ScoutingMisc = ({ setComments, setDefenseQuality, defenseQuality }) => {
   /**
    * Render component
    */
   return (
      <div className={classes.misc}>
         {/* Comment box */}
         <textarea onChange={(e) => setComments(e.target.value)}></textarea>

         {/* Defense Quality */}
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

/// Inline class manager
const classes = {
   misc: "misc",
   on: "on",
   buttonLine: "buttonLine",
};

/// Prop Types
ScoutingMisc.propTypes = {
   setComments: PropTypes.func, // To update comment box value
   setDefenseQuality: PropTypes.func, // To update defense quality value
   defenseQuality: PropTypes.number, // To highlight correct box
};

/// Export
export default ScoutingMisc;
