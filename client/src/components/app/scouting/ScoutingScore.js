/// Modules
import React from "react";
import PropTypes from "prop-types";

/**
 * ScoutingScore Component
 * -----------------------
 * Allows user to record robot's scoring and pickups.
 */
const ScoutingScore = ({
   clickTarget,
   inner,
   outer,
   bottom,
   pickups,
   incrementScore,
   incrementPickups,
}) => {
   /**
    * Render component
    */
   return (
      <div className={classes.sidebar}>
         {/* Inner Score Row */}
         <div className={classes.buttonRow}>
            <button
               className={
                  clickTarget === "inner_-1" ? classes.active : classes.symbol
               }
               onClick={() => incrementScore("inner", -1)}>
               &minus;
            </button>
            <button>
               INNER
               <br />
               {inner}
            </button>
            <button
               className={
                  clickTarget === "inner_1" ? classes.active : classes.symbol
               }
               onClick={() => incrementScore("inner", 1)}>
               +
            </button>
         </div>

         {/* Outer Score Row */}
         <div className={classes.buttonRow}>
            <button
               className={
                  clickTarget === "outer_-1" ? classes.active : classes.symbol
               }
               onClick={() => incrementScore("outer", -1)}>
               &minus;
            </button>
            <button>
               OUTER
               <br />
               {outer}
            </button>
            <button
               className={
                  clickTarget === "outer_1" ? classes.active : classes.symbol
               }
               onClick={() => incrementScore("outer", 1)}>
               +
            </button>
         </div>

         {/* Bottom Score Row */}
         <div className={classes.buttonRow}>
            <button
               className={
                  clickTarget === "bottom_-1" ? classes.active : classes.symbol
               }
               onClick={() => incrementScore("bottom", -1)}>
               &minus;
            </button>
            <button>
               BOTTOM
               <br />
               {bottom}
            </button>
            <button
               className={
                  clickTarget === "bottom_1" ? classes.active : classes.symbol
               }
               onClick={() => incrementScore("bottom", 1)}>
               +
            </button>
         </div>

         {/* Pickup Button */}
         <button
            className={clickTarget === "pickup" ? classes.activePickup : ""}
            onClick={incrementPickups}>
            PICKUP
            <br />
            {pickups}
         </button>
      </div>
   );
};

/// Inline class manager
const classes = {
   sidebar: "sidebar",
   buttonRow: "buttonRow",
   symbol: "symbol",
   active: "symbol active",
   activePickup: "active",
   red: "text-danger",
};

/// Prop Types
ScoutingScore.propTypes = {
   clickTarget: PropTypes.string, // Which, if any, button was last clicked to highlight temporarily
   inner: PropTypes.number, // How many inner shots have been scored
   outer: PropTypes.number, // How many outer shots have been scored
   bottom: PropTypes.number, // How many bottom shots have been scored
   pickups: PropTypes.number, // How many pickups have happened
   incrementScore: PropTypes.func, // Function to add (or subtract) from scores
   incrementPickups: PropTypes.func, // Function to add new pickup
};

/// Export
export default ScoutingScore;
