/// Modules
import React from "react";

const ScoutingField = ({
   fieldFlipped,
   active,
   setActive,
   teamNumber,
   teamColor,
}) => {
   // Methods
   /// Determine zone colour
   const zoneCol = (def) => {
      switch (fieldFlipped) {
         case false:
            return ` ${def}`;
         default:
            return def === "red" ? " blue" : " red";
      }
   };

   const isOn = (num) => (active === num ? " active" : "");

   // Render
   return (
      <div className={classes.field}>
         <div className={classes.zone.group}>
            <button
               className={classes.zone._0 + zoneCol("red") + isOn(0)}
               onClick={() => setActive(0)}
            />
            <button
               className={classes.zone._1 + zoneCol("red") + isOn(1)}
               onClick={() => setActive(1)}
            />
            <button
               className={classes.zone._2 + zoneCol("red") + isOn(2)}
               onClick={() => setActive(2)}
            />
         </div>
         <div className={classes.zone.group}>
            <button
               className={classes.zone._3 + zoneCol("red") + isOn(3)}
               onClick={() => setActive(3)}
            />
            <button
               className={classes.zone._4 + zoneCol("red") + isOn(4)}
               onClick={() => setActive(4)}
            />
         </div>
         <div className={classes.zone.group}>
            <button
               className={classes.zone._5 + zoneCol("blue") + isOn(5)}
               onClick={() => setActive(5)}
            />
            <button
               className={classes.zone._6 + isOn(6)}
               onClick={() => setActive(6)}>
               <span className={classes.zone.teamNumber + teamColor}>
                  {teamNumber}
               </span>
            </button>
            <button
               className={classes.zone._7 + zoneCol("red") + isOn(7)}
               onClick={() => setActive(7)}
            />
         </div>
         <div className={classes.zone.group}>
            <button
               className={classes.zone._8 + zoneCol("blue") + isOn(8)}
               onClick={() => setActive(8)}
            />
            <button
               className={classes.zone._9 + zoneCol("blue") + isOn(9)}
               onClick={() => setActive(9)}
            />
         </div>
         <div className={classes.zone.group}>
            <button
               className={classes.zone._10 + zoneCol("blue") + isOn(10)}
               onClick={() => setActive(10)}
            />
            <button
               className={classes.zone._11 + zoneCol("blue") + isOn(11)}
               onClick={() => setActive(11)}
            />
            <button
               className={classes.zone._12 + zoneCol("blue") + isOn(12)}
               onClick={() => setActive(12)}
            />
         </div>
      </div>
   );
};

/// Inline class manager
const classes = {
   field: "field",
   zone: {
      group: "group",
      _0: "_0",
      _1: "_1",
      _2: "_2",
      _3: "_3",
      _4: "_4",
      _5: "_5",
      _6: "_6",
      _7: "_7",
      _8: "_8",
      _9: "_9",
      _10: "_10",
      _11: "_11",
      _12: "_12",
      teamNumber: "teamNumber ", // Extra space for teamColor
   },
};

/// Export
export default ScoutingField;
