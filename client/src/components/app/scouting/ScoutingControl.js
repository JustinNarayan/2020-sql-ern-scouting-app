/// Modules
import React, { useState, Fragment } from "react";

/// Components
import ScoutingSetup from "./ScoutingSetup";
import ScoutingField from "./ScoutingField";
import ScoutingScore from "./ScoutingScore";
import ScoutingMode from "./ScoutingMode";

/**
 * ScoutingControl Component
 * -------------------------
 * Isolates Scouting App functionality for simplicity (not in the same component as the modal/messages).
 * Stores relevant match scouting state data.
 * Contains all scouting app components and handles connective functionality.
 * Bundles scouting data before submission.
 */
const ScoutingControl = () => {
   // State
   const [scoutName, setScoutName] = useState("");
   const [matchNumber, setMatchNumber] = useState("");
   const [teamNumber, setTeamNumber] = useState(0);

   const [inner, setInner] = useState(0);
   const [outer, setOuter] = useState(0);
   const [bottom, setBottom] = useState(0);
   const [innerAuto, setInnerAuto] = useState(0);
   const [outerAuto, setOuterAuto] = useState(0);
   const [bottomAuto, setBottomAuto] = useState(0);
   const [pickups, setPickups] = useState(0);

   const [teamColor, setTeamColor] = useState("red");
   const [fieldFlipped, setFieldFlipped] = useState(false);
   const [activeZone, setActiveZone] = useState(6); // Center zone
   const [mode, setMode] = useState("auto");

   const [clickTarget, setClickTarget] = useState("");
   const [clickTargetTimer, setClickTargetTimer] = useState(null);
   const clickTargetTime = 100;

   // Methods
   const toggleFieldFlipped = () => setFieldFlipped(!fieldFlipped);

   const incrementScore = (where, amount) => {
      // Set variables for general score adjustment statement below
      let score, scoreAuto, setScore, setScoreAuto;

      // Determine set of variables for score adjustment
      switch (where) {
         case "inner":
            score = inner;
            scoreAuto = innerAuto;
            setScore = setInner;
            setScoreAuto = setInnerAuto;
            break;
         case "outer":
            score = outer;
            scoreAuto = outerAuto;
            setScore = setOuter;
            setScoreAuto = setOuterAuto;
            break;
         default:
            score = bottom;
            scoreAuto = bottomAuto;
            setScore = setBottom;
            setScoreAuto = setBottomAuto;
            break;
      }

      // Adjust score if valid
      if (score + amount >= 0) {
         setScore(score + amount);
         if (mode === "auto") setScoreAuto(Math.max(0, scoreAuto + amount));

         newClickTarget(`${where}_${amount}`);
      }
   };

   const incrementPickups = () => {
      console.log(pickups);
   };

   const newClickTarget = (what) => {
      setClickTarget(what);
      if (clickTargetTimer) clearTimeout(clickTarget);
      setClickTargetTimer(
         setTimeout(() => {
            setClickTarget("");
            setClickTargetTimer(null);
         }, clickTargetTime)
      );
   };

   const onChangeMode = (newMode) => {
      setMode(newMode);
   };

   // Render
   return (
      <Fragment>
         <div className={classes.userArea}>
            {mode === "auto" && (
               <ScoutingSetup
                  setScoutName={setScoutName}
                  setMatchNumber={setMatchNumber}
                  setTeamNumber={setTeamNumber}
                  setTeamColor={setTeamColor}
                  toggleFieldFlipped={toggleFieldFlipped}
               />
            )}
            {(mode === "auto" || mode === "teleop") && (
               <Fragment>
                  <ScoutingField
                     fieldFlipped={fieldFlipped}
                     active={activeZone}
                     setActive={setActiveZone}
                     teamNumber={teamNumber}
                     teamColor={teamColor}
                  />
                  <ScoutingScore
                     clickTarget={clickTarget}
                     bottom={bottom}
                     outer={outer}
                     inner={inner}
                     pickups={pickups}
                     incrementScore={incrementScore}
                     incrementPickups={incrementPickups}
                  />
               </Fragment>
            )}
         </div>
         <ScoutingMode mode={mode} onChangeMode={onChangeMode} />
      </Fragment>
   );
};

const classes = {
   userArea: "userArea",
};

/// Export
export default ScoutingControl;
