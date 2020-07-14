/// Modules
import React from "react";

const ScoutingScore = ({
   clickTarget,
   inner,
   outer,
   bottom,
   pickups,
   incrementScore,
   incrementPickups,
}) => {
   return (
      <div className={classes.sidebar}>
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

const classes = {
   sidebar: "sidebar",
   buttonRow: "buttonRow",
   symbol: "symbol",
   active: "symbol active",
   activePickup: "active",
   red: "text-danger",
};

export default ScoutingScore;
