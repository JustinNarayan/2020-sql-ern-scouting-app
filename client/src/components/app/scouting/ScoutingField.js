/// Modules
import React from "react";

const ScoutingField = () => {
   // Render
   return (
      <div className={classes.field}>
         <div className={classes.zone.group}>
            <button className={classes.zone._0}>0</button>
            <button className={classes.zone._1}>1</button>
            <button className={classes.zone._2}>2</button>
         </div>
         <div className={classes.zone.group}>
            <button className={classes.zone._3}>3</button>
            <button className={classes.zone._4}>4</button>
         </div>
         <div className={classes.zone.group}>
            <button className={classes.zone._5}>5</button>
            <button className={classes.zone._6}>6</button>
            <button className={classes.zone._7}>7</button>
         </div>
         <div className={classes.zone.group}>
            <button className={classes.zone._8}>8</button>
            <button className={classes.zone._9}>9</button>
         </div>
         <div className={classes.zone.group}>
            <button className={classes.zone._10}>10</button>
            <button className={classes.zone._11}>11</button>
            <button className={classes.zone._12}>12</button>
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
   },
};

/// Export
export default ScoutingField;
